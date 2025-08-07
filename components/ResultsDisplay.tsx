'use client'

import { useState } from 'react'

interface ResultsDisplayProps {
  results: any
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'css' | 'javascript' | 'wordpress'>('overview')

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Summary</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
              {results.performance?.estimatedLoadTime?.split('→')[1]?.trim() || '0.6s'}
            </div>
            <div className="text-xs sm:text-sm text-green-700">Optimized Load Time</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
              {results.javascript?.bundleSize?.savings || '54%'}
            </div>
            <div className="text-xs sm:text-sm text-blue-700">Bundle Size Reduction</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg sm:col-span-2 lg:col-span-1">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">
              {((results.css?.unused?.length || 0) + (results.javascript?.unusedFiles?.length || 0))}
            </div>
            <div className="text-xs sm:text-sm text-purple-700">Unused Files Detected</div>
          </div>
        </div>
      </div>

              {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex flex-wrap gap-x-4 sm:gap-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'css', label: 'CSS Analysis' },
              { id: 'javascript', label: 'JavaScript Analysis' },
              ...(results.wordpress ? [{ id: 'wordpress', label: 'WordPress Analysis' }] : [])
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">CSS Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{results.css?.totalCSS || 0}</div>
                    <div className="text-sm text-gray-600">Total CSS Classes</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{results.css?.used || 0}</div>
                    <div className="text-sm text-gray-600">Used Classes</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">JavaScript Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{results.javascript?.totalFiles || 0}</div>
                    <div className="text-sm text-gray-600">Total JS Files</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{results.javascript?.usedFiles || 0}</div>
                    <div className="text-sm text-gray-600">Used Files</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'css' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Unused CSS Classes</h3>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-red-800">
                    {results.css?.unused?.length || 0} unused classes detected
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {results.css?.unused?.slice(0, 10).map((cls: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                        {cls}
                      </span>
                    ))}
                    {results.css?.unused?.length > 10 && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                        +{results.css.unused.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimized CSS</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm text-gray-800 overflow-x-auto">
                    {results.css?.optimizedCSS || '/* Optimized CSS will appear here */'}
                  </pre>
                </div>
                <button
                  onClick={() => downloadFile(results.css?.optimizedCSS || '', 'purged.css')}
                  className="btn-primary mt-4"
                >
                  Download Optimized CSS
                </button>
              </div>
            </div>
          )}

          {activeTab === 'javascript' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Unused JavaScript Files</h3>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-red-800">
                    {results.javascript?.unusedFiles?.length || 0} unused files detected
                  </div>
                  <div className="mt-2 space-y-1">
                    {results.javascript?.unusedFiles?.map((file: string, index: number) => (
                      <div key={index} className="text-sm text-red-800">
                        • {file}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bundle Size Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {results.javascript?.bundleSize?.original || '2.4MB'}
                    </div>
                    <div className="text-sm text-blue-700">Original Size</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-green-600">
                      {results.javascript?.bundleSize?.optimized || '1.1MB'}
                    </div>
                    <div className="text-sm text-green-700">Optimized Size</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {results.javascript?.bundleSize?.savings || '54%'}
                    </div>
                    <div className="text-sm text-purple-700">Size Reduction</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimized JavaScript</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm text-gray-800 overflow-x-auto">
                    {results.javascript?.optimizedJS || '// Optimized JavaScript will appear here'}
                  </pre>
                </div>
                <button
                  onClick={() => downloadFile(results.javascript?.optimizedJS || '', 'optimized.js')}
                  className="btn-primary mt-4"
                >
                  Download Optimized JS
                </button>
              </div>
            </div>
          )}

          {activeTab === 'wordpress' && results.wordpress && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">WordPress Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-700 mb-1">WordPress Version</div>
                    <div className="text-lg font-bold text-blue-900">
                      {results.wordpress.version || 'Unknown'}
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-700 mb-1">Active Theme</div>
                    <div className="text-lg font-bold text-green-900">
                      {results.wordpress.theme?.name || 'Unknown'}
                    </div>
                    {results.wordpress.theme?.version && (
                      <div className="text-sm text-green-700">
                        Version: {results.wordpress.theme.version}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Plugins ({results.wordpress.plugins.length})</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {results.wordpress.plugins.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {results.wordpress.plugins.map((plugin: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                          <span className="font-medium">{plugin.name}</span>
                          {plugin.version && (
                            <span className="text-sm text-gray-500">v{plugin.version}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500">No plugins detected</div>
                  )}
                </div>
              </div>

              {results.wordpress.issues.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Issues</h3>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {results.wordpress.issues.map((issue: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-red-500 mt-1">⚠️</span>
                          <span className="text-red-800">{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {results.wordpress.recommendations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Recommendations</h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {results.wordpress.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">✅</span>
                          <span className="text-green-800">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">WordPress Core Files</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">
                    {results.wordpress.coreFiles.length} core files detected
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {results.wordpress.coreFiles.slice(0, 10).map((file: string, index: number) => (
                      <div key={index} className="text-xs text-gray-700 truncate">
                        {file}
                      </div>
                    ))}
                    {results.wordpress.coreFiles.length > 10 && (
                      <div className="text-xs text-gray-500 mt-2">
                        ... and {results.wordpress.coreFiles.length - 10} more files
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 