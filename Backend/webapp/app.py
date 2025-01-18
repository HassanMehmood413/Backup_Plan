from flask import Flask, render_template, request, jsonify
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS
from model import get_prediction
from together import Together
from dotenv import load_dotenv
import requests  # Add this import
from datetime import datetime, timedelta
import random
import re





# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],  # Add your frontend URL
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Set up Together API client
client = Together(api_key=os.getenv('TOGETHER_API_KEY'))

# Serper API configuration
SERPER_API_KEY = os.getenv('SERPER_API_KEY')
SERPER_API_URL = "https://google.serper.dev/search"

# Global variables
chat_history = []
prediction = None

# Global variables
chat_history = []
prediction = None

def get_genai():
    try:
        if not any(message["role"] == "system" for message in chat_history):
            chat_history.insert(0, {
                "role": "system",
                "content": "You are an intelligent assistant specialized in Alzheimer's disease detection using MRI images. "
                        "Your goal is to help users understand the severity of Alzheimer's disease based on the MRI scan results. "
                        "The possible severity levels include 'Non_Demented', 'Very_Mild_Demented', and 'Mild_Demented'. "
                        "Based on the MRI data, you will classify the severity and provide detailed explanations for each classification, "
                        "including potential implications and recommendations for further medical consultation. "
                        "Always emphasize the importance of consulting healthcare professionals for confirmation and personalized advice."


            })

        print("Sending messages to API:", chat_history)

        response = client.chat.completions.create(
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
            messages=chat_history,
            temperature=0.7,
            top_p=0.7,
            top_k=50,
            repetition_penalty=1,
            stop=["<|eot_id|>", "<|eom_id|>"]
        )

        if not response or not hasattr(response, 'choices'):
            raise Exception("Invalid response from API")

        content = response.choices[0].message.content
        chat_history.append({"role": "assistant", "content": content})
        return content
    except Exception as e:
        print(f"API Error in get_genai: {str(e)}")
        raise

UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Set up the upload folder
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Check if file is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/find-doctors', methods=['POST'])
def find_doctors():
    try:
        print("Received doctor search request")
        data = request.json
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        location = data.get('location')
        disease = data.get('disease')
        
        if not location or not disease:
            return jsonify({'error': 'Location and disease are required'}), 400
            
        print(f"Searching for: Disease: {disease}, Location: {location}")
        
        # Construct search query
        query = f"doctors treating {disease} in {location}"
        
        # Call Serper API
        headers = {
            'X-API-KEY': SERPER_API_KEY,
            'Content-Type': 'application/json'
        }
        
        payload = {
            'q': query,
            'num': 10
        }
        
        print("Calling Serper API...")
        response = requests.post(SERPER_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        search_results = response.json()
        
        # Process and format the results
        doctors = []
        
        # Add places results first (they usually have more detailed information)
        if 'places' in search_results:
            for result in search_results['places']:
                doctors.append({
                    'title': result.get('title', ''),
                    'address': result.get('address', ''),
                    'rating': result.get('rating', None),
                    'ratingCount': result.get('ratingCount', None)
                })
        
        # Add organic results
        if 'organic' in search_results:
            for result in search_results['organic']:
                doctors.append({
                    'title': result.get('title', ''),
                    'link': result.get('link', ''),
                    'snippet': result.get('snippet', ''),
                    'position': result.get('position', '')
                })
        
        print(f"Found {len(doctors)} doctors")
        return jsonify({'doctors': doctors})
        
    except requests.exceptions.RequestException as e:
        print(f"Serper API error: {str(e)}")
        return jsonify({'error': 'Error calling search API'}), 500
    except Exception as e:
        print(f"General error in find_doctors: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/image', methods=['GET', 'POST'])
def image():
    if request.method == 'POST':
        if 'file' not in request.files:
            return "No file part", 400
        file = request.files['file']

        if file.filename == '':
            return "No file selected", 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)

            # Call the prediction function
            prediction = get_prediction(file_path)  # Use the file path

            return jsonify({'predicted_class': prediction})

        return "Invalid file type", 400

    return render_template('upload.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    # Call the prediction function
    global prediction
    prediction = get_prediction(file_path)

    return jsonify({'predicted_class': prediction})

@app.route('/chat', methods=['POST', 'GET'])
def chat():
    global prediction, chat_history  # Reference global variables

    if request.method == 'GET':
        # Reset chat history for new conversation
        chat_history = []
        system_prompt = (
            "You are an intelligent assistant specializing in providing detailed and accurate information about various diseases. "
            "Your primary objective is to educate users about different health conditions and offer practical guidance, "
            "including home remedies when safe. Always encourage users to consult a healthcare professional when necessary."
        )
        user_prompt = f"I have the following disease: {prediction}. What can you tell me about this?"

        # Add the initial prompts to the chat history
        chat_history.append({"role": "system", "content": system_prompt})
        chat_history.append({"role": "user", "content": user_prompt})

        try:
            response = get_genai()
            return jsonify({"response": response, "chat_history": chat_history})
        except Exception as e:
            print(f"Error in chat GET: {str(e)}")
            return jsonify({"error": str(e)}), 500

    elif request.method == 'POST':
        user_input = request.json.get('message', '')
        if not user_input:
            return jsonify({"error": "Message is required"}), 400

        chat_history.append({"role": "user", "content": user_input})

        try:
            response = get_genai()
            return jsonify({"response": response, "chat_history": chat_history})
        except Exception as e:
            print(f"Error in chat POST: {str(e)}")
            return jsonify({"error": str(e)}), 500

@app.route('/test-serper', methods=['GET'])
def test_serper():
    try:
        headers = {
            'X-API-KEY': SERPER_API_KEY,
            'Content-Type': 'application/json'
        }
        
        payload = {
            'q': 'doctors in New York',
            'num': 1
        }
        
        response = requests.post(SERPER_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        
        return jsonify({
            'status': 'success',
            'api_key_present': bool(SERPER_API_KEY),
            'response': response.json()
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e),
            'api_key_present': bool(SERPER_API_KEY)
        })

@app.route('/get-location', methods=['POST'])
def get_location():
    try:
        data = request.json
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        
        if not latitude or not longitude:
            return jsonify({'error': 'Latitude and longitude are required'}), 400

        # Use OpenCage to get location details
        OPENCAGE_API_KEY = os.getenv('OPENCAGE_API_KEY')
        if not OPENCAGE_API_KEY:
            return jsonify({'error': 'Geocoding service not configured'}), 500

        response = requests.get(
            f'https://api.opencagedata.com/geocode/v1/json?q={latitude}+{longitude}&key={OPENCAGE_API_KEY}'
        )
        
        if response.status_code != 200:
            return jsonify({'error': 'Error getting location details'}), 500

        location_data = response.json()
        if not location_data.get('results'):
            return jsonify({'error': 'Location not found'}), 404

        components = location_data['results'][0]['components']
        
        return jsonify({
            'city': components.get('city') or components.get('town') or components.get('state'),
            'country': components.get('country')
        })

    except Exception as e:
        print(f"Error in get_location: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/find-appointments', methods=['POST'])
def find_appointments():
    try:
        data = request.json
        location = data.get('location')
        disease = data.get('disease')
        
        if not location or not disease:
            return jsonify({'error': 'Location and disease are required'}), 400
            
        print(f"Searching for appointments: Disease: {disease}, Location: {location}")
        
        # First search specifically for doctors on medical platforms
        directory_query = (
            f"doctor appointment {disease} {location} "
            "site:marham.pk OR site:healthwire.pk OR site:oladoc.com OR "
            "site:findmydoctor.pk OR site:doctify.com"
        )
        
        headers = {
            'X-API-KEY': SERPER_API_KEY,
            'Content-Type': 'application/json'
        }
        
        directory_payload = {
            'q': directory_query,
            'num': 10
        }
        
        # Get directory listings
        directory_response = requests.post(SERPER_API_URL, headers=headers, json=directory_payload)
        directory_response.raise_for_status()
        directory_results = directory_response.json()
        
        appointments = []
        
        # Process directory results (medical platforms)
        if 'organic' in directory_results:
            for result in directory_results['organic']:
                title = result.get('title', '')
                snippet = result.get('snippet', '')
                link = result.get('link', '')
                
                # Skip news articles and irrelevant results
                if any(word in title.lower() for word in ['news', 'article', 'report', 'pdf', 'research']):
                    continue
                
                # Determine booking platform
                platform = None
                if 'marham.pk' in link:
                    platform = 'Marham'
                elif 'healthwire.pk' in link:
                    platform = 'Healthwire'
                elif 'oladoc.com' in link:
                    platform = 'Oladoc'
                elif 'findmydoctor.pk' in link:
                    platform = 'FindMyDoctor'
                elif 'doctify.com' in link:
                    platform = 'Doctify'
                
                if platform:  # Only add if it's from a medical platform
                    doctor_info = {
                        'doctorName': clean_title(title),
                        'specialty': extract_specialty(snippet),
                        'location': extract_city(location),
                        'address': extract_address(snippet),
                        'phone': extract_phone(snippet),
                        'bookingPlatform': platform,
                        'bookingLink': link,
                        'date': 'Book online',
                        'time': 'Check availability online',
                        'type': 'Online Booking',
                        'snippet': snippet
                    }
                    
                    # Only add if it looks like a valid doctor listing
                    if is_valid_doctor_listing(doctor_info):
                        appointments.append(doctor_info)
        
        # Search for physical clinics and hospitals
        places_query = f"neurologist clinic hospital {disease} treatment {location}"
        places_payload = {
            'q': places_query,
            'num': 5,
            'type': 'places'
        }
        
        places_response = requests.post(SERPER_API_URL, headers=headers, json=places_payload)
        places_results = places_response.json()
        
        # Process places results
        if 'places' in places_results:
            for place in places_results['places']:
                if is_valid_medical_facility(place.get('title', '')):
                    appointments.append({
                        'doctorName': clean_title(place.get('title', '')),
                        'specialty': 'Medical Facility',
                        'location': extract_city(location),
                        'address': place.get('address', 'Contact for address'),
                        'phone': place.get('phoneNumber', 'Contact for number'),
                        'rating': place.get('rating', None),
                        'ratingCount': place.get('ratingCount', None),
                        'type': 'Physical Clinic',
                        'date': 'Contact clinic',
                        'time': 'Contact for times',
                        'website': place.get('website', '')
                    })
        
        print(f"Found {len(appointments)} valid appointments")
        return jsonify({'appointments': appointments})
        
    except Exception as e:
        print(f"Error in find_appointments: {str(e)}")
        return jsonify({'error': str(e)}), 500

def clean_title(title):
    """Clean up doctor/facility titles."""
    # Remove common suffixes and prefixes
    title = re.sub(r'\s*[-|]\s*.*$', '', title)
    title = re.sub(r'Best\s+|Top\s+|Leading\s+', '', title)
    title = re.sub(r'\[PDF\]|\(PDF\)', '', title)
    title = re.sub(r'Dr\.\s*', 'Dr. ', title)
    return title.strip()

def extract_city(location):
    """Extract city from location string."""
    # Remove country and split by commas
    parts = location.split(',')
    return parts[0].strip()

def is_valid_doctor_listing(info):
    """Check if the listing appears to be a valid doctor."""
    title = info['doctorName'].lower()
    snippet = info.get('snippet', '').lower()
    
    # Keywords that indicate a valid doctor listing
    valid_keywords = ['doctor', 'dr.', 'clinic', 'hospital', 'specialist', 'consultant']
    
    # Keywords that indicate an invalid listing
    invalid_keywords = ['news', 'article', 'report', 'research', 'pdf', 'study']
    
    return (
        any(keyword in title or keyword in snippet for keyword in valid_keywords) and
        not any(keyword in title for keyword in invalid_keywords) and
        len(info['doctorName']) > 5
    )

def is_valid_medical_facility(title):
    """Check if the place is a valid medical facility."""
    keywords = ['hospital', 'clinic', 'medical center', 'healthcare', 'doctor']
    return any(keyword in title.lower() for keyword in keywords)

def extract_specialty(text):
    """Extract medical specialty from text."""
    specialties = [
        'Neurologist', 'Geriatrician', 'Psychiatrist', 'General Physician',
        'Neurosurgeon', 'Mental Health Specialist', 'Memory Specialist',
        'Brain Specialist', 'Dementia Specialist'
    ]
    
    text_lower = text.lower()
    for specialty in specialties:
        if specialty.lower() in text_lower:
            return specialty
            
    # Try to find specialty patterns
    specialty_pattern = r'(?:specialist|consultant|expert)\s+in\s+([^,.]+)'
    match = re.search(specialty_pattern, text_lower)
    if match:
        return match.group(1).title()
    
    return 'Specialist'

def extract_phone(text):
    """Extract phone number from text using regex."""
    # Pakistani phone number patterns
    patterns = [
        r'(?:\+92|0)[-(]?\d{3}[)-]?\d{7,8}',  # Pakistani format
        r'[\+]?[(]?\d{3}[)]?[-\s\.]?\d{3}[-\s\.]?\d{4,6}'  # General format
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0)
    
    return 'Contact for number'

def extract_address(text):
    """Extract address from text."""
    address_indicators = ['located at', 'address:', 'located in', 'clinic in', 'hospital in']
    
    # First try to find a complete address
    for indicator in address_indicators:
        if indicator in text.lower():
            start_idx = text.lower().index(indicator) + len(indicator)
            end_idx = text.find('.', start_idx)
            if end_idx != -1:
                return text[start_idx:end_idx].strip()
    
    # If no complete address found, try to extract location information
    location_pattern = r'in\s+([^,.]+(?:,[^,.]+)*)'
    match = re.search(location_pattern, text)
    if match:
        return match.group(1).strip()
    
    return 'Contact for address'

if __name__ == '__main__':
    app.run(debug=True, port=5000)
