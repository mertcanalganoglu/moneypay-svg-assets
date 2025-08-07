'use client'

interface LoadingSpinnerProps {
  message?: string
  progress?: number
  steps?: string[]
  currentStep?: number
}

export default function LoadingSpinner({ 
  message = "Analyzing website...", 
  progress, 
  steps, 
  currentStep 
}: LoadingSpinnerProps) {
  return (
    <div className="card text-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Main Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          {progress !== undefined && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-medium text-primary-600">
                {Math.round(progress)}%
              </span>
            </div>
          )}
        </div>

        {/* Loading Message */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {message}
          </h3>
          <p className="text-gray-600">
            This may take a few moments...
          </p>
        </div>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="w-full max-w-md">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Steps */}
        {steps && (
          <div className="w-full max-w-md px-4 sm:px-0">
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                    currentStep !== undefined && index <= currentStep
                      ? 'bg-green-50 text-green-800'
                      : currentStep !== undefined && index === currentStep + 1
                      ? 'bg-blue-50 text-blue-800'
                      : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                    currentStep !== undefined && index < currentStep
                      ? 'bg-green-500 text-white'
                      : currentStep !== undefined && index === currentStep
                      ? 'bg-blue-500 text-white animate-pulse'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {currentStep !== undefined && index < currentStep ? '✓' : index + 1}
                  </div>
                  <span className="text-xs sm:text-sm font-medium truncate">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Animated dots */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  )
}