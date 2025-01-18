'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle } from 'lucide-react'

interface ResultsProps {
  result: string | null;
}

export default function Results({ result }: ResultsProps) {
  const isError = result?.toLowerCase().includes('error')

  return (
    <motion.div
      className="max-w-4xl mx-auto text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-purple-700 dark:text-purple-400 mb-6">Analysis Results</h2>
      {result ? (
        <motion.div
          className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md ${
            isError ? 'border-red-500' : 'border-green-500'
          } border-2 mb-8`}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {isError ? (
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          ) : (
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          )}
          <p className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            {isError ? 'Error Occurred' : 'Predicted Disease:'}
          </p>
          <p className={`text-2xl font-bold ${isError ? 'text-red-600' : 'text-purple-600 dark:text-purple-400'}`}>
            {result}
          </p>
        </motion.div>
      ) : (
        <p className="text-xl text-gray-600 dark:text-gray-400">No result available. Please upload an image first.</p>
      )}
    </motion.div>
  )
}