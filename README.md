# Healthcare Claims Processing System

AI-powered healthcare claims settlement platform with blockchain verification and autonomous agents.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or pnpm

### Installation

1. **Install Backend Dependencies**
```bash
pip install -r requirements.txt
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
# or
pnpm install
```

### Running the Application

**Option 1: Use the startup script (Windows)**
```bash
start.bat
```

**Option 2: Manual start**

Terminal 1 - Backend:
```bash
python api_server.py
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

## 📁 Project Structure

```
├── api_server.py           # Main API server (Flask)
├── agents.py               # Basic AI agents
├── advanced_agents.py      # Advanced agents with reasoning
├── blockchain_layer.py     # Blockchain simulation
├── document_processor.py   # Document hashing & verification
├── config.py              # Configuration
├── requirements.txt       # Python dependencies
├── frontend/              # Next.js frontend
│   ├── app/              # Next.js 14 app router
│   ├── components/       # React components
│   ├── lib/             # Utilities & API client
│   └── hooks/           # Custom React hooks
└── start.bat            # Windows startup script
```

## 🎯 Features

### Patient Dashboard
- Submit insurance claims
- Upload medical documents
- Track claim status in real-time
- View claim history

### Insurer Dashboard
- Review pending claims
- Verify documents
- Approve/reject claims
- View analytics and statistics

### Auditor Dashboard
- Monitor approved claims
- Detect anomalies
- Initiate clawback for fraud
- View audit history

### Blockchain Explorer
- View all blocks and transactions
- Verify document integrity
- Track claim lifecycle

## 🤖 AI Agents

### Patient Agent
- Submits claims with document hashes
- Stores hashes on blockchain

### Insurer Agent
- Verifies document integrity
- Performs risk analysis
- Makes approval decisions
- Auto-approves claims ≤ ₹50,000

### Audit Agent
- Post-payment fraud detection
- Timeline consistency checks
- Signature verification
- Clawback mechanism

## 🔧 Configuration

Edit `config.py` to customize:
- `MAX_CLAIM_AMOUNT`: Maximum claim amount (₹500,000)
- `AUTO_APPROVAL_THRESHOLD`: Auto-approve limit (₹50,000)
- `REQUIRED_DOCUMENTS`: Required document types
- `TIMELINE_DISCREPANCY_DAYS`: Allowed date discrepancy (7 days)

## 📡 API Endpoints

### Health & System
- `GET /api/health` - Health check
- `GET /api/agent/state` - Agent states
- `GET /api/system/metrics` - System metrics

### Patient
- `POST /api/claims/submit` - Submit claim
- `GET /api/claims` - List claims
- `GET /api/claims/:id` - Get claim details

### Insurer
- `GET /api/insurer/pending-claims` - Pending claims
- `GET /api/insurer/stats` - Statistics
- `POST /api/claims/:id/approve` - Approve claim
- `POST /api/claims/:id/reject` - Reject claim

### Auditor
- `GET /api/auditor/queue` - Audit queue
- `GET /api/auditor/anomalies` - Detected anomalies
- `POST /api/claims/:id/audit` - Audit claim
- `POST /api/claims/:id/clawback` - Clawback claim

### Blockchain
- `GET /api/blockchain/state` - Blockchain state
- `GET /api/blockchain/blocks` - List blocks
- `GET /api/blockchain/transactions` - List transactions
- `POST /api/blockchain/verify-document` - Verify document

### Demo
- `GET /api/demo/scenarios` - Available scenarios
- `POST /api/demo/run-scenario` - Run demo scenario

## 🧪 Testing

Test the API:
```bash
python test_api.py
```

## 🛠️ Tech Stack

**Backend:**
- Flask (REST API)
- Python 3.8+
- Simulated Blockchain

**Frontend:**
- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Query

## 📝 License

MIT License

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.
