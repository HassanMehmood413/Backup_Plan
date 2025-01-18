'use client'

import { motion } from 'framer-motion'
import { Brain, Shield, Users } from 'lucide-react'

export default function About() {
  const features = [
    {
      icon: Brain,
      title: 'Advanced AI',
      description: 'Utilizes state-of-the-art machine learning models for accurate Alzheimer’s disease classification.',
    },
    {
      icon: Shield,
      title: 'Privacy Focused',
      description: 'Your data is processed securely and never stored, ensuring your privacy is protected.',
    },
    {
      icon: Users,
      title: 'User-Friendly',
      description: 'Designed with simplicity in mind, making it easy for anyone to use and understand results.',
    },
  ]

  return (
    <motion.div
      className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md dark:bg-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-6 text-center">About This Project</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        The Alzheimer's Disease Classifier is an advanced application that leverages cutting-edge machine learning technology
        to identify Alzheimer's disease based on uploaded MRI images.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
          >
            <feature.icon className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200 text-center">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}