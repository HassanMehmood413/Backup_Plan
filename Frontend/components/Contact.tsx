'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formState)
    setFormState({ name: '', email: '', message: '' })
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-purple-700 dark:text-purple-400 mb-6 text-center">Contact Us</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.form
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formState.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              required
            ></textarea>
          </div>
          <motion.button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Send Message
          </motion.button>
        </motion.form>
        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-4">Get in Touch</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-2" />
              <p className="text-gray-700 dark:text-gray-300">info@skindiseaseclassifier.com</p>
            </div>
            <div className="flex items-center">
              <Phone className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-2" />
              <p className="text-gray-700 dark:text-gray-300">+1 (555) 123-4567</p>
            </div>
            <div className="flex items-center">
              <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-2" />
              <p className="text-gray-700 dark:text-gray-300">123 AI Street, Tech City, TC 12345</p>
            </div>
          </div>
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Office Hours</h4>
            <p className="text-gray-700 dark:text-gray-300">Monday - Friday: 9:00 AM - 5:00 PM</p>
            <p className="text-gray-700 dark:text-gray-300">Saturday - Sunday: Closed</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}