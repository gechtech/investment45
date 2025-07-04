# 🚀 EthioInvest Network - Netlify Deployment Guide

This guide will help you deploy the EthioInvest Network application to Netlify (frontend) and provide options for hosting the backend.

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Git](https://git-scm.com/)
- [Netlify Account](https://netlify.com/)
- Backend hosting service account (Railway, Render, Heroku, etc.)

## 🏗️ Architecture Overview

```
┌─────────────────┐    API Calls    ┌─────────────────┐
│   Netlify       │ ────────────── │   Backend       │
│   (Frontend)    │                 │   (Railway/     │
│   React + Vite  │                 │   Render/etc.)  │
└─────────────────┘                 └─────────────────┘
```

## 🎯 Part 1: Frontend Deployment to Netlify

### Step 1: Prepare Your Repository

1. **Ensure all files are committed:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Verify build works locally:**
   ```bash
   npm install
   npm run build
   ```

### Step 2: Update API Configuration

1. **Update the API base URL in your environment:**
   - Copy `.env.example` to `.env.local`
   - Set `VITE_API_BASE_URL` to your backend URL (we'll set this later)

2. **Update axios usage (Optional):**
   - Replace direct axios imports with the configured API client:
   ```typescript
   // Instead of: import axios from 'axios';
   import api from '../config/api';
   
   // Instead of: axios.get('/api/endpoint')
   api.get('/endpoint')
   ```

### Step 3: Deploy to Netlify

#### Option A: Git-based Deployment (Recommended)

1. **Connect to Netlify:**
   - Go to [Netlify](https://netlify.com/)
   - Click "New site from Git"
   - Connect your GitHub/GitLab/Bitbucket account
   - Select your repository

2. **Configure Build Settings:**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Set Environment Variables:**
   Go to Site settings → Environment variables and add:
   ```
   VITE_API_BASE_URL=https://your-backend-url.com/api
   VITE_APP_NAME=EthioInvest Network
   ```

#### Option B: Manual Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   ```

### Step 4: Configure Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Add your custom domain
3. Configure DNS settings with your domain provider

## 🖥️ Part 2: Backend Deployment Options

Since Netlify is primarily for static sites, you'll need to deploy your backend separately.

### Option A: Railway (Recommended)

Railway provides excellent Node.js hosting with built-in SQLite support.

1. **Sign up at [Railway](https://railway.app/)**

2. **Create a new project:**
   - Connect your GitHub repository
   - Select the repository

3. **Configure the service:**
   - Set root directory to `/` (if monorepo)
   - Build command: `cd server && npm install`
   - Start command: `cd server && node server.js`

4. **Set environment variables:**
   ```
   JWT_SECRET=your-super-secure-jwt-secret-here-minimum-32-characters
   ALLOWED_ORIGINS=https://your-netlify-app.netlify.app
   PORT=5000
   ```

5. **Deploy:**
   - Railway will automatically deploy from your Git repository
   - Get your backend URL (e.g., `https://your-app.railway.app`)

### Option B: Render

1. **Sign up at [Render](https://render.com/)**

2. **Create a new Web Service:**
   - Connect your repository
   - Build command: `cd server && npm install`
   - Start command: `cd server && node server.js`

3. **Configure environment variables:**
   ```
   JWT_SECRET=your-jwt-secret
   ALLOWED_ORIGINS=https://your-netlify-app.netlify.app
   ```

### Option C: Heroku

1. **Install Heroku CLI and login:**
   ```bash
   heroku login
   ```

2. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set ALLOWED_ORIGINS=https://your-netlify-app.netlify.app
   ```

4. **Deploy:**
   ```bash
   git subtree push --prefix server heroku main
   ```

### Option D: DigitalOcean App Platform

1. **Create account at [DigitalOcean](https://digitalocean.com/)**
2. **Create new App**
3. **Connect repository and configure:**
   - Source directory: `server`
   - Build command: `npm install`
   - Run command: `node server.js`

## 🔗 Part 3: Connect Frontend to Backend

After deploying both frontend and backend:

1. **Update Netlify environment variables:**
   ```
   VITE_API_BASE_URL=https://your-backend-url.com/api
   ```

2. **Update netlify.toml:**
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "https://your-backend-url.com/api/:splat"
     status = 200
     force = true
   ```

3. **Redeploy Netlify site:**
   - Trigger a new deployment from Netlify dashboard

## 🛠️ Environment Variables Checklist

### Frontend (Netlify)
- ✅ `VITE_API_BASE_URL`
- ✅ `VITE_APP_NAME`

### Backend (Railway/Render/etc.)
- ✅ `JWT_SECRET`
- ✅ `ALLOWED_ORIGINS`
- ✅ `PORT`
- ✅ `CLOUDINARY_CLOUD_NAME` (if using file uploads)
- ✅ `CLOUDINARY_API_KEY`
- ✅ `CLOUDINARY_API_SECRET`

## 🔍 Testing Your Deployment

1. **Frontend Tests:**
   ```bash
   # Test the build
   npm run build
   npm run preview
   ```

2. **Backend Tests:**
   ```bash
   # Test API endpoints
   curl https://your-backend-url.com/api/health
   ```

3. **Integration Test:**
   - Visit your Netlify URL
   - Try logging in
   - Check browser developer tools for any CORS or API errors

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Ensure `ALLOWED_ORIGINS` includes your Netlify URL
   - Check browser developer tools network tab

2. **API Not Found (404):**
   - Verify `VITE_API_BASE_URL` is set correctly
   - Check netlify.toml redirects

3. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json

4. **Database Issues:**
   - SQLite files are not persistent on some platforms
   - Consider migrating to PostgreSQL for production

### Performance Optimization

1. **Enable Netlify Analytics:**
   - Go to Site settings → Analytics

2. **Configure Caching:**
   - Static assets are cached automatically
   - API responses can be cached with proper headers

3. **Enable Compression:**
   - Netlify automatically gzips assets

## 📈 Monitoring and Maintenance

### Health Checks

Set up monitoring for your deployed services:

1. **Backend Health:**
   ```bash
   curl https://your-backend-url.com/api/health
   ```

2. **Frontend Health:**
   - Use Netlify's built-in monitoring
   - Set up Uptime Robot or similar service

### Automatic Deployments

- Frontend: Automatically deploys on Git push (if connected to Git)
- Backend: Depends on your hosting provider's configuration

### Database Backups

Since you're using SQLite:
- Consider migrating to a managed database service
- Set up regular database backups
- Test restore procedures

## 🔐 Security Considerations

1. **Environment Variables:**
   - Never commit sensitive data to Git
   - Use strong JWT secrets (32+ characters)
   - Rotate secrets regularly

2. **HTTPS:**
   - Netlify provides automatic HTTPS
   - Ensure backend also uses HTTPS

3. **CORS:**
   - Only allow necessary origins
   - Don't use wildcard (*) in production

## 📚 Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)

## 🎉 Deployment Complete!

Your EthioInvest Network application should now be live! 

- **Frontend:** `https://your-app.netlify.app`
- **Backend:** `https://your-backend-url.com`

Remember to test all functionality and monitor your application after deployment.