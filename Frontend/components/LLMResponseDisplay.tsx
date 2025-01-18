'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Stethoscope } from 'lucide-react'
import DoctorResults from './DoctorResult'
import axios from 'axios'
import AppointmentDisplay from './AppointmentDisplay'

interface LLMResponseDisplayProps {
  response: string;
  chatHistory?: { role: string; content: string }[];
  result?: string | null;
}

function formatResponse(text: string) {
  // Split the text into sections based on double newlines
  const sections = text.split('\n\n')
  
  return sections.map((section, index) => {
    // Check if section is a header (starts with **)
    if (section.startsWith('**') && section.endsWith(':**')) {
      return (
        <div key={index} className="mt-6 mb-3">
          <h3 className="text-xl font-bold text-purple-700 dark:text-purple-400">
            {section.replace(/\*\*/g, '')}
          </h3>
        </div>
      )
    }
    
    // Check if section contains bullet points
    if (section.includes('1. **')) {
      const points = section.split('\n')
      return (
        <ul key={index} className="list-none space-y-3 mt-2">
          {points.map((point, pointIndex) => {
            if (point.trim()) {
              // Extract the bold text and description
              const match = point.match(/\d+\.\s+\*\*([^*]+)\*\*:\s+(.+)/)
              if (match) {
                return (
                  <li key={pointIndex} className="flex space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <span className="text-sm text-purple-600 dark:text-purple-400">{pointIndex + 1}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{match[1]}: </span>
                      <span className="text-gray-600 dark:text-gray-400">{match[2]}</span>
                    </div>
                  </li>
                )
              }
            }
            return null
          })}
        </ul>
      )
    }
    
    // Regular paragraph
    return (
      <p key={index} className="text-gray-600 dark:text-gray-400 mb-4">
        {section}
      </p>
    )
  })
}

export default function LLMResponseDisplay({ response, chatHistory, result }: LLMResponseDisplayProps) {
  const [location, setLocation] = useState('')
  const [doctors, setDoctors] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [showDoctorSearch, setShowDoctorSearch] = useState(false)

  const disease = result || chatHistory?.find(msg => msg.role === 'user')?.content

  const findDoctors = async (searchLocation: string) => {
    if (!searchLocation || !disease) {
      setSearchError('Please enter a location')
      return
    }
    
    setIsLoading(true)
    setSearchError('')
    
    try {
      console.log('Searching for doctors:', { location: searchLocation, disease })
      const response = await axios.post('http://localhost:5000/find-doctors', {
        location: searchLocation,
        disease: disease
      })
      
      console.log('Doctor search response:', response.data)
      
      if (response.data.doctors && response.data.doctors.length > 0) {
        setDoctors(response.data.doctors)
        setSearchError('')
      } else {
        setDoctors([])
        setSearchError('No healthcare providers found in your area')
      }
    } catch (error: any) {
      console.error('Error in doctor search:', error.response || error)
      setDoctors([])
      setSearchError(
        error.response?.data?.error || 
        'Error searching for healthcare providers'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const findDoctorsNearMe = async () => {
    setIsLoading(true)
    setSearchError('')
    
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              // Get location from backend to avoid CORS issues
              const locationResponse = await axios.post('http://localhost:5000/get-location', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              })
              
              if (locationResponse.data.error) {
                throw new Error(locationResponse.data.error)
              }

              const { city, country } = locationResponse.data
              const locationString = city && country ? `${city}, ${country}` : country
              
              setLocation(locationString)
              await findDoctors(locationString)
            } catch (error) {
              console.error('Location error:', error)
              setSearchError('Unable to get precise location. Please enter it manually.')
              setIsLoading(false)
            }
          },
          (error) => {
            console.error('Geolocation permission denied:', error)
            setSearchError('Location permission denied. Please enter your location manually.')
            setIsLoading(false)
          }
        )
      } else {
        setSearchError('Geolocation is not supported by your browser. Please enter your location manually.')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Location detection error:', error)
      setSearchError('Unable to detect location. Please enter it manually.')
      setIsLoading(false)
    }
  }

  const handleManualSearch = () => {
    findDoctors(location)
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">AI Analysis</h2>
        </div>
        
        <div className="prose dark:prose-invert max-w-none">
          {formatResponse(response)}
        </div>

        <div className="mt-6 flex justify-center">
          <motion.button
            onClick={() => {
              setShowDoctorSearch(true)
              findDoctorsNearMe()
            }}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Stethoscope className="w-5 h-5" />
            <span>Find Healthcare Providers Near Me</span>
          </motion.button>
        </div>

        {showDoctorSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <input
                  type="text"
                  placeholder="Enter your location (e.g., New York, NY)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                  onClick={handleManualSearch}
                  disabled={isLoading}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
            </div>

            {searchError && (
              <p className="text-red-500 mt-2">{searchError}</p>
            )}

            {doctors.length > 0 && (
              <div className="mt-6">
                <DoctorResults doctors={doctors} isLoading={isLoading} />
              </div>
            )}
          </motion.div>
        )}

        {showDoctorSearch && location && (
          <AppointmentDisplay 
            disease={disease || ''} 
            userLocation={location}
          />
        )}
      </div>
    </motion.div>
  )
}