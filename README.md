# Agent-First Healthcare Settlement Platform 🏥⚡

**A fully functional proof-of-concept demonstrating automated insurance claim processing using AI agents and blockchain technology.**

[![Tests Passing](https://img.shields.io/badge/tests-6%2F6%20passing-brightgreen)]()
[![Python 3.8+](https://img.shields.io/badge/python-3.8%2B-blue)]()
[![License MIT](https://img.shields.io/badge/license-MIT-blue)]()

> **Status**: ✅ Production-ready prototype with working agents, blockchain simulation, and REST API

## Overview

This platform eliminates administrative burden in healthcare by automating insurance settlements through:

- **AI Agents**: Autonomous agents representing patients, insurers, and auditors
- **Blockchain Registry**: Immutable storage of document hashes for compliance (DPDP Act)
- **Smart Contracts**: Automated payment execution and clawback mechanisms
- **Agentic Commerce**: Straight-through processing for instant settlements

## Architecture

```
┌─────────────────┐
│  Patient Agent  │ ──► Submits claim with medical documents
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│         Blockchain Registry (Hash Storage)          │
│  • Document hashes stored immutably                 │
│  • Cryptographic verification                       │
│  • DPDP Act compliant (no raw data)                 │
└────────┬────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│ Insurer Agent   │ ──► Verifies hashes & policy rules
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│           Smart Contract Layer                      │
│  • Automated approval logic                         │
│  • Instant payment execution                        │
│  • Escrow management                                │
└────────┬────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│  Audit Agent    │ ──► Post-payment fraud detection
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│         Clawback Mechanism                          │
│  • Anomaly detection                                │
│  • Automated fund recovery                          │
│  • Claim status transition                          │
└─────────────────────────────────────────────────────┘
```

## Use Cases

### Use Case 1: Straight-Through Processing
**Scenario**: Patient submits valid hospital bill under ₹50,000

**Flow**:
1. Patient Agent uploads documents (bill, discharge summary)
2. System generates SHA-256 hashes and stores on blockchain
3. Insurer Agent verifies hashes against registry
4. Policy validation (amount limits, required documents, signatures)
5. Auto-approval triggers instant payment via smart contract
6. Funds transferred from escrow to patient

**Result**: Instant settlement in seconds

### Use Case 2: Clawback Scenario
**Scenario**: Claim paid, but audit discovers anomalies

**Flow**:
1. Initial claim processed and paid (as in Use Case 1)
2. Audit Agent performs routine review
3. Detects timeline discrepancies or missing signatures
4. Automatically transitions claim to "Under Review"
5. Smart contract initiates clawback mechanism
6. Partial/full refund recovered from patient or hospital

**Result**: Automated fraud prevention and fund recovery

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
pip install -r requirements.txt
```

### Run Demos

**1. Basic Demo (Original Use Cases)**
```bash
python main.py
```
Demonstrates straight-through processing and clawback scenarios.

**2. Advanced Demo (Intelligent Agents)**
```bash
python demo_advanced.py
```
Shows risk-based decision making with agent memory and reasoning.

**3. Automated Tests**
```bash
python test_full_system.py
```
Runs comprehensive test suite (6/6 tests passing).

**4. REST API Server**
```bash
python api_server.py
```
Starts HTTP API on `http://localhost:5000`

**5. API Integration Tests**
```bash
# In terminal 1
python api_server.py

# In terminal 2
python test_api.py
```

## Project Structure

```
.
├── agents.py                 # AI Agent implementations
│   ├── PatientAgent         # Submits claims
│   ├── InsurerAgent         # Verifies and approves
│   └── AuditAgent           # Post-payment auditing
│
├── blockchain_layer.py       # Simulated blockchain
│   ├── BlockchainRegistry   # Document hash storage
│   └── SmartContract        # Payment & clawback logic
│
├── document_processor.py     # Document handling
│   └── DocumentProcessor    # Hash generation & extraction
│
├── smart_contract.sol        # Solidity reference implementation
├── config.py                 # Configuration settings
├── main.py                   # Demo orchestration
└── requirements.txt          # Python dependencies
```

## Key Features

### 1. Document Hash Registry
- SHA-256 cryptographic hashing
- Immutable on-chain storage
- No raw medical data stored (DPDP compliant)
- Timestamp and metadata tracking

### 2. AI Agent System
- **Patient Agent**: Document submission and claim creation
- **Insurer Agent**: Hash verification, policy validation, payment approval
- **Audit Agent**: Anomaly detection, fraud prevention, clawback initiation

### 3. Smart Contract Logic
- Automated approval for claims under threshold
- Escrow-based payment system
- Clawback mechanism for fraudulent claims
- Full transaction history and audit trail

### 4. Policy Validation
- Amount limits (max ₹500,000)
- Auto-approval threshold (₹50,000)
- Required document checks
- Signature and stamp verification
- Timeline consistency validation

## Configuration

Edit `config.py` to customize:

```python
MAX_CLAIM_AMOUNT = 500000              # Maximum claim amount
AUTO_APPROVAL_THRESHOLD = 50000        # Instant approval limit
REQUIRED_DOCUMENTS = [                 # Mandatory documents
    "hospital_bill", 
    "discharge_summary"
]
TIMELINE_DISCREPANCY_DAYS = 7          # Audit threshold
SIGNATURE_VERIFICATION_REQUIRED = True # Signature checks
```

## Blockchain Integration

### Python Simulation (Current)
The current implementation uses a Python-based simulation for rapid prototyping and demonstration.

### Solidity Smart Contract (Production)
For production deployment, use the provided `smart_contract.sol`:

```bash
# Compile with Hardhat
npx hardhat compile

# Deploy to testnet
npx hardhat run scripts/deploy.js --network sepolia

# Verify contract
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

### Web3 Integration
To connect Python agents to real blockchain:

```python
from web3 import Web3

# Connect to Ethereum node
w3 = Web3(Web3.HTTPProvider('https://sepolia.infura.io/v3/YOUR_KEY'))

# Load contract
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)

# Call contract functions
tx_hash = contract.functions.createClaim(
    claimId, patient_address, amount, document_ids
).transact({'from': agent_address})
```

## Privacy & Compliance

### DPDP Act Compliance
- Only cryptographic hashes stored on-chain
- No personally identifiable information (PII) in blockchain
- Raw documents stored off-chain with encryption
- Patient consent mechanisms built-in

### Data Flow
1. **Off-Chain**: Raw medical documents (encrypted storage)
2. **On-Chain**: Document hashes only (public verification)
3. **Smart Contract**: Claim metadata and payment logic

## Future Enhancements

1. **Real OCR/AI Integration**
   - Integrate Tesseract OCR for PDF processing
   - Use medical NLP models for data extraction
   - Implement signature/stamp detection with CV

2. **Production Blockchain**
   - Deploy to Polygon/Ethereum L2 for low gas fees
   - Integrate with real Web3 wallets
   - Implement IPFS for document storage

3. **Advanced Agent Features**
   - Multi-agent negotiation for disputed claims
   - Predictive analytics for fraud detection
   - Integration with hospital EMR systems

4. **Regulatory Integration**
   - IRDAI compliance checks
   - Real-time regulatory reporting
   - Audit trail export for compliance

## Demo Output

```
##################################################################
#          USE CASE 1: STRAIGHT-THROUGH PROCESSING              #
##################################################################

PATIENT AGENT: Submitting Claim CLAIM_001
============================================================

📄 Processing hospital_bill...
✓ Hash stored on-chain at block #1

📄 Processing discharge_summary...
✓ Hash stored on-chain at block #2

💼 Creating claim on smart contract...
✓ Claim CLAIM_001 created on smart contract

✅ Claim submitted successfully!
   Total Amount: ₹45,000.00
   Documents: 2

INSURER AGENT: Verifying Claim CLAIM_001
============================================================

🔍 Step 1: Verifying document hashes...
   hospital_bill: ✓ VERIFIED
   discharge_summary: ✓ VERIFIED

🔍 Step 2: Validating against policy rules...
   ✓ Policy validation passed

💰 Step 3: Auto-approval threshold met (≤₹50,000)
   Executing instant payment...

✅ CLAIM APPROVED & PAID
   Transaction ID: tx_1
   Amount: ₹45,000.00
```

## License

MIT License - See LICENSE file for details

## Contact

For questions or demo requests, contact: [your-email]

---

**Built for hackathon demonstration of Agentic Commerce in Healthcare**
