# 🧼 Dead CSS & JS Detector

A powerful tool that analyzes public websites to detect and remove **unused CSS classes** and **unused JavaScript files**. Built for frontend developers, WordPress users, and performance geeks who want to **clean up bloated stylesheets and scripts**.

## 🎯 Features

- **🔍 CSS Analysis**: Detects unused CSS classes and generates optimized stylesheets
- **📦 JavaScript Analysis**: Identifies unused JS files and creates optimized bundles
- **🚀 WordPress Optimization**: Specialized analysis for WordPress themes and plugins
- **📊 Performance Metrics**: Shows bundle size reduction and load time improvements
- **💾 Download Results**: Export optimized CSS and JS files for immediate use
- **🎨 Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 + React 18 + TypeScript |
| Styling | Tailwind CSS + Custom Components |
| Backend | Node.js API Routes |
| Browser Automation | Puppeteer Core |
| CSS Analysis | PurgeCSS |
| JavaScript Analysis | Esprima + Custom Parser |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/deadcss-js-detector.git
cd deadcss-js-detector

# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter a website URL (e.g., `https://example.com`)
3. Click "Analyze Website"
4. View the results and download optimized files

## 📊 Example Output

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
    }
  },
  "performance": {
    "estimatedLoadTime": "1.2s → 0.6s",
    "coreWebVitals": "Improved LCP, CLS, FID"
  }
}
```

## 💡 WordPress Use Cases

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

## 🏗 Project Structure

```
deadcss-js/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── AnalyzerForm.tsx   # URL input form
│   ├── Header.tsx         # Navigation header
│   └── ResultsDisplay.tsx # Results visualization
├── lib/                   # Core analysis logic
│   ├── analyzer.ts        # Main analyzer
│   ├── css-analyzer.ts    # CSS analysis
│   └── js-analyzer.ts     # JavaScript analysis
├── scripts/               # Utility scripts
└── public/                # Static assets
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Analysis
npm run analyze      # Run analysis script
```

### Environment Variables

Create a `.env.local` file:

```env
# Optional: Chrome executable path for Puppeteer
CHROME_EXECUTABLE_PATH=/usr/bin/google-chrome

# Optional: API rate limiting
MAX_REQUESTS_PER_MINUTE=60
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [PurgeCSS](https://purgecss.com/) for CSS analysis inspiration
- [Puppeteer](https://pptr.dev/) for browser automation
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the beautiful styling

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/yourusername/deadcss-js-detector/issues) page
2. Create a new issue with detailed information
3. Join our [Discord](https://discord.gg/your-server) community

---

**Made with ❤️ for the WordPress community** 