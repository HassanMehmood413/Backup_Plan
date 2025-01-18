'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Phone, User } from 'lucide-react'
import axios from 'axios'

interface Appointment {
  doctorName: string;
  specialty: string;
  location: string;
  date: string;
  time: string;
  phone?: string;
  address?: string;
}

interface AppointmentDisplayProps {
  disease: string;
  userLocation: string;
}

interface AppointmentResponse {
    appointments: Appointment[];
}

export default function AppointmentDisplay({ disease, userLocation }: AppointmentDisplayProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchAppointments = async () => {
    if (!disease || !userLocation) {
      setError('Disease and location information required')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // First check if server is running
      await axios.get('http://localhost:5000/')
      
      const response = await axios.post<AppointmentResponse>('http://localhost:5000/find-appointments', {
        disease,
        location: userLocation
      })

      console.log('Appointments response:', response.data)

      if (response.data.appointments && response.data.appointments.length > 0) {
        setAppointments(response.data.appointments)
      } else {
        setError('No available appointments found in your area')
      }
    } catch (error: any) {
      console.error('Error fetching appointments:', error)
      setError(error.response?.data?.error || 'Failed to fetch appointments. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (disease && userLocation) {
      fetchAppointments()
    }
  }, [disease, userLocation])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-6 flex items-center">
        <Calendar className="w-6 h-6 mr-2" />
        Available Appointments
      </h2>

      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="space-y-6">
          {appointments.map((appointment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col space-y-3">
                <div className="flex items-center text-gray-800 dark:text-gray-200">
                  <User className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold">{appointment.doctorName}</span>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    ({appointment.specialty})
                  </span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Clock className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                  <span>{appointment.date} at {appointment.time}</span>
                </div>

                {appointment.address && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                    <span>{appointment.address}</span>
                  </div>
                )}

                {appointment.phone && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Phone className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
                    <span>{appointment.phone}</span>
                  </div>
                )}

                <button
                  onClick={() => {/* Add booking functionality */}}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
                >
                  Book Appointment
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}