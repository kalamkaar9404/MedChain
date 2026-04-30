# Quick Start Guide

## 🎯 Goal
Get the healthcare settlement platform running in under 5 minutes.

## ✅ Prerequisites
- Python 3.8 or higher
- pip package manager

## 📦 Installation

```bash
# Install dependencies
pip install -r requirements.txt
```

That's it! No database setup, no blockchain node, no complex configuration.

## 🚀 Run Your First Demo

### Option 1: Basic Demo (Recommended for first-time users)

```bash
python main.py
```

**What you'll see:**
- Use Case 1: Instant payment for valid claim (₹45,000)
- Use Case 2: Clawback after audit detects anomalies

**Duration:** ~2 minutes (interactive)

### Option 2: Advanced Demo (Shows AI reasoning)

```bash
python demo_advanced.py
```

**What you'll see:**
- Risk-based decision making
- Agent memory and learning
- Multi-layer audit analysis
- Confidence scores and reasoning

**Duration:** ~5 minutes (interactive)

### Option 3: Automated Tests (Verify everything works)

```bash
python test_full_system.py
```

**What you'll see:**
- 6 comprehensive tests
- All components verified
- Should show: "🎉 ALL TESTS PASSED"

**Duration:** ~30 seconds (automated)

## 🌐 Try the REST API

### Start the API Server

```bash
python api_server.py
```

Server starts on `http://localhost:5000`

### Test the API

In a new terminal:

```bash
python test_api.py
```

Or use curl:

```bash
# Health check
curl http://localhost:5000/health

# Get blockchain state
curl http://localhost:5000/api/v1/blockchain/state
```

## 📊 What Each Demo Shows

### main.py - Basic Flow
```
Patient → Submit Claim → Blockchain Hash Storage
                ↓
        Insurer Verification
                ↓
        Instant Payment (if valid)
                ↓
        Audit Detection
                ↓
        Clawback (if fraud)
```

### demo_advanced.py - Intelligent Agents
```
Claim Submission
        ↓
Risk Assessment (0.0 - 1.0 score)
        ↓
├─ Low Risk (< 0.3) → Auto-approve
├─ Medium Risk (0.3 - 0.7) → Approve with monitoring
└─ High Risk (> 0.7) → Manual review or reject
        ↓
Multi-layer Audit
        ↓
Severity-based Clawback
```

### test_full_system.py - Verification
```
✅ Low risk claim processing
✅ Medium risk with monitoring
✅ Clawback mechanism
✅ Manual review escalation
✅ Blockchain integrity
✅ Smart contract logic
```

## 🎓 Understanding the Output

### Key Indicators

**✓ VERIFIED** - Document hash matches blockchain registry
**Risk Score: 0.25** - Low risk (0.0 = no risk, 1.0 = maximum risk)
**Confidence: 95%** - Agent's confidence in decision
**⚠ ANOMALY** - Audit detected suspicious pattern
**Clawback Amount: ₹36,000** - Funds being recovered

### Agent Decision Flow

1. **Cryptographic Verification** - Checks document hashes
2. **Risk Assessment** - Calculates risk score (0.0-1.0)
3. **Policy Compliance** - Validates against rules
4. **Decision Synthesis** - Makes final decision with confidence

## 🔧 Configuration

Edit `config.py` to customize:

```python
MAX_CLAIM_AMOUNT = 500000              # Maximum allowed
AUTO_APPROVAL_THRESHOLD = 50000        # Instant approval limit
REQUIRED_DOCUMENTS = [                 # Must have these
    "hospital_bill", 
    "discharge_summary"
]
```

## 📁 Project Structure

```
.
├── main.py                    # Basic demo (start here)
├── demo_advanced.py           # Advanced agent demo
├── test_full_system.py        # Automated tests
├── api_server.py              # REST API server
├── test_api.py                # API tests
│
├── agents.py                  # Basic agents
├── advanced_agents.py         # Intelligent agents with reasoning
├── blockchain_layer.py        # Blockchain simulation
├── document_processor.py      # Document handling
├── smart_contract.sol         # Solidity reference
└── config.py                  # Configuration
```

## 🐛 Troubleshooting

### "Module not found" error
```bash
pip install -r requirements.txt
```

### Port 5000 already in use (API server)
Edit `api_server.py` and change:
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Use 5001 instead
```

### Tests failing
Make sure you're running from the project root directory:
```bash
cd path/to/healthcare-settlement-platform
python test_full_system.py
```

## 🎯 Next Steps

1. ✅ Run `python test_full_system.py` to verify installation
2. ✅ Run `python main.py` to see basic flow
3. ✅ Run `python demo_advanced.py` to see intelligent agents
4. ✅ Start `python api_server.py` and test API integration
5. 📖 Read `README.md` for detailed architecture
6. 🔧 Modify `config.py` to experiment with different thresholds
7. 🚀 Deploy to production blockchain (see README.md)

## 💡 Key Features Demonstrated

- ✅ **Cryptographic Hash Storage** - SHA-256 hashing with blockchain registry
- ✅ **AI Agent Decision Making** - Risk assessment and confidence scoring
- ✅ **Straight-Through Processing** - Instant payments for valid claims
- ✅ **Multi-Layer Auditing** - Timeline, authenticity, and cost analysis
- ✅ **Automated Clawback** - Severity-based fund recovery
- ✅ **Agent Memory** - Context tracking and learning
- ✅ **REST API** - HTTP endpoints for integration
- ✅ **Smart Contracts** - Automated payment execution

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review `README.md` for detailed documentation
3. Run `python test_full_system.py` to diagnose issues

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Tests show "6/6 tests passed"
- ✅ Demos run without errors
- ✅ API server responds to health checks
- ✅ You see blockchain state updates
- ✅ Agents make decisions with confidence scores

---

**Ready to revolutionize healthcare administration!** 🚀
