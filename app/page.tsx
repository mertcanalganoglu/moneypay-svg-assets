'use client'

import { useState } from 'react'
import AnalyzerForm from '../components/AnalyzerForm'
import ResultsDisplay from '../components/ResultsDisplay'
import Header from '../components/Header'
import ErrorMessage from '../components/ErrorMessage'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Home() {
  const [results, setResults] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState<string>('')

  const handleAnalysis = async (url: string) => {
    setIsAnalyzing(true)
    setError(null)
    setResults(null)
    setAnalysisProgress(0)
    
    // Simulate progress steps
    const steps = [
      'Loading website...',
      'Extracting CSS files...',
      'Extracting JavaScript files...',
      'Detecting WordPress...',
      'Analyzing CSS usage...',
      'Analyzing JavaScript usage...',
      'Generating optimizations...'
    ]
    
    try {
      // Simulate progress
      let currentStepIndex = 0
      const progressInterval = setInterval(() => {
        if (currentStepIndex < steps.length) {
          setCurrentStep(steps[currentStepIndex])
          setAnalysisProgress((currentStepIndex + 1) / steps.length * 90) // Leave 10% for final processing
          currentStepIndex++
        }
      }, 1000)
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })
      
      clearInterval(progressInterval)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }
      
      setCurrentStep('Finalizing results...')
      setAnalysisProgress(100)
      
      const data = await response.json()
      
      // Small delay to show completion
      setTimeout(() => {
        setResults(data)
        setIsAnalyzing(false)
      }, 500)
      
    } catch (error: any) {
      console.error('Analysis error:', error)
      
      let errorMessage = 'An unexpected error occurred. Please try again.'
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.'
      } else if (error.message.includes('timeout')) {
        errorMessage = 'The analysis is taking too long. The website might be slow or unreachable.'
      } else if (error.message.includes('Invalid URL')) {
        errorMessage = 'Please enter a valid website URL (e.g., https://example.com)'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
      setIsAnalyzing(false)
      setAnalysisProgress(0)
      setCurrentStep('')
    }
  }

  const handleRetry = () => {
    if (results || error) {
      // Get the last analyzed URL from form or results
      const lastUrl = (document.querySelector('input[type="url"]') as HTMLInputElement)?.value
      if (lastUrl) {
        handleAnalysis(lastUrl)
      }
    }
  }

  const handleDismissError = () => {
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🧼 Dead CSS & JS Detector
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              Analyze your website to detect and remove unused CSS classes and JavaScript files. 
              Perfect for WordPress optimization and performance improvement.
            </p>
          </div>

          <AnalyzerForm onAnalyze={handleAnalysis} isAnalyzing={isAnalyzing} />
          
          {error && (
            <ErrorMessage 
              error={error} 
              onRetry={handleRetry}
              onDismiss={handleDismissError}
            />
          )}
          
          {isAnalyzing && (
            <LoadingSpinner 
              message={currentStep || "Analyzing website..."}
              progress={analysisProgress}
              steps={[
                'Loading website',
                'Extracting CSS files',
                'Extracting JavaScript files', 
                'Detecting WordPress',
                'Analyzing CSS usage',
                'Analyzing JavaScript usage',
                'Generating optimizations'
              ]}
              currentStep={Math.floor(analysisProgress / (100/7))}
            />
          )}
          
          {results && !isAnalyzing && <ResultsDisplay results={results} />}
        </div>
      </main>
    </div>
  )
} 