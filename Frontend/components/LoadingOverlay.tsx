'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface LoadingOverlayProps {
  isLoading: boolean
}

export default function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <div className="loader mb-4"></div>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Processing your image...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}