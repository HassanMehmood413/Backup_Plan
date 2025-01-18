'use client'

import { motion } from 'framer-motion'
import { Upload, Search, Shield, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import three from '../svgs/three.svg' // Ensure this path is correct
import doctor from '../svgs/three.jpg' // Import your doctor image
import backgroundImage from '../svgs/three.jpg' // Import your background image

interface HomeProps {
  setActiveSection: (section: string) => void
  theme: 'light' | 'dark' // Accept theme as a prop
}

export default function Home({ setActiveSection, theme }: HomeProps) {
  const stats = [
    { number: '99%', label: 'Accuracy Rate' },
    { number: '1M+', label: 'Users Worldwide' },
    { number: '24/7', label: 'Support Available' },
    { number: '50+', label: 'Disease Types' }
  ]

  const benefits = [
    { title: 'Advanced AI Technology', description: 'Utilizes cutting-edge algorithms for accurate MRI analysis.' },
    { title: 'Early Detection', description: 'Identifies potential Alzheimer’s signs for timely intervention.' },
    { title: 'User-Friendly Interface', description: 'Simple upload process with no technical expertise required.' },
    { title: 'Privacy and Security', description: 'Your data is processed securely and not stored.' },
    { title: 'Expert Insights', description: 'Provides detailed recommendations based on analysis.' },
    { title: '24/7 Support', description: 'Dedicated team available to assist you anytime.' },
  ]

  return (
    <motion.div
      className={`p-10 rounded-lg shadow-lg text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} relative`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundImage: `url(${backgroundImage})`, // Use the imported background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h1 className="text-5xl font-bold text-blue-700 dark:text-blue-300 mb-4">
        Welcome to Cognify
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Upload an MRI scan image, and our AI will help identify the severity of Alzheimer's disease.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 flex flex-col items-center"
          >
            <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stat.number}</h3>
            <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Why Choose Cognify Section */}
      <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg shadow-md mb-10">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Why Choose Cognify?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((item, index) => (
            <div key={index} className="flex items-start space-x-2">
              <ArrowRight className="w-6 h-6 text-green-500" />
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">{item.title}</h4>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link href="#upload" passHref>
        <motion.button
          onClick={() => setActiveSection('upload')}
          className="bg-blue-600 text-white py-3 px-6 rounded-full font-semibold text-lg hover:bg-blue-700 transition duration-200"
        >
          Get Started Now <ArrowRight className="inline-block" />
        </motion.button>
      </Link>

      {/* Image Section at the Bottom */}
      <div className="flex justify-center mt-12">
        <div className="relative w-full max-w-3xl bg-gray-200 dark:bg-gray-600 p-4 rounded-lg shadow-lg"> {/* Background color added here */}
          <Image 
            src={doctor} // Ensure this path is correct
            alt="Doctor's Assistance"
            className="max-w-full h-auto rounded-lg"
            width={800} // Set a larger width for the image
            height={500} // Set a larger height for the image
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {[
          { icon: Upload, title: 'Easy Upload', description: 'Simply drag and drop or select your MRI image' },
          { icon: Search, title: 'AI-Powered Analysis', description: 'Advanced machine learning model for accurate classification' },
          { icon: Shield, title: 'Privacy First', description: 'Your data is securely processed and never stored' },
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 flex flex-col items-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
          >
            <feature.icon className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}