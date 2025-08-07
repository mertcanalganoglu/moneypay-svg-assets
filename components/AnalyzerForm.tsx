'use client'

import { useState } from 'react'

interface AnalyzerFormProps {
  onAnalyze: (url: string) => void
  isAnalyzing: boolean
}

export default function AnalyzerForm({ onAnalyze, isAnalyzing }: AnalyzerFormProps) {
  const [url, setUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onAnalyze(url.trim())
    }
  }

  return (
    <div className="card mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Analyze Your Website
        </h2>
        <p className="text-gray-600">
          Enter your website URL to detect unused CSS and JavaScript files
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Website URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://wordpress.org"
            className="input-field"
            required
            disabled={isAnalyzing}
          />
        </div>

        <button
          type="submit"
          disabled={isAnalyzing || !url.trim()}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Analyzing...</span>
            </div>
          ) : (
            'Analyze Website'
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">💡 Pro Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Works best with WordPress sites</li>
          <li>• Analyzes all CSS and JavaScript files</li>
          <li>• Provides optimized output files</li>
          <li>• Shows performance improvements</li>
        </ul>
      </div>
    </div>
  )
} 