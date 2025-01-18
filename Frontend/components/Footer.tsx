'use client'

import { motion } from 'framer-motion'
import {
  Github, Twitter, Linkedin, Mail, Phone, MapPin, Heart,
  Instagram, Facebook, Youtube, Globe, Award, Users, Shield, Clock
} from 'lucide-react'

export default function Footer() {
  const features = [
    { icon: Shield, text: "HIPAA Compliant" },
    { icon: Clock, text: "24/7 Support" },
    { icon: Users, text: "1M+ Users" },
    { icon: Award, text: "99% Accuracy" }
  ]

  return (
    <footer className="bg-gradient-to-b from-gray-800 via-gray-900 to-black text-white">
      <div className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-purple-400 mb-2" />
                <span className="text-sm font-semibold">{feature.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-purple-400">About Malama AI</h3>
            <p className="text-gray-300 leading-relaxed">
              Pioneering AI-powered skin disease detection to revolutionize healthcare accessibility. Our advanced algorithms provide accurate, instant analysis for better health outcomes.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Globe className="w-4 h-4" />
              <span>Available Worldwide</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-xl font-bold mb-4 text-purple-400">Our Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors duration-200 flex items-center space-x-2">
                  <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                  <span>Skin Disease Detection</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors duration-200 flex items-center space-x-2">
                  <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                  <span>Health Monitoring</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors duration-200 flex items-center space-x-2">
                  <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                  <span>AI Consultation</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors duration-200 flex items-center space-x-2">
                  <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                  <span>Research & Development</span>
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-4 text-purple-400">Resources</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors duration-200 flex items-center space-x-2">
                  <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                  <span>Documentation</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors duration-200 flex items-center space-x-2">
                  <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                  <span>API Reference</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors duration-200 flex items-center space-x-2">
                  <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors duration-200 flex items-center space-x-2">
                  <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                  <span>Terms of Service</span>
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-4 text-purple-400">Get in Touch</h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center space-x-3 group">
                <Mail className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                <a href="mailto:contact@malamaai.com" className="hover:text-purple-400 transition-colors duration-200">
                  contact@malamaai.com
                </a>
              </div>
              <div className="flex items-center space-x-3 group">
                <Phone className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <MapPin className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-gray-400 flex items-center"
            >
              &copy; 2024 Malama AI. Made with <Heart className="w-4 h-4 mx-1 text-red-500 animate-pulse" /> in San Francisco
            </motion.p>
            <motion.div
              className="flex space-x-6 mt-4 md:mt-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {[Github, Twitter, Linkedin, Instagram, Facebook, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transform hover:scale-110 hover:-translate-y-1 transition-all duration-200"
                >
                  <Icon className="w-6 h-6 hover:text-purple-400 transition-colors duration-200" />
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}