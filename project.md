# 🧼 Dead CSS & JS Detector

A tool that analyzes public websites to detect and remove **unused CSS classes** and **unused JavaScript files**. Built for frontend developers, WordPress users, and performance geeks who want to **clean up bloated stylesheets and scripts**.

---

## 🎯 What It Does

- Crawls a given public URL (like `https://example.com`)
- Parses all HTML class names and script tags on the page
- Downloads linked CSS and JavaScript files
- Extracts class selectors from stylesheets
- Analyzes JavaScript usage and dependencies
- Compares both → finds unused CSS selectors and JS files
- Generates **optimized CSS and JS outputs**
- Gives a visual report: total CSS/JS vs used vs unused
- Exports `purged.css` and `optimized.js` that you can drop-in

---

## 💡 WordPress Use Case

Many WordPress themes and plugins load massive stylesheets and JavaScript files — but only 10–20% of those classes and scripts are actually used on the frontend.

**Dead CSS & JS Detector can:**
- Analyze your live WP site without plugin installation
- Show you which CSS classes and JS files aren't used
- Offer cleaned `.css` and `.js` files you can manually replace
- Help improve Core Web Vitals (LCP, CLS, FID)
- Reduce bundle size and improve loading speed

---

## 🧱 Tech Stack

| Layer     | Stack                          |
|-----------|-------------------------------|
| Frontend  | Next.js + Tailwind CSS         |
| Backend   | Node.js (Vercel API routes)    |
| Headless  | `puppeteer-core` + `chrome-aws-lambda` |
| CSS Purge | `@fullhuman/postcss-purgecss`  |
| JS Analysis | `webpack-bundle-analyzer` + `esprima` |

---

## ✨ Features

- 🔍 Visual diff between total/used/unused CSS classes and JS files
- 📉 Performance report (optional KB saving for both CSS and JS)
- 🧬 Automatic optimized CSS and JS generation
- 💾 Copy/paste or download purged CSS and optimized JS
- 📊 Bundle size analysis and dependency mapping
- 🚀 WordPress-specific optimizations (jQuery, wp-* scripts)
- 📤 Planned: zip export, sitemap crawling, login protected page analysis

---

## 🛠 Example Output

```json
{
  "css": {
    "totalCSS": 354,
    "used": 74,
    "unused": ["btn-secondary", "sidebar-ads", "carousel-control"],
    "optimizedCSS": "body{margin:0}.btn{color:white;background:red}"
  },
  "javascript": {
    "totalFiles": 12,
    "usedFiles": 8,
    "unusedFiles": ["jquery-ui.min.js", "bootstrap.bundle.js", "old-plugin.js"],
    "bundleSize": {
      "original": "2.4MB",
      "optimized": "1.1MB",
      "savings": "54%"
    },
    "optimizedJS": "// Optimized JavaScript bundle..."
  },
  "performance": {
    "estimatedLoadTime": "1.2s → 0.6s",
    "coreWebVitals": "Improved LCP, CLS, FID"
  }
}
```

---

## 🚀 WordPress JavaScript Optimization

### Common Issues Detected:
- **jQuery dependencies** that aren't actually used
- **Plugin scripts** loaded on every page but only needed on specific ones
- **Theme JavaScript** that's never called
- **External libraries** (Bootstrap, FontAwesome) with unused components
- **WordPress core scripts** that could be conditionally loaded

### Optimization Strategies:
- **Conditional loading** based on page type
- **Script deferring** for non-critical JavaScript
- **Bundle splitting** for different page templates
- **CDN optimization** for external libraries
- **Minification** and compression recommendations