# Railway Deployment Guide - Backend API

## Prerequisites
- Railway account (https://railway.app)
- GitHub repository with your code
- Vercel frontend already deployed

## Step 1: Push Latest Changes to GitHub

```bash
git add -A
git commit -m "Add Railway deployment configuration"
git push origin main
```

## Step 2: Deploy to Railway

### Option A: Deploy from GitHub (Recommended)

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: **kalamkaar9404/MedChain**
5. Railway will auto-detect Python and start deploying

### Option B: Deploy with Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

## Step 3: Configure Environment Variables

In Railway dashboard:

1. Go to your project
2. Click on **"Variables"** tab
3. Add these variables:

```
FLASK_ENV=production
PORT=5000
PYTHON_VERSION=3.11.0
```

## Step 4: Get Your Railway URL

After deployment completes:

1. Go to **"Settings"** tab
2. Click **"Generate Domain"** under "Domains"
3. Copy your Railway URL (e.g., `https://your-app.railway.app`)

## Step 5: Update Frontend Environment Variables

Update your Vercel frontend environment variables:

1. Go to Vercel dashboard
2. Select your frontend project
3. Go to **Settings** → **Environment Variables**
4. Update or add:

```
NEXT_PUBLIC_API_URL=https://your-app.railway.app
```

5. Click **"Save"**
6. Redeploy your frontend

## Step 6: Test the Deployment

Test your Railway backend:

```bash
# Health check
curl https://your-app.railway.app/api/health

# Get claims
curl https://your-app.railway.app/api/claims
```

## Railway Configuration Files

### ✅ `Procfile`
```
web: python api_server.py
```

### ✅ `runtime.txt`
```
python-3.11.0
```

### ✅ `requirements.txt`
```
flask==3.0.0
flask-cors==4.0.0
requests==2.31.0
pydantic==2.5.0
PyPDF2==3.0.1
python-dotenv==1.0.0
web3==6.11.3
```

## Troubleshooting

### Build Fails

**Check Python version:**
- Railway uses Python 3.11 by default
- Make sure `runtime.txt` specifies the correct version

**Check dependencies:**
```bash
# Test locally first
pip install -r requirements.txt
python api_server.py
```

### App Crashes on Start

**Check logs in Railway:**
1. Go to Railway dashboard
2. Click on your project
3. View **"Deployments"** → **"Logs"**

**Common issues:**
- Port not configured: Make sure app uses `PORT` env variable
- Missing dependencies: Check `requirements.txt`
- Import errors: Ensure all Python files are committed

### CORS Errors

The backend already has CORS configured:
```python
from flask_cors import CORS
CORS(app)
```

If you still get CORS errors, update to allow specific origins:
```python
CORS(app, origins=["https://your-frontend.vercel.app"])
```

### Frontend Can't Connect

1. **Check Railway URL is correct** in Vercel env variables
2. **Ensure Railway app is running** (check Railway dashboard)
3. **Test backend directly:**
   ```bash
   curl https://your-app.railway.app/api/health
   ```
4. **Check browser console** for specific error messages

## Environment Variables Summary

### Railway (Backend)
```
FLASK_ENV=production
PORT=5000
PYTHON_VERSION=3.11.0
```

### Vercel (Frontend)
```
NEXT_PUBLIC_API_URL=https://your-app.railway.app
```

## Deployment Checklist

- [ ] All files committed to GitHub
- [ ] Pushed to main branch
- [ ] Railway project created
- [ ] Railway deployment successful
- [ ] Railway domain generated
- [ ] Vercel env variables updated
- [ ] Frontend redeployed
- [ ] Backend health check passes
- [ ] Frontend can fetch claims
- [ ] Can submit test claim

## Quick Commands

```bash
# Push to GitHub
git add -A
git commit -m "Deploy to Railway"
git push origin main

# Test Railway backend
curl https://your-app.railway.app/api/health

# Test from frontend
# Open browser console and run:
fetch('https://your-app.railway.app/api/claims')
  .then(r => r.json())
  .then(console.log)
```

## Cost

Railway offers:
- **$5 free credit** per month
- **500 hours** of usage included
- Perfect for this project size

## Next Steps After Deployment

1. Test all endpoints from frontend
2. Submit a test claim
3. Verify all dashboards work
4. Monitor Railway logs for any errors
5. Set up custom domain (optional)

## Support

If you encounter issues:
1. Check Railway logs
2. Check Vercel logs
3. Test backend directly with curl
4. Verify environment variables
5. Check CORS configuration

## Production Considerations

For production use, consider:
- [ ] Add database (PostgreSQL on Railway)
- [ ] Add Redis for caching
- [ ] Set up monitoring (Railway provides basic metrics)
- [ ] Add authentication (JWT)
- [ ] Set up CI/CD pipeline
- [ ] Add rate limiting
- [ ] Set up logging service
- [ ] Configure custom domain
- [ ] Add SSL certificate (Railway provides free SSL)
- [ ] Set up backup strategy

## Railway Dashboard

Monitor your deployment:
- **Metrics**: CPU, Memory, Network usage
- **Logs**: Real-time application logs
- **Deployments**: Deployment history
- **Settings**: Environment variables, domains
- **Usage**: Track your monthly usage

Your backend is now deployed on Railway! 🚀
