'use client'

import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Home from '../components/Home'
import Upload from '../components/Upload'
import Results from '../components/Results'
import About from '../components/About'
import Contact from '../components/Contact'
import LoadingOverlay from '../components/LoadingOverlay'
import LLMResponseDisplay from '../components/LLMResponseDisplay'
import { motion, AnimatePresence } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

interface ChatResponse {
    response: string;
}

interface PredictionResponse {
    predicted_class: string;
}

export default function Page() {
    const [activeSection, setActiveSection] = useState('home')
    const [result, setResult] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [theme, setTheme] = useState<'light' | 'dark'>('light')
    const [llmResponse, setLlmResponse] = useState('')
    const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([])
    const [selectedLanguage, setSelectedLanguage] = useState('en')

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
        if (savedTheme) {
            setTheme(savedTheme)
        }
    }, [])

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
    }

    const handleUpload = async (file: File) => {
        setIsLoading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await axios.post<PredictionResponse>(
                'http://localhost:5000/image', 
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            
            const predictedDisease = response.data.predicted_class
            setResult(predictedDisease)
            toast.success('Image successfully classified!')

            // Get LLM response
            const llmResponse = await axios.post<ChatResponse>(
                'http://localhost:5000/chat',
                {
                    message: `I have the following disease: ${predictedDisease}. What can you tell me about this?`,
                    language: selectedLanguage
                }
            )

            setLlmResponse(llmResponse.data.response)
            setChatHistory([
                { role: 'user', content: predictedDisease },
                { role: 'assistant', content: llmResponse.data.response }
            ])
            
            // Automatically switch to results section
            setActiveSection('results')
        } catch (error) {
            console.error('Error:', error)
            setResult('Error occurred during prediction')
            toast.error('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
            <Header 
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
                theme={theme} 
                toggleTheme={toggleTheme} 
            />
            <main className="flex-grow container mx-auto px-4 py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeSection === 'home' && (
                            <Home setActiveSection={setActiveSection} theme={theme} />
                        )}
                        {activeSection === 'upload' && (
                            <Upload 
                                onUpload={handleUpload} 
                                selectedLanguage={selectedLanguage}
                                setSelectedLanguage={setSelectedLanguage}
                            />
                        )}
                        {activeSection === 'results' && (
                            <>
                                <Results result={result} />
                                {llmResponse && (
                                    <LLMResponseDisplay 
                                        response={llmResponse} 
                                        chatHistory={chatHistory}
                                        result={result}
                                    />
                                )}
                            </>
                        )}
                        {activeSection === 'about' && <About />}
                        {activeSection === 'contact' && <Contact />}
                    </motion.div>
                </AnimatePresence>
            </main>
            <Footer />
            <LoadingOverlay isLoading={isLoading} />
            <ToastContainer position="bottom-right" autoClose={5000} />
        </div>
    )
}