# 🚀 Complete Deployment Guide

## ✅ Current Status

- ✅ Backend fully functional with AI agents
- ✅ Frontend fully built and integrated
- ✅ All endpoints connected and tested
- ✅ Ready for production deployment

---

## 📋 Deployment Overview

### Two-Part Deployment

1. **Frontend** → Vercel (Free, Easy, Fast)
2. **Backend** → Railway/Render/AWS (Choose one)

**Why separate?**
- Frontend (Next.js) → Static/Serverless on Vercel
- Backend (Python/Flask) → Needs persistent server

---

## 🎯 Part 1: Deploy Frontend to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

#### Step 1: Prepare Frontend

```bash
# Make sure everything is committed
cd frontend
git add .
git commit -m "Ready for deployment"
```

#### Step 2: Push to GitHub

```bash
# If not already a git repo
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/healthcare-frontend.git
git branch -M main
git push -u origin main
```

#### Step 3: Deploy to Vercel

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend` (if monorepo) or `.` (if separate)
   - **Build Command**: `pnpm build` or `npm run build`
   - **Output Directory**: `.next`

#### Step 4: Set Environment Variables

In Vercel dashboard, add:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_APP_NAME=Healthcare Settlement Platform
NEXT_PUBLIC_ENABLE_DEMO=true
```

**Important**: Leave `NEXT_PUBLIC_API_URL` as localhost for now. We'll update it after deploying the backend.

#### Step 5: Deploy

Click "Deploy" and wait ~2 minutes.

**Your frontend will be live at**: `https://your-project.vercel.app`

---

### Option B: Deploy via Vercel CLI (Faster)

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? healthcare-settlement
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

---

## 🎯 Part 2: Deploy Backend

### Option A: Railway (Recommended - Easiest)

#### Step 1: Prepare Backend

Create `railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python api_server_enhanced.py",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

Create `Procfile`:
```
web: python api_server_enhanced.py
```

Update `api_server_enhanced.py` (last line):
```python
if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
```

#### Step 2: Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# Get URL
railway domain
```

**Your backend will be at**: `https://your-project.up.railway.app`

#### Step 3: Update Frontend Environment Variable

Go to Vercel dashboard → Your Project → Settings → Environment Variables

Update:
```
NEXT_PUBLIC_API_URL=https://your-project.up.railway.app
```

Redeploy frontend:
```bash
vercel --prod
```

---

### Option B: Render (Free Tier Available)

#### Step 1: Create `render.yaml`

```yaml
services:
  - type: web
    name: healthcare-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: python api_server_enhanced.py
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
      - key: PORT
        value: 5000
```

#### Step 2: Deploy

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: healthcare-backend
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python api_server_enhanced.py`
5. Click "Create Web Service"

**Your backend will be at**: `https://healthcare-backend.onrender.com`

---

### Option C: AWS EC2 (Most Control)

#### Step 1: Launch EC2 Instance

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install dependencies
sudo apt update
sudo apt install python3-pip nginx

# Clone your repo
git clone https://github.com/YOUR_USERNAME/healthcare-backend.git
cd healthcare-backend

# Install Python packages
pip3 install -r requirements.txt

# Install gunicorn
pip3 install gunicorn
```

#### Step 2: Create Systemd Service

Create `/etc/systemd/system/healthcare-api.service`:
```ini
[Unit]
Description=Healthcare Settlement API
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/healthcare-backend
ExecStart=/usr/bin/python3 api_server_enhanced.py
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Start service
sudo systemctl start healthcare-api
sudo systemctl enable healthcare-api
```

#### Step 3: Configure Nginx

Create `/etc/nginx/sites-available/healthcare-api`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/healthcare-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 Production Configuration

### Backend Security

Update `api_server_enhanced.py`:

```python
from flask_cors import CORS

# Restrict CORS to your frontend domain
CORS(app, origins=[
    "https://your-project.vercel.app",
    "http://localhost:3000"  # For local development
])

# Disable debug mode
if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(
        debug=False,  # Important!
        host='0.0.0.0',
        port=port
    )
```

### Environment Variables

**Backend** (Railway/Render):
```
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=https://your-project.vercel.app
```

**Frontend** (Vercel):
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_APP_NAME=Healthcare Settlement Platform
NEXT_PUBLIC_ENABLE_DEMO=true
NODE_ENV=production
```

---

## 🧪 Test Production Deployment

### 1. Test Backend

```bash
# Health check
curl https://your-backend-url.com/api/health

# Submit test claim
curl -X POST https://your-backend-url.com/api/claims/submit \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "PAT_TEST",
    "documents": [{
      "type": "hospital_bill",
      "amount": 35000,
      "hasSignature": true
    }]
  }'
```

### 2. Test Frontend

1. Open `https://your-project.vercel.app`
2. Submit a claim
3. Verify it appears in insurer dashboard
4. Process the claim
5. Check blockchain explorer

---

## 📊 Deployment Checklist

### Pre-Deployment
- [x] Backend tested locally
- [x] Frontend tested locally
- [x] Integration tests passing
- [x] Environment variables configured
- [x] CORS configured
- [x] Debug mode disabled

### Backend Deployment
- [ ] Choose hosting provider
- [ ] Deploy backend
- [ ] Get backend URL
- [ ] Test backend endpoints
- [ ] Configure CORS with frontend URL

### Frontend Deployment
- [ ] Push code to GitHub
- [ ] Connect to Vercel
- [ ] Set environment variables
- [ ] Deploy frontend
- [ ] Test frontend functionality

### Post-Deployment
- [ ] Test complete flow
- [ ] Verify AI agents working
- [ ] Check blockchain updates
- [ ] Test demo scenarios
- [ ] Monitor for errors

---

## 🔧 Troubleshooting

### Issue: Frontend can't connect to backend

**Solution:**
1. Check `NEXT_PUBLIC_API_URL` in Vercel
2. Verify backend is running
3. Check CORS configuration
4. Look at browser console for errors

### Issue: CORS errors in production

**Solution:**
Update `api_server_enhanced.py`:
```python
CORS(app, origins=[
    "https://your-project.vercel.app",
    "https://*.vercel.app"  # Allow all Vercel preview deployments
])
```

### Issue: Backend crashes on startup

**Solution:**
1. Check logs in Railway/Render dashboard
2. Verify all dependencies in `requirements.txt`
3. Check Python version compatibility
4. Ensure PORT environment variable is used

### Issue: Environment variables not working

**Solution:**
1. Vercel: Redeploy after changing env vars
2. Railway: Variables update automatically
3. Check variable names (must start with `NEXT_PUBLIC_` for frontend)

---

## 💰 Cost Estimates

### Free Tier Options

**Vercel (Frontend)**
- ✅ Free for personal projects
- ✅ Unlimited bandwidth
- ✅ Automatic HTTPS
- ✅ Global CDN

**Railway (Backend)**
- ✅ $5 free credit/month
- ✅ ~500 hours free
- ✅ After free tier: ~$5-10/month

**Render (Backend)**
- ✅ Free tier available
- ⚠️ Spins down after inactivity
- ✅ After free tier: $7/month

**Total Cost**: $0-15/month

---

## 🚀 Quick Deploy Commands

### Deploy Everything (5 Minutes)

```bash
# 1. Deploy Backend to Railway
cd /path/to/backend
railway login
railway init
railway up
BACKEND_URL=$(railway domain)

# 2. Deploy Frontend to Vercel
cd /path/to/frontend
vercel login
vercel --prod

# 3. Update Frontend Environment Variable
vercel env add NEXT_PUBLIC_API_URL production
# Enter: $BACKEND_URL

# 4. Redeploy Frontend
vercel --prod

# Done! 🎉
```

---

## 📈 Monitoring & Maintenance

### Vercel Dashboard
- View deployment logs
- Monitor performance
- Check analytics
- Manage domains

### Railway/Render Dashboard
- View application logs
- Monitor resource usage
- Check uptime
- Manage environment variables

### Set Up Alerts

**Vercel**: Integrations → Add monitoring service

**Railway**: Settings → Notifications

---

## 🎯 Production Optimization

### Frontend (Vercel)

Already optimized by Vercel:
- ✅ Automatic code splitting
- ✅ Image optimization
- ✅ Edge caching
- ✅ Compression

### Backend Optimization

Add to `api_server_enhanced.py`:

```python
from flask_caching import Cache
from flask_compress import Compress

# Enable compression
Compress(app)

# Add caching
cache = Cache(app, config={
    'CACHE_TYPE': 'simple',
    'CACHE_DEFAULT_TIMEOUT': 300
})

@app.route('/api/blockchain/state')
@cache.cached(timeout=60)
def get_blockchain_state():
    # Cached for 60 seconds
    pass
```

Install:
```bash
pip install flask-caching flask-compress
```

---

## ✅ Success Criteria

Your deployment is successful when:

1. ✅ Frontend loads at Vercel URL
2. ✅ Backend responds to health check
3. ✅ Can submit claims from production frontend
4. ✅ AI agents process claims correctly
5. ✅ Blockchain updates visible
6. ✅ Demo scenarios work
7. ✅ No CORS errors
8. ✅ HTTPS enabled on both
9. ✅ Mobile responsive
10. ✅ Fast load times (< 3s)

---

## 🎉 You're Live!

After deployment:

**Frontend**: `https://your-project.vercel.app`  
**Backend**: `https://your-backend.railway.app`  
**Status**: ✅ Production Ready

**Share your live demo!** 🚀

---

## 📞 Quick Reference

### Vercel Commands
```bash
vercel login          # Login
vercel                # Deploy preview
vercel --prod         # Deploy production
vercel logs           # View logs
vercel env ls         # List env vars
```

### Railway Commands
```bash
railway login         # Login
railway init          # Initialize
railway up            # Deploy
railway logs          # View logs
railway domain        # Get URL
```

### Update Deployment
```bash
# Frontend
cd frontend
git push origin main  # Auto-deploys on Vercel

# Backend
cd backend
git push origin main  # Auto-deploys on Railway
```

---

**Need help?** Check:
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs

**Ready to deploy?** Follow the steps above! 🚀
