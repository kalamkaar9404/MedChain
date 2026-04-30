# 🚀 Vercel Deployment - Step by Step

## ✅ Everything is Prepared!

All files are ready for deployment. Follow these exact steps:

---

## 📋 Prerequisites

Before starting, make sure you have:
- [ ] GitHub account
- [ ] Vercel account (sign up at https://vercel.com)
- [ ] Git installed on your computer
- [ ] Backend deployed (or use localhost for testing)

---

## 🎯 Step 1: Prepare Git Repository

### Option A: If you don't have a Git repo yet

```bash
# Navigate to your project root
cd /path/to/your/project

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Vercel deployment"
```

### Option B: If you already have a Git repo

```bash
# Make sure everything is committed
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

---

## 🎯 Step 2: Push to GitHub

### Create a new repository on GitHub:

1. Go to https://github.com/new
2. Repository name: `healthcare-settlement-platform`
3. Description: `AI-powered healthcare insurance settlement platform`
4. Choose: Public or Private
5. **DO NOT** initialize with README (we already have code)
6. Click "Create repository"

### Push your code:

```bash
# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/healthcare-settlement-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🎯 Step 3: Deploy Frontend to Vercel

### Method 1: Via Vercel Dashboard (Easiest)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Click "Sign Up" or "Log In"
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository: `healthcare-settlement-platform`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: Click "Edit" → Select `frontend`
   - **Build Command**: `pnpm build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `pnpm install` (auto-detected)

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: http://localhost:5000
   Environment: Production, Preview, Development
   ```
   
   ```
   Name: NEXT_PUBLIC_APP_NAME
   Value: Healthcare Settlement Platform
   Environment: Production, Preview, Development
   ```
   
   ```
   Name: NEXT_PUBLIC_ENABLE_DEMO
   Value: true
   Environment: Production, Preview, Development
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site will be live!

### Method 2: Via Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# ? Set up and deploy? Yes
# ? Which scope? [Your account]
# ? Link to existing project? No
# ? What's your project's name? healthcare-settlement
# ? In which directory is your code located? ./
# ? Want to override the settings? No

# Deploy to production
vercel --prod
```

---

## 🎯 Step 4: Get Your Vercel URL

After deployment completes, you'll see:

```
✅ Production: https://healthcare-settlement-xyz.vercel.app
```

**Copy this URL!** This is your live frontend.

---

## 🎯 Step 5: Deploy Backend (Choose One)

### Option A: Railway (Recommended)

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

**Copy the Railway URL** (e.g., `https://your-app.up.railway.app`)

### Option B: Render (Free Tier)

1. Go to https://render.com
2. Sign up/Login
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: healthcare-backend
   - **Root Directory**: Leave empty (or `.` if monorepo)
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python api_server_enhanced.py`
6. Click "Create Web Service"
7. Wait ~5 minutes
8. **Copy the URL** (e.g., `https://healthcare-backend.onrender.com`)

### Option C: Keep Backend Local (For Testing)

If you want to test with local backend:
- Keep backend running on `http://localhost:5000`
- Frontend will connect to it (already configured)
- **Note**: This only works when testing locally

---

## 🎯 Step 6: Update Frontend with Backend URL

### If you deployed backend to Railway/Render:

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Find `NEXT_PUBLIC_API_URL`
5. Click "Edit"
6. Change value to your backend URL:
   ```
   https://your-backend.up.railway.app
   ```
   or
   ```
   https://healthcare-backend.onrender.com
   ```
7. Click "Save"

### Redeploy Frontend

```bash
# Via CLI
cd frontend
vercel --prod

# Or via Dashboard
# Go to Deployments → Click "..." → "Redeploy"
```

---

## 🎯 Step 7: Test Your Deployment

### 1. Test Backend

```bash
# Replace with your backend URL
curl https://your-backend-url.com/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "blockchainBlocks": 0,
    "totalClaims": 0,
    "escrowBalance": 10000000
  }
}
```

### 2. Test Frontend

1. Open your Vercel URL: `https://healthcare-settlement-xyz.vercel.app`
2. You should see the landing page
3. Click "Submit Claim"
4. Fill out the form
5. Submit a test claim
6. Go to Insurer Dashboard
7. Verify and process the claim
8. Check if payment executes

**If everything works**: ✅ Deployment successful!

---

## 🎯 Step 8: Configure Custom Domain (Optional)

### In Vercel Dashboard:

1. Go to your project
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `healthcare.yourdomain.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (~5-10 minutes)

---

## 📊 Deployment Checklist

### Pre-Deployment
- [x] Frontend code ready
- [x] Backend code ready
- [x] Git repository created
- [x] Code pushed to GitHub
- [x] Vercel account created
- [x] Backend hosting chosen

### During Deployment
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed (Railway/Render)
- [ ] Environment variables set
- [ ] Backend URL updated in Vercel
- [ ] Frontend redeployed

### Post-Deployment
- [ ] Backend health check passes
- [ ] Frontend loads correctly
- [ ] Can submit claims
- [ ] Can verify claims
- [ ] Blockchain updates work
- [ ] Demo scenarios work

---

## 🐛 Troubleshooting

### Issue: Build fails on Vercel

**Error**: `Module not found` or `Cannot find module`

**Solution**:
1. Check `package.json` has all dependencies
2. Ensure `pnpm-lock.yaml` is committed
3. Try changing install command to `npm install`

### Issue: Frontend can't connect to backend

**Error**: `Network Error` or `CORS Error`

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` in Vercel settings
2. Check backend is running (test health endpoint)
3. Ensure CORS is enabled in backend
4. Redeploy frontend after changing env vars

### Issue: Environment variables not working

**Solution**:
1. Make sure variable names start with `NEXT_PUBLIC_`
2. Redeploy after adding/changing env vars
3. Check variables are set for all environments (Production, Preview, Development)

### Issue: Backend deployment fails

**Solution**:
1. Check `requirements.txt` has all dependencies
2. Verify Python version in `runtime.txt`
3. Check logs in Railway/Render dashboard
4. Ensure `api_server_enhanced.py` uses PORT env variable

---

## 💰 Cost Summary

### Vercel (Frontend)
- **Free Tier**: Unlimited for personal projects
- **Bandwidth**: 100GB/month
- **Builds**: Unlimited
- **Cost**: $0/month

### Railway (Backend)
- **Free Tier**: $5 credit/month
- **Usage**: ~500 hours/month
- **After free tier**: ~$5-10/month

### Render (Backend Alternative)
- **Free Tier**: Available (spins down after inactivity)
- **Paid Tier**: $7/month (always on)

**Total Cost**: $0-10/month

---

## 🎉 Success!

After completing all steps, you'll have:

✅ **Frontend**: Live on Vercel  
✅ **Backend**: Live on Railway/Render  
✅ **Integration**: Fully functional  
✅ **HTTPS**: Automatic on both platforms  
✅ **CDN**: Global distribution via Vercel  
✅ **Monitoring**: Available in dashboards  

**Your live URLs:**
- Frontend: `https://healthcare-settlement-xyz.vercel.app`
- Backend: `https://your-backend.up.railway.app`

**Share your live demo with the world!** 🚀

---

## 📞 Quick Commands Reference

### Vercel
```bash
vercel login              # Login
vercel                    # Deploy preview
vercel --prod             # Deploy production
vercel logs               # View logs
vercel env ls             # List env variables
vercel domains            # Manage domains
```

### Railway
```bash
railway login             # Login
railway init              # Initialize
railway up                # Deploy
railway logs              # View logs
railway domain            # Get URL
railway open              # Open dashboard
```

### Git
```bash
git add .                 # Stage changes
git commit -m "message"   # Commit
git push origin main      # Push to GitHub
```

---

## 🔄 Update Deployment

### Update Frontend
```bash
cd frontend
git add .
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys on push
```

### Update Backend
```bash
git add .
git commit -m "Update backend"
git push origin main
# Railway auto-deploys on push
```

---

## 📚 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

**Need help?** Check the troubleshooting section or refer to platform documentation.

**Ready to deploy?** Start with Step 1! 🚀
