import { Page } from 'puppeteer'

export interface WordPressInfo {
  isWordPress: boolean
  version?: string
  theme?: {
    name: string
    version?: string
    path?: string
  }
  plugins: Array<{
    name: string
    version?: string
    path?: string
  }>
  coreFiles: string[]
}

export async function detectWordPress(page: Page): Promise<WordPressInfo> {
  try {
    // Check for WordPress indicators
    const wpInfo = await page.evaluate(() => {
      const indicators = {
        isWordPress: false,
        version: undefined as string | undefined,
        theme: undefined as { name: string; version?: string; path?: string } | undefined,
        plugins: [] as Array<{ name: string; version?: string; path?: string }>,
        coreFiles: [] as string[]
      }

      // Check for WordPress generator meta tag
      const generator = document.querySelector('meta[name="generator"]')
      if (generator) {
        const content = generator.getAttribute('content') || ''
        if (content.includes('WordPress')) {
          indicators.isWordPress = true
          const versionMatch = content.match(/WordPress\s+([\d.]+)/)
          if (versionMatch) {
            indicators.version = versionMatch[1]
          }
        }
      }

      // Check for wp-content in URLs
      const links = document.querySelectorAll('link[href*="wp-content"], script[src*="wp-content"]')
      if (links.length > 0) {
        indicators.isWordPress = true
      }

      // Check for WordPress core files
      const scripts = document.querySelectorAll('script[src]')
      const styleSheets = document.querySelectorAll('link[rel="stylesheet"]')
      
      const allResources = [
        ...Array.from(scripts).map(s => s.getAttribute('src')),
        ...Array.from(styleSheets).map(l => l.getAttribute('href'))
      ].filter(Boolean) as string[]

      for (const resource of allResources) {
        // WordPress core files
        if (resource.includes('wp-includes') || 
            resource.includes('wp-admin') || 
            resource.includes('wp-content')) {
          indicators.isWordPress = true
          indicators.coreFiles.push(resource)
        }

        // Theme detection
        const themeMatch = resource.match(/wp-content\/themes\/([^\/]+)/)
        if (themeMatch && !indicators.theme) {
          indicators.theme = {
            name: themeMatch[1],
            path: resource
          }
        }

        // Plugin detection
        const pluginMatch = resource.match(/wp-content\/plugins\/([^\/]+)/)
        if (pluginMatch) {
          const pluginName = pluginMatch[1]
          if (!indicators.plugins.find(p => p.name === pluginName)) {
            indicators.plugins.push({
              name: pluginName,
              path: resource
            })
          }
        }
      }

      // Check for WordPress-specific JavaScript variables
      if (typeof (window as any).wp !== 'undefined') {
        indicators.isWordPress = true
      }

      // Check for WordPress REST API
      const restApiLink = document.querySelector('link[rel="https://api.w.org/"]')
      if (restApiLink) {
        indicators.isWordPress = true
      }

      // Check for WordPress body classes
      const bodyClasses = document.body.className
      if (bodyClasses.includes('wp-') || bodyClasses.includes('wordpress')) {
        indicators.isWordPress = true
      }

      return indicators
    })

    // Additional checks using page navigation
    if (wpInfo.isWordPress) {
      // Try to get more theme information
      await enhanceThemeInfo(page, wpInfo)
      
      // Try to get plugin versions
      await enhancePluginInfo(page, wpInfo)
    }

    return wpInfo
  } catch (error) {
    console.error('WordPress detection error:', error)
    return {
      isWordPress: false,
      plugins: [],
      coreFiles: []
    }
  }
}

async function enhanceThemeInfo(page: Page, wpInfo: WordPressInfo) {
  try {
    if (!wpInfo.theme) return

    // Try to get theme version from style.css
    const themeStyleUrl = `${page.url().split('/').slice(0, 3).join('/')}/wp-content/themes/${wpInfo.theme.name}/style.css`
    
    try {
      const response = await page.goto(themeStyleUrl, { waitUntil: 'networkidle0', timeout: 5000 })
      if (response && response.ok()) {
        const cssContent = await response.text()
        
        // Parse theme header
        const versionMatch = cssContent.match(/Version:\s*([\d.]+)/)
        if (versionMatch) {
          wpInfo.theme.version = versionMatch[1]
        }
        
        // Get theme name from header if available
        const nameMatch = cssContent.match(/Theme Name:\s*(.+)/)
        if (nameMatch) {
          wpInfo.theme.name = nameMatch[1].trim()
        }
      }
    } catch (error) {
      console.log('Could not fetch theme info:', error)
    }
  } catch (error) {
    console.error('Error enhancing theme info:', error)
  }
}

async function enhancePluginInfo(page: Page, wpInfo: WordPressInfo) {
  try {
    // Try to get plugin versions from main plugin files
    for (const plugin of wpInfo.plugins) {
      try {
        const pluginMainFile = `${page.url().split('/').slice(0, 3).join('/')}/wp-content/plugins/${plugin.name}/${plugin.name}.php`
        
        const response = await page.goto(pluginMainFile, { waitUntil: 'networkidle0', timeout: 3000 })
        if (response && response.ok()) {
          const phpContent = await response.text()
          
          // Parse plugin header
          const versionMatch = phpContent.match(/Version:\s*([\d.]+)/)
          if (versionMatch) {
            plugin.version = versionMatch[1]
          }
        }
      } catch (error) {
        // Ignore individual plugin errors
        console.log(`Could not fetch info for plugin ${plugin.name}:`, error)
      }
    }
  } catch (error) {
    console.error('Error enhancing plugin info:', error)
  }
}

export function analyzeWordPressPerformance(wpInfo: WordPressInfo) {
  const recommendations: string[] = []
  const issues: string[] = []

  if (!wpInfo.isWordPress) {
    return { recommendations, issues }
  }

  // Check for common performance issues
  if (wpInfo.plugins.length > 10) {
    issues.push(`Too many plugins (${wpInfo.plugins.length}). Consider reducing the number of active plugins.`)
    recommendations.push('Audit plugins and remove unnecessary ones')
  }

  // Check for known problematic plugins
  const problematicPlugins = wpInfo.plugins.filter(plugin => 
    plugin.name.includes('page-builder') ||
    plugin.name.includes('slider') ||
    plugin.name.includes('social') ||
    plugin.name.includes('backup')
  )

  if (problematicPlugins.length > 0) {
    issues.push(`Potentially heavy plugins detected: ${problematicPlugins.map(p => p.name).join(', ')}`)
    recommendations.push('Consider lightweight alternatives for heavy plugins')
  }

  // Check for jQuery usage
  const jqueryFiles = wpInfo.coreFiles.filter(file => file.includes('jquery'))
  if (jqueryFiles.length > 0) {
    recommendations.push('Consider removing jQuery if not needed for modern themes')
  }

  // Check for old WordPress version
  if (wpInfo.version) {
    const version = parseFloat(wpInfo.version)
    if (version < 6.0) {
      issues.push(`WordPress version ${wpInfo.version} is outdated`)
      recommendations.push('Update WordPress to the latest version')
    }
  }

  return { recommendations, issues }
}