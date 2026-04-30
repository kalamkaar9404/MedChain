# 🚀 START HERE FIRST

## Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
# Backend
pip install flask flask-cors

# Frontend
cd frontend
npm install
cd ..
```

### Step 2: Start Everything

**Windows:**
```bash
start.bat
```

**Mac/Linux:**
```bash
# Terminal 1
python api_server.py

# Terminal 2 (new terminal)
cd frontend
npm run dev
```

### Step 3: Open Browser

Go to: **http://localhost:3000**

## ✅ That's It!

The system is now running. Try these pages:

- **Patient Dashboard**: http://localhost:3000/patient/dashboard
- **Insurer Dashboard**: http://localhost:3000/insurer/dashboard
- **Auditor Dashboard**: http://localhost:3000/auditor/dashboard
- **Blockchain Explorer**: http://localhost:3000/blockchain
- **Demo Page**: http://localhost:3000/demo
- **System Status**: http://localhost:3000/status

## 🧪 Quick Test

1. Go to Patient Dashboard
2. Fill out the form:
   - Amount: 35000
   - Reason: Medical treatment
   - Pick any dates
   - Add document hash: "test123"
   - Select document type: Medical Invoice
3. Click "Submit Claim"
4. Watch it appear in the list below with status "APPROVED" (auto-processed by AI agent!)

## 📚 More Information

- **SETUP_GUIDE.md** - Detailed setup instructions
- **README.md** - Full documentation
- **FIXES_APPLIED.md** - What was fixed

## 🐛 Problems?

### Backend won't start
```bash
pip install flask flask-cors
python api_server.py
```

### Frontend won't start
```bash
cd frontend
npm install
npm run dev
```

### Still stuck?
Check: http://localhost:5000/api/health

Should return:
```json
{
  "status": "healthy",
  "agents": {
    "patient": "active",
    "insurer": "active",
    "auditor": "active"
  }
}
```

## 🎉 Everything Fixed!

✅ Backend API working
✅ Frontend working
✅ All agents working
✅ Patient dashboard loading properly
✅ Claims showing up
✅ Auto-processing working
✅ Repository cleaned up

**Enjoy!**
