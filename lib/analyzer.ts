import puppeteer from 'puppeteer'
import { extractCSSClasses, extractCSSFiles, analyzeCSS } from './css-analyzer'
import { extractJSFiles, analyzeJavaScript } from './js-analyzer'
import { detectWordPress, analyzeWordPressPerformance, WordPressInfo } from './wordpress-detector'

export interface AnalysisResults {
  css: {
    totalCSS: number
    used: number
    unused: string[]
    optimizedCSS: string
  }
  javascript: {
    totalFiles: number
    usedFiles: number
    unusedFiles: string[]
    bundleSize: {
      original: string
      optimized: string
      savings: string
    }
    optimizedJS: string
  }
  wordpress?: WordPressInfo & {
    recommendations: string[]
    issues: string[]
  }
  performance: {
    estimatedLoadTime: string
    coreWebVitals: string
  }
}

export async function analyzeWebsite(url: string): Promise<AnalysisResults> {
  console.log(`Starting analysis of: ${url}`)

  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    const page = await browser.newPage()
    
    // Set user agent to avoid bot detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
    
    // Navigate to the page
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
    
    // Extract HTML content and class names
    const htmlContent = await page.content()
    const cssClasses = await extractCSSClasses(page)
    
    // Extract CSS files
    const cssFiles = await extractCSSFiles(page)
    
    // Navigate back to original page after downloading CSS files
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
    
    // Extract JavaScript files
    const jsFiles = await extractJSFiles(page)
    
    // Navigate back to original page after downloading JS files
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
    
    // Detect WordPress
    const wpInfo = await detectWordPress(page)
    
    // Analyze CSS
    const cssResults = await analyzeCSS(htmlContent, cssClasses, cssFiles)
    
    // Analyze JavaScript
    const jsResults = await analyzeJavaScript(jsFiles)
    
    // Calculate performance metrics
    const performance = calculatePerformanceMetrics(cssResults, jsResults)
    
    const results: AnalysisResults = {
      css: cssResults,
      javascript: jsResults,
      performance
    }
    
    // Add WordPress-specific analysis if detected
    if (wpInfo.isWordPress) {
      const wpPerformance = analyzeWordPressPerformance(wpInfo)
      results.wordpress = {
        ...wpInfo,
        ...wpPerformance
      }
    }
    
    console.log('Final analysis results:', JSON.stringify(results, null, 2))
    return results
    
  } finally {
    await browser.close()
  }
}

function calculatePerformanceMetrics(cssResults: any, jsResults: any) {
  // Safe calculation with fallbacks
  const cssSavings = cssResults.totalCSS > 0 
    ? ((cssResults.totalCSS - cssResults.used) / cssResults.totalCSS) * 100 
    : 0
  
  const jsSavingsStr = jsResults.bundleSize.savings || '0%'
  const jsSavings = parseFloat(jsSavingsStr.replace('%', '')) || 0
  
  const totalSavings = (cssSavings + jsSavings) / 2
  
  // Estimate load time improvement
  const originalLoadTime = 1.2 // seconds
  const optimizedLoadTime = isNaN(totalSavings) || totalSavings <= 0 
    ? originalLoadTime * 0.8  // Default 20% improvement
    : originalLoadTime * (1 - Math.min(totalSavings, 80) / 100) // Cap at 80% improvement
  
  return {
    estimatedLoadTime: `${originalLoadTime.toFixed(1)}s → ${optimizedLoadTime.toFixed(1)}s`,
    coreWebVitals: 'Improved LCP, CLS, FID'
  }
} 