'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { UploadIcon, X } from 'lucide-react'

interface UploadProps {
  onUpload: (file: File) => Promise<void>;
  selectedLanguage: string;
  setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>;
}

export default function Upload({ onUpload, selectedLanguage, setSelectedLanguage }: UploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  })

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile)
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Upload MRI Image</h2>
      <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-4 ${isDragActive ? 'border-blue-500' : 'border-gray-300'}`}>
        <input {...getInputProps()} />
        <p className="text-center text-gray-600 dark:text-gray-300">
          {isDragActive ? 'Drop the files here ...' : 'Drag & drop your MRI image here, or click to select'}
        </p>
      </div>
      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="mt-4 relative"
          >
            <img src={previewUrl} alt="Preview" className="mx-auto max-w-full h-auto rounded-lg shadow-md" />
            <motion.button
              onClick={handleClear}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={20} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      {selectedFile && (
        <motion.button
          onClick={handleUpload}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
        >
          Upload and Classify
        </motion.button>
      )}
    </div>
  )
}