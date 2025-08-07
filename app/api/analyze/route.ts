import { NextRequest, NextResponse } from 'next/server'
import { analyzeWebsite } from '../../../lib/analyzer'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required. Please enter a website URL.' },
        { status: 400 }
      )
    }

    // Validate URL format
    let validatedUrl: URL
    try {
      validatedUrl = new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format. Please enter a valid website URL (e.g., https://example.com)' },
        { status: 400 }
      )
    }

    // Check if URL uses HTTP or HTTPS
    if (!['http:', 'https:'].includes(validatedUrl.protocol)) {
      return NextResponse.json(
        { error: 'Only HTTP and HTTPS URLs are supported.' },
        { status: 400 }
      )
    }

    // Block localhost and private IPs for security
    const hostname = validatedUrl.hostname
    if (hostname === 'localhost' || 
        hostname.startsWith('127.') || 
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.includes('local')) {
      return NextResponse.json(
        { error: 'Local and private URLs are not allowed for security reasons.' },
        { status: 400 }
      )
    }

    console.log(`Starting analysis for: ${url}`)

    // Analyze the website with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Analysis timeout')), 60000) // 60 second timeout
    })

    const analysisPromise = analyzeWebsite(url)
    
    const results = await Promise.race([analysisPromise, timeoutPromise])

    console.log(`Analysis completed for: ${url}`)
    return NextResponse.json(results)

  } catch (error: any) {
    console.error('Analysis error:', error)
    
    let errorMessage = 'Analysis failed. Please try again.'
    let statusCode = 500

    if (error.message?.includes('timeout')) {
      errorMessage = 'The analysis is taking too long. The website might be slow or unreachable.'
      statusCode = 408
    } else if (error.message?.includes('net::ERR_NAME_NOT_RESOLVED')) {
      errorMessage = 'Website not found. Please check the URL and try again.'
      statusCode = 404
    } else if (error.message?.includes('net::ERR_CONNECTION_REFUSED')) {
      errorMessage = 'Connection refused. The website might be down or blocking requests.'
      statusCode = 503
    } else if (error.message?.includes('net::ERR_SSL_PROTOCOL_ERROR')) {
      errorMessage = 'SSL/HTTPS error. The website might have certificate issues.'
      statusCode = 502
    } else if (error.message?.includes('Navigation timeout')) {
      errorMessage = 'The website is taking too long to load. Please try again.'
      statusCode = 408
    } else if (error.message?.includes('Protocol error')) {
      errorMessage = 'Unable to connect to the website. It might be blocking automated requests.'
      statusCode = 403
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
} 