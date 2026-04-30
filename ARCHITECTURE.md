# System Architecture

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
│                      http://localhost:3000                       │
├─────────────────────────────────────────────────────────────────┤
│  Patient Dashboard  │  Insurer Dashboard  │  Auditor Dashboard  │
│  Blockchain Explorer │  Demo Page  │  Status Page               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ REST API Calls
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    BACKEND API (Flask)                           │
│                   http://localhost:5000                          │
├─────────────────────────────────────────────────────────────────┤
│  Endpoints:                                                      │
│  • /api/claims/submit          • /api/insurer/pending-claims   │
│  • /api/claims                 • /api/auditor/queue            │
│  • /api/blockchain/state       • /api/demo/run-scenario        │
└────────────┬────────────────────┬────────────────┬──────────────┘
             │                    │                │
             ▼                    ▼                ▼
┌────────────────────┐  ┌────────────────┐  ┌──────────────────┐
│   Patient Agent    │  │  Insurer Agent │  │   Audit Agent    │
├────────────────────┤  ├────────────────┤  ├──────────────────┤
│ • Submit claims    │  │ • Verify docs  │  │ • Detect fraud   │
│ • Hash documents   │  │ • Risk analysis│  │ • Clawback       │
│ • Store on chain   │  │ • Auto-approve │  │ • Post-payment   │
└────────┬───────────┘  └───────┬────────┘  └────────┬─────────┘
         │                      │                     │
         └──────────────────────┼─────────────────────┘
                                │
                                ▼
                ┌───────────────────────────────┐
                │   Smart Contract & Blockchain │
                ├───────────────────────────────┤
                │ • Claim storage               │
                │ • Document hash registry      │
                │ • Transaction history         │
                │ • Escrow management           │
                └───────────────────────────────┘
```

## Data Flow

### 1. Claim Submission Flow

```
Patient Dashboard
    │
    │ 1. Fill form (amount, reason, dates, documents)
    │
    ▼
POST /api/claims/submit
    │
    │ 2. Create claim with documents
    │
    ▼
Patient Agent
    │
    │ 3. Hash each document (SHA-256)
    │ 4. Store hashes on blockchain
    │
    ▼
Smart Contract
    │
    │ 5. Create claim record
    │ 6. Store in claims_db
    │
    ▼
Insurer Agent (Auto-process)
    │
    │ 7. Verify document hashes
    │ 8. Calculate risk score
    │ 9. Make decision:
    │    • Amount ≤ ₹50k → AUTO_APPROVE
    │    • Amount > ₹50k → APPROVE_WITH_MONITORING
    │    • High risk → MANUAL_REVIEW
    │
    ▼
Update Claim Status
    │
    │ 10. Status: APPROVED / MANUAL_REVIEW
    │
    ▼
Return to Frontend
    │
    │ 11. Display in claims list
    │
    ▼
Patient sees claim with status
```

### 2. Audit Flow

```
Approved Claims
    │
    │ Routine post-payment audit
    │
    ▼
Audit Agent
    │
    │ 1. Check timeline consistency
    │ 2. Verify signatures & stamps
    │ 3. Detect anomalies
    │
    ▼
Anomaly Detected?
    │
    ├─ No → Mark as clean
    │
    └─ Yes → Initiate clawback
           │
           │ 1. Change status to CLAWED_BACK
           │ 2. Recover funds from escrow
           │ 3. Log in anomalies_db
           │
           ▼
       Fraud prevented
```

## Component Breakdown

### Frontend (Next.js 14)

```
frontend/
├── app/                          # Pages (App Router)
│   ├── page.tsx                 # Landing page
│   ├── patient/dashboard/       # Patient interface
│   ├── insurer/dashboard/       # Insurer interface
│   ├── auditor/dashboard/       # Auditor interface
│   ├── blockchain/              # Blockchain explorer
│   ├── demo/                    # Demo scenarios
│   └── status/                  # System status
│
├── components/                   # React components
│   ├── claims/                  # Claim-related components
│   ├── analytics/               # Charts & analytics
│   ├── blockchain/              # Blockchain UI
│   └── ui/                      # shadcn/ui components
│
├── lib/                         # Utilities
│   ├── api.ts                   # API client
│   ├── types.ts                 # TypeScript types
│   ├── constants.ts             # Constants & config
│   └── utils.ts                 # Helper functions
│
└── hooks/                       # Custom React hooks
    ├── useApi.ts                # Generic API hook
    ├── useClaims.ts             # Claims data hook
    └── useBlockchain.ts         # Blockchain data hook
```

### Backend (Flask)

```
Backend/
├── api_server.py                # Main API server
│   ├── Health endpoints         # /api/health
│   ├── Patient endpoints        # /api/claims/*
│   ├── Insurer endpoints        # /api/insurer/*
│   ├── Auditor endpoints        # /api/auditor/*
│   ├── Blockchain endpoints     # /api/blockchain/*
│   └── Demo endpoints           # /api/demo/*
│
├── agents.py                    # Basic AI agents
│   ├── PatientAgent            # Claim submission
│   ├── InsurerAgent            # Verification
│   └── AuditAgent              # Fraud detection
│
├── advanced_agents.py           # Advanced agents
│   ├── AdvancedInsurerAgent    # With reasoning
│   └── AdvancedAuditAgent      # With memory
│
├── blockchain_layer.py          # Blockchain simulation
│   ├── BlockchainRegistry      # Document hash storage
│   └── SmartContract           # Claim management
│
├── document_processor.py        # Document handling
│   └── DocumentProcessor       # SHA-256 hashing
│
└── config.py                    # Configuration
    ├── MAX_CLAIM_AMOUNT        # ₹500,000
    ├── AUTO_APPROVAL_THRESHOLD # ₹50,000
    └── REQUIRED_DOCUMENTS      # List
```

## Key Features

### 1. Instant Settlement
- Claims ≤ ₹50,000 auto-approved
- AI-powered risk assessment
- Straight-through processing

### 2. Blockchain Verification
- Immutable document hashes
- Tamper-proof audit trail
- DPDP Act compliant

### 3. AI Agents
- **Patient Agent**: Submits claims
- **Insurer Agent**: Verifies & approves
- **Audit Agent**: Detects fraud

### 4. Fraud Detection
- Timeline consistency checks
- Signature verification
- Anomaly detection
- Automated clawback

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React hooks
- **API Client**: Fetch API

### Backend
- **Framework**: Flask
- **Language**: Python 3.8+
- **CORS**: flask-cors
- **Storage**: In-memory (demo)
- **Blockchain**: Simulated

### AI/ML
- Rule-based agents
- Risk scoring algorithms
- Anomaly detection
- Chain-of-thought reasoning

## Configuration

### Backend Config (`config.py`)

```python
# Blockchain
BLOCKCHAIN_NETWORK = "simulated"
GAS_LIMIT = 3000000

# Agents
PATIENT_AGENT_ID = "patient_001"
INSURER_AGENT_ID = "insurer_001"
AUDIT_AGENT_ID = "audit_001"

# Policy Rules
MAX_CLAIM_AMOUNT = 500000          # ₹5 lakh
AUTO_APPROVAL_THRESHOLD = 50000    # ₹50k
REQUIRED_DOCUMENTS = [
    "hospital_bill",
    "discharge_summary"
]

# Audit Thresholds
TIMELINE_DISCREPANCY_DAYS = 7
SIGNATURE_VERIFICATION_REQUIRED = True
```

### Frontend Config (`.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Security Features

1. **Document Integrity**: SHA-256 hashing
2. **Blockchain Storage**: Immutable records
3. **CORS Protection**: Configured origins
4. **Input Validation**: All endpoints
5. **Error Handling**: Graceful failures

## Scalability

### Current (Demo)
- In-memory storage
- Single server
- Simulated blockchain

### Production Ready
- Replace with PostgreSQL/MongoDB
- Add Redis for caching
- Use real blockchain (Ethereum/Polygon)
- Add authentication (JWT)
- Deploy with Docker/Kubernetes
- Add load balancer

## Performance

- **Claim Submission**: < 1 second
- **Auto-approval**: < 2 seconds
- **Blockchain Verification**: < 500ms
- **API Response Time**: < 200ms

## Monitoring

- Health check endpoint: `/api/health`
- Agent state: `/api/agent/state`
- System metrics: `/api/system/metrics`
- Blockchain state: `/api/blockchain/state`
