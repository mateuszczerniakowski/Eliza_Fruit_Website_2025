# Eliza Fruit Website - Deployment Guide

## 🌐 Live Website
**https://mateuszczerniakowski.github.io/webiste/**

## 🚀 Quick Deployment

Deploy your changes with one command:
```bash
npm run deploy:webiste
```

## 📁 Repository Setup

### Main Development: 
- **Repository**: `Eliza_Fruit_Website_2025` (current)
- **Branch**: `day1`
- **Contains**: Source code, Angular project

### Production Deployment:
- **Repository**: `webiste`  
- **Branch**: `main`
- **Contains**: Built files only (optimized)

## ⚙️ GitHub Pages Configuration

1. Go to: https://github.com/mateuszczerniakowski/webiste
2. Settings → Pages
3. Source: "Deploy from a branch"
4. Branch: "main" / Folder: "/ (root)"
5. Save

## 🎯 Performance Stats
- **Bundle Size**: 85.88 kB (gzipped)
- **Raw Size**: 366.44 kB
- **Compression**: 76% reduction
- **Lazy Loading**: ✅ Enabled
- **Video Optimization**: ✅ Enabled

## 🔄 Development Workflow

1. Make changes in this repository (`Eliza_Fruit_Website_2025`)
2. Test locally: `npm start`
3. Deploy: `npm run deploy:webiste`
4. Visit: https://mateuszczerniakowski.github.io/webiste/

## 📝 Available Scripts

- `npm start` - Development server
- `npm run build` - Build for production
- `npm run deploy:webiste` - Build & deploy to webiste repo
- `npm run docker:build` - Build Docker image
- `npm run build:analyze` - Analyze bundle size