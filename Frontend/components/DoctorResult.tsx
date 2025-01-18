'use client'

import { motion } from 'framer-motion'
import { MapPin, ExternalLink, Star, Phone } from 'lucide-react'

interface Doctor {
  title: string;
  link?: string;
  snippet?: string;
  position?: number;
  address?: string;
  rating?: number;
  ratingCount?: number;
  phone?: string;
}

interface DoctorResultsProps {
  doctors: Doctor[];
  isLoading: boolean;
}

export default function DoctorResults({ doctors, isLoading }: DoctorResultsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!doctors.length) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8"
    >
      <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-6">
        Healthcare Providers Found
      </h2>
      
      <div className="space-y-6">
        {doctors.map((doctor, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {doctor.title}
            </h3>
            
            {doctor.rating && (
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(doctor.rating!) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  {doctor.rating} ({doctor.ratingCount} reviews)
                </span>
              </div>
            )}
            
            {doctor.snippet && (
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {doctor.snippet}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              {doctor.address && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{doctor.address}</span>
                </div>
              )}
              
              {doctor.phone && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{doctor.phone}</span>
                </div>
              )}
              
              {doctor.link && (
                <a
                  href={doctor.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>Visit Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}