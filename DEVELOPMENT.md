# Development Guide

## Repository Setup - Single Repository Workflow

This repository uses a streamlined **single-repository approach** with automated deployment:

### Branch Structure
- **`dev` branch** 👨‍💻 - Development work happens here
  - Contains all Angular source code
  - Includes build configurations, Docker files, and GitHub Actions workflows
  - All development work and commits go here

- **`main` branch** 🚀 - Automated deployment target  
  - Contains only built/compiled website files
  - Updated automatically by GitHub Actions when you push to `dev`
  - Serves the live website via GitHub Pages

### Development Workflow

1. **Clone and Setup**
```bash
git clone https://github.com/mateuszczerniakowski/webiste.git
cd webiste
git checkout dev  # Always work on dev branch
npm install
```

2. **Local Development**
```bash
npm start                # Start development server
npm run build:prod      # Build for production testing
npm run test            # Run tests
npm run lint           # Check code quality
```

3. **Deploy Changes**
```bash
git add .
git commit -m "Your changes"
git push origin dev    # This triggers automated deployment!
```

### Automated Pipeline

When you push to `dev` branch, GitHub Actions automatically:

✅ **CI/CD Pipeline Triggers**
- Runs tests and code quality checks
- Builds Angular app with production optimizations
- Optimizes bundle size (currently ~86KB gzipped)
- Creates Docker images and pushes to GitHub Container Registry
- Deploys built files to `main` branch
- Updates live website at https://mateuszczerniakowski.github.io/webiste/

### Key Benefits

🎯 **Single Source of Truth**: All development in one repository
⚡ **Zero-Config Deployment**: Push to dev → automatically deployed
🔄 **Continuous Integration**: Automated testing and quality checks  
📦 **Docker Ready**: Container images built automatically
🌐 **Live Updates**: Changes appear on live site within minutes

### Live Website

🌐 **Production Site**: https://mateuszczerniakowski.github.io/webiste/
📊 **GitHub Actions**: https://github.com/mateuszczerniakowski/webiste/actions
🐳 **Docker Images**: https://github.com/users/mateuszczerniakowski/packages/container/package/eliza-fruit-website

### Local Commands

```bash
# Development
npm start                 # Start dev server (localhost:4200)
npm run build            # Development build
npm run build:prod      # Production build (optimized)

# Testing & Quality
npm test                # Run tests in watch mode
npm run test:ci        # Run tests once (CI mode)
npm run lint          # Check code style

# Docker (optional)
npm run docker:build    # Build Docker image locally
npm run docker:run     # Run Docker container locally
docker-compose up       # Run with docker-compose

# Deployment
git push origin dev     # Triggers automated deployment
```

### Bundle Optimization

The production build is highly optimized:
- **Tree shaking**: Removes unused code
- **Minification**: Reduces file sizes
- **Lazy loading**: Components loaded on demand
- **Video optimization**: Multiple formats and sizes
- **Result**: ~86KB gzipped (down from 366KB - 76% reduction!)

### Project Structure

```
webiste/
├── src/                   # Angular source code
│   ├── app/
│   │   ├── features/     # Page components (home, about, etc.)
│   │   ├── shared/       # Reusable components
│   │   └── services/     # Business logic
│   └── assets/           # Images, videos, translations
├── .github/workflows/    # Automated CI/CD pipelines
├── docker/              # Docker configurations  
└── dist/               # Built files (auto-generated)
```

### Troubleshooting

**GitHub Actions not running?**
- Check you pushed to `dev` branch (not `main`)
- Verify workflows are enabled in repository settings

**Build fails?**
- Run `npm ci` to clean install dependencies
- Check for TypeScript errors: `npm run build:prod`
- Review GitHub Actions logs for specific errors

**Local development issues?**
- Clear cache: `rm -rf node_modules && npm install`
- Check Node.js version (requires v18+)
- Verify Angular CLI: `npm install -g @angular/cli`