

from PIL import Image
import torch
from transformers import AutoModelForImageClassification, AutoImageProcessor

prediction = str()
chat_history = []

# Provide an image and get back a prediction
def get_prediction(image_path):
    # Using the updated pre-trained model (resnet-Alzheimer)
    repo_name = "evanrsl/resnet-Alzheimer"
    
    # Load the image processor and model from Hugging Face
    image_processor = AutoImageProcessor.from_pretrained(repo_name)
    model = AutoModelForImageClassification.from_pretrained(repo_name)

    # Load and preprocess the test image
    image = Image.open(image_path)
    encoding = image_processor(image.convert("RGB"), return_tensors="pt")

    # Make a prediction
    with torch.no_grad():
        outputs = model(**encoding)
        logits = outputs.logits

    # Get the predicted class index
    predicted_class_idx = logits.argmax(-1).item()

    # Get the class name from the model's configuration
    predicted_class_name = model.config.id2label[predicted_class_idx]

    # Set prediction as a global variable so it can be used elsewhere
    global prediction
    prediction = predicted_class_name

    return predicted_class_name
