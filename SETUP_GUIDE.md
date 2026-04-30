# Setup Guide - Healthcare Claims Processing System

## ✅ Step-by-Step Setup

### 1. Install Backend Dependencies

```bash
pip install flask flask-cors
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Start the Backend

Open a terminal and run:
```bash
python api_server.py
```

You should see:
```
======================================================================
HEALTHCARE SETTLEMENT PLATFORM - API SERVER
======================================================================

All endpoints now match frontend expectations!

Starting server on http://localhost:5000
======================================================================
```

### 4. Test the Backend (Optional)

In another terminal:
```bash
python test_api_simple.py
```

This will verify all endpoints are working.

### 5. Start the Frontend

Open another terminal:
```bash
cd frontend
npm run dev
```

You should see:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
```

### 6. Access the Application

Open your browser and go to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/health

## 🎯 Quick Test

1. Go to http://localhost:3000/patient/dashboard
2. Fill out the claim form:
   - Amount: 35000
   - Reason: Medical treatment
   - Select dates
   - Add document hashes (any text)
3. Click "Submit Claim"
4. You should see the claim appear in the list below

## 🐛 Troubleshooting

### Backend won't start
- Make sure Python 3.8+ is installed: `python --version`
- Install dependencies: `pip install flask flask-cors`
- Check if port 5000 is available

### Frontend won't start
- Make sure Node.js 18+ is installed: `node --version`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check if port 3000 is available

### "Loading..." stuck on patient dashboard
- Make sure backend is running on port 5000
- Check browser console for errors (F12)
- Verify API is accessible: http://localhost:5000/api/health

### CORS errors
- Make sure flask-cors is installed: `pip install flask-cors`
- Restart the backend server

## 📁 Project Structure

```
├── api_server.py              # ✅ Main backend API
├── agents.py                  # ✅ AI agents
├── advanced_agents.py         # ✅ Advanced AI agents
├── blockchain_layer.py        # ✅ Blockchain simulation
├── document_processor.py      # ✅ Document processing
├── config.py                  # ✅ Configuration
├── requirements.txt           # ✅ Python dependencies
├── test_api_simple.py         # ✅ API tests
├── start.bat                  # ✅ Windows startup script
├── README.md                  # ✅ Main documentation
└── frontend/                  # ✅ Next.js frontend
    ├── app/                   # Pages
    ├── components/            # React components
    ├── lib/                   # Utilities
    └── hooks/                 # Custom hooks
```

## 🚀 Features Working

✅ Patient Dashboard - Submit and track claims
✅ Insurer Dashboard - Review and approve claims
✅ Auditor Dashboard - Audit and detect fraud
✅ Blockchain Explorer - View transactions
✅ Demo Page - Run demo scenarios
✅ Status Page - System health

## 🔧 Configuration

Edit `config.py` to change:
- Auto-approval threshold (default: ₹50,000)
- Maximum claim amount (default: ₹500,000)
- Required documents
- Timeline discrepancy tolerance

## 📡 API Endpoints

All endpoints are now working and match frontend expectations:

- ✅ `GET /api/health` - Health check
- ✅ `GET /api/claims` - List all claims
- ✅ `POST /api/claims/submit` - Submit new claim
- ✅ `GET /api/claims/:id` - Get claim details
- ✅ `GET /api/insurer/pending-claims` - Pending claims
- ✅ `GET /api/auditor/queue` - Audit queue
- ✅ `GET /api/blockchain/state` - Blockchain state
- ✅ `POST /api/demo/run-scenario` - Run demo

## 🎉 You're All Set!

The system is now fully functional. All agents are working, and the frontend is properly connected to the backend.
