"""
Fixed REST API server matching frontend expectations.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from blockchain_layer import BlockchainRegistry, SmartContract
from document_processor import DocumentProcessor
from agents import PatientAgent, InsurerAgent, AuditAgent
from advanced_agents import AdvancedInsurerAgent, AdvancedAuditAgent
import config
from datetime import datetime, timedelta
import random
import uuid

app = Flask(__name__)
CORS(app)

# Initialize blockchain infrastructure
blockchain = BlockchainRegistry()
smart_contract = SmartContract(blockchain)
doc_processor = DocumentProcessor()

# Initialize agents
patient_agent = PatientAgent(config.PATIENT_AGENT_ID, blockchain)
insurer_agent = AdvancedInsurerAgent(config.INSURER_AGENT_ID, blockchain)
audit_agent = AdvancedAuditAgent(config.AUDIT_AGENT_ID, blockchain)

# In-memory storage for demo (replace with database in production)
claims_db = {}
anomalies_db = []


# ============================================================================
# HEALTH & SYSTEM ENDPOINTS
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "blockchain_blocks": blockchain.block_number,
        "total_claims": len(claims_db),
        "escrow_balance": smart_contract.escrow_balance,
        "agents": {
            "patient": "active",
            "insurer": "active",
            "auditor": "active"
        }
    })


@app.route('/api/agent/state', methods=['GET'])
def get_agent_state():
    """Get state of all agents."""
    return jsonify({
        "insurer": insurer_agent.get_agent_state(),
        "auditor": audit_agent.get_agent_state() if hasattr(audit_agent, 'get_agent_state') else {
            "agent_id": audit_agent.agent_id,
            "status": "active"
        }
    })


@app.route('/api/system/metrics', methods=['GET'])
def get_system_metrics():
    """Get system metrics."""
    total = len(claims_db)
    approved = sum(1 for c in claims_db.values() if c['status'] in ['APPROVED', 'PAID'])
    rejected = sum(1 for c in claims_db.values() if c['status'] == 'REJECTED')
    pending = sum(1 for c in claims_db.values() if c['status'] in ['SUBMITTED', 'PROCESSING', 'PENDING_APPROVAL'])
    
    return jsonify({
        "total_claims": total,
        "approved_claims": approved,
        "rejected_claims": rejected,
        "pending_claims": pending,
        "total_amount_processed": sum(c['amount'] for c in claims_db.values()),
        "blockchain_blocks": blockchain.block_number,
        "anomalies_detected": len(anomalies_db)
    })


# ============================================================================
# PATIENT ENDPOINTS
# ============================================================================

@app.route('/api/claims/submit', methods=['POST'])
def submit_claim():
    """Submit a new claim."""
    try:
        data = request.json
        
        # Generate claim ID if not provided
        claim_id = data.get('claim_id', f"CLM_{uuid.uuid4().hex[:8].upper()}")
        
        # Extract data
        patient_id = data.get('patient_id', 'patient_001')
        amount = data.get('amount', 0)
        reason = data.get('reason', '')
        admission_date = data.get('admission_date', datetime.now().isoformat())
        discharge_date = data.get('discharge_date', datetime.now().isoformat())
        document_hashes = data.get('document_hashes', [])
        document_types = data.get('document_types', [])
        signature_verified = data.get('signature_verified', True)
        stamp_verified = data.get('stamp_verified', True)
        
        # Create documents for agent processing
        documents = []
        for i, (doc_hash, doc_type) in enumerate(zip(document_hashes, document_types)):
            documents.append({
                "document_type": doc_type.lower().replace('_', ' '),
                "total_amount": amount if i == 0 else 0,
                "has_signature": signature_verified,
                "has_stamp": stamp_verified,
                "admission_date": admission_date,
                "discharge_date": discharge_date
            })
        
        # Submit through agent
        claim = patient_agent.submit_claim(claim_id, documents, smart_contract)
        
        # Store in database
        claims_db[claim_id] = {
            "id": claim_id,
            "patient_id": patient_id,
            "amount": amount,
            "status": "SUBMITTED",
            "submission_date": datetime.now().isoformat(),
            "admission_date": admission_date,
            "discharge_date": discharge_date,
            "risk_score": 0.0,
            "documents": [
                {
                    "id": f"{claim_id}_doc_{i}",
                    "claim_id": claim_id,
                    "type": doc_type,
                    "hash": doc_hash,
                    "verified": False,
                    "upload_timestamp": datetime.now().isoformat(),
                    "file_name": f"{doc_type.lower()}.pdf"
                }
                for i, (doc_hash, doc_type) in enumerate(zip(document_hashes, document_types))
            ],
            "reason": reason,
            "signature_verified": signature_verified,
            "stamp_verified": stamp_verified,
            "updated_at": datetime.now().isoformat()
        }
        
        # Auto-process the claim
        process_claim_automatically(claim_id, documents)
        
        return jsonify({
            "success": True,
            "claim": claims_db[claim_id]
        }), 201
        
    except Exception as e:
        print(f"Error submitting claim: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/claims', methods=['GET'])
def get_claims():
    """Get all claims or filter by patient_id."""
    try:
        patient_id = request.args.get('patient_id')
        
        # Filter claims
        if patient_id:
            filtered_claims = [c for c in claims_db.values() if c['patient_id'] == patient_id]
        else:
            filtered_claims = list(claims_db.values())
        
        # Sort by submission date (newest first)
        filtered_claims.sort(key=lambda x: x['submission_date'], reverse=True)
        
        # Calculate stats
        total = len(filtered_claims)
        processed = sum(1 for c in filtered_claims if c['status'] in ['APPROVED', 'PAID', 'REJECTED'])
        pending = sum(1 for c in filtered_claims if c['status'] in ['SUBMITTED', 'PROCESSING', 'PENDING_APPROVAL'])
        
        return jsonify({
            "claims": filtered_claims,
            "total": total,
            "processed": processed,
            "pending": pending
        })
        
    except Exception as e:
        print(f"Error getting claims: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/claims/<claim_id>', methods=['GET'])
def get_claim_details(claim_id):
    """Get detailed claim information."""
    try:
        if claim_id not in claims_db:
            return jsonify({"error": "Claim not found"}), 404
        
        claim = claims_db[claim_id]
        
        # Get transaction history from smart contract
        transactions = smart_contract.get_transaction_history(claim_id)
        
        return jsonify({
            **claim,
            "transactions": transactions
        })
        
    except Exception as e:
        print(f"Error getting claim details: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/claims/<claim_id>/status', methods=['GET'])
def get_claim_status(claim_id):
    """Get claim status."""
    try:
        if claim_id not in claims_db:
            return jsonify({"error": "Claim not found"}), 404
        
        claim = claims_db[claim_id]
        
        return jsonify({
            "id": claim_id,
            "status": claim['status'],
            "updated_at": claim['updated_at']
        })
        
    except Exception as e:
        print(f"Error getting claim status: {e}")
        return jsonify({"error": str(e)}), 500


# ============================================================================
# INSURER ENDPOINTS
# ============================================================================

@app.route('/api/insurer/pending-claims', methods=['GET'])
def get_pending_claims():
    """Get claims pending insurer review."""
    try:
        pending = [
            c for c in claims_db.values() 
            if c['status'] in ['SUBMITTED', 'PROCESSING', 'PENDING_APPROVAL', 'MANUAL_REVIEW']
        ]
        
        pending.sort(key=lambda x: x['submission_date'], reverse=True)
        
        return jsonify({
            "claims": pending,
            "total": len(pending)
        })
        
    except Exception as e:
        print(f"Error getting pending claims: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/insurer/stats', methods=['GET'])
def get_insurer_stats():
    """Get insurer dashboard statistics."""
    try:
        total = len(claims_db)
        pending = sum(1 for c in claims_db.values() if c['status'] in ['SUBMITTED', 'PROCESSING', 'PENDING_APPROVAL'])
        approved = sum(1 for c in claims_db.values() if c['status'] in ['APPROVED', 'PAID'])
        rejected = sum(1 for c in claims_db.values() if c['status'] == 'REJECTED')
        under_audit = sum(1 for c in claims_db.values() if c['status'] == 'UNDER_AUDIT')
        
        total_amount = sum(c['amount'] for c in claims_db.values())
        approved_amount = sum(c['amount'] for c in claims_db.values() if c['status'] in ['APPROVED', 'PAID'])
        
        return jsonify({
            "total_claims": total,
            "pending_claims": pending,
            "approved_claims": approved,
            "rejected_claims": rejected,
            "under_audit": under_audit,
            "total_amount": total_amount,
            "approved_amount": approved_amount,
            "approval_rate": (approved / total * 100) if total > 0 else 0
        })
        
    except Exception as e:
        print(f"Error getting insurer stats: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/claims/<claim_id>/verify', methods=['POST'])
def verify_claim(claim_id):
    """Verify a claim."""
    try:
        if claim_id not in claims_db:
            return jsonify({"error": "Claim not found"}), 404
        
        claims_db[claim_id]['status'] = 'VERIFIED'
        claims_db[claim_id]['updated_at'] = datetime.now().isoformat()
        
        # Mark documents as verified
        for doc in claims_db[claim_id]['documents']:
            doc['verified'] = True
        
        return jsonify({
            "success": True,
            "claim": claims_db[claim_id]
        })
        
    except Exception as e:
        print(f"Error verifying claim: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/claims/<claim_id>/approve', methods=['POST'])
def approve_claim(claim_id):
    """Approve a claim."""
    try:
        if claim_id not in claims_db:
            return jsonify({"error": "Claim not found"}), 404
        
        claims_db[claim_id]['status'] = 'APPROVED'
        claims_db[claim_id]['updated_at'] = datetime.now().isoformat()
        
        return jsonify({
            "success": True,
            "claim": claims_db[claim_id]
        })
        
    except Exception as e:
        print(f"Error approving claim: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/claims/<claim_id>/reject', methods=['POST'])
def reject_claim(claim_id):
    """Reject a claim."""
    try:
        if claim_id not in claims_db:
            return jsonify({"error": "Claim not found"}), 404
        
        data = request.json or {}
        reason = data.get('reason', 'Claim rejected by insurer')
        
        claims_db[claim_id]['status'] = 'REJECTED'
        claims_db[claim_id]['rejection_reason'] = reason
        claims_db[claim_id]['updated_at'] = datetime.now().isoformat()
        
        return jsonify({
            "success": True,
            "claim": claims_db[claim_id]
        })
        
    except Exception as e:
        print(f"Error rejecting claim: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/claims/<claim_id>/manual-review', methods=['POST'])
def request_manual_review(claim_id):
    """Request manual review for a claim."""
    try:
        if claim_id not in claims_db:
            return jsonify({"error": "Claim not found"}), 404
        
        claims_db[claim_id]['status'] = 'MANUAL_REVIEW'
        claims_db[claim_id]['updated_at'] = datetime.now().isoformat()
        
        return jsonify({
            "success": True,
            "claim": claims_db[claim_id]
        })
        
    except Exception as e:
        print(f"Error requesting manual review: {e}")
        return jsonify({"error": str(e)}), 500


# ============================================================================
# AUDITOR ENDPOINTS
# ============================================================================

@app.route('/api/auditor/queue', methods=['GET'])
def get_audit_queue():
    """Get claims in audit queue."""
    try:
        audit_queue = [
            c for c in claims_db.values() 
            if c['status'] in ['APPROVED', 'PAID', 'UNDER_AUDIT']
        ]
        
        audit_queue.sort(key=lambda x: x['updated_at'], reverse=True)
        
        return jsonify({
            "claims": audit_queue,
            "total": len(audit_queue)
        })
        
    except Exception as e:
        print(f"Error getting audit queue: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/auditor/anomalies', methods=['GET'])
def get_anomalies():
    """Get detected anomalies."""
    try:
        return jsonify({
            "anomalies": anomalies_db,
            "total": len(anomalies_db)
        })
        
    except Exception as e:
        print(f"Error getting anomalies: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/claims/<claim_id>/audit', methods=['POST'])
def audit_claim(claim_id):
    """Audit a claim."""
    try:
        if claim_id not in claims_db:
            return jsonify({"error": "Claim not found"}), 404
        
        claims_db[claim_id]['status'] = 'UNDER_AUDIT'
        claims_db[claim_id]['updated_at'] = datetime.now().isoformat()
        
        # Simulate audit result
        audit_result = {
            "claim_id": claim_id,
            "audit_date": datetime.now().isoformat(),
            "auditor_id": audit_agent.agent_id,
            "findings": "No anomalies detected",
            "risk_score": claims_db[claim_id]['risk_score'],
            "recommendation": "APPROVE"
        }
        
        return jsonify({
            "success": True,
            "audit_result": audit_result
        })
        
    except Exception as e:
        print(f"Error auditing claim: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/claims/<claim_id>/clawback', methods=['POST'])
def clawback_claim(claim_id):
    """Initiate clawback for a claim."""
    try:
        if claim_id not in claims_db:
            return jsonify({"error": "Claim not found"}), 404
        
        data = request.json or {}
        reason = data.get('reason', 'Fraud detected')
        amount = data.get('amount', claims_db[claim_id]['amount'])
        
        claims_db[claim_id]['status'] = 'CLAWED_BACK'
        claims_db[claim_id]['clawback_reason'] = reason
        claims_db[claim_id]['clawback_amount'] = amount
        claims_db[claim_id]['updated_at'] = datetime.now().isoformat()
        
        return jsonify({
            "success": True,
            "claim": claims_db[claim_id]
        })
        
    except Exception as e:
        print(f"Error initiating clawback: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/auditor/history', methods=['GET'])
def get_audit_history():
    """Get audit history."""
    try:
        audited_claims = [
            c for c in claims_db.values() 
            if c['status'] in ['UNDER_AUDIT', 'CLAWED_BACK']
        ]
        
        audited_claims.sort(key=lambda x: x['updated_at'], reverse=True)
        
        return jsonify({
            "audits": audited_claims,
            "total": len(audited_claims)
        })
        
    except Exception as e:
        print(f"Error getting audit history: {e}")
        return jsonify({"error": str(e)}), 500


# ============================================================================
# BLOCKCHAIN ENDPOINTS
# ============================================================================

@app.route('/api/blockchain/state', methods=['GET'])
def get_blockchain_state():
    """Get blockchain state."""
    try:
        return jsonify({
            "block_number": blockchain.block_number,
            "total_documents": len(blockchain.registry),
            "total_claims": len(claims_db),
            "total_transactions": len(smart_contract.transactions),
            "escrow_balance": smart_contract.escrow_balance
        })
        
    except Exception as e:
        print(f"Error getting blockchain state: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/blockchain/blocks', methods=['GET'])
def get_blocks():
    """Get blockchain blocks."""
    try:
        # Simulate blocks
        blocks = []
        for i in range(min(10, blockchain.block_number)):
            blocks.append({
                "number": blockchain.block_number - i,
                "timestamp": (datetime.now() - timedelta(minutes=i*10)).isoformat(),
                "transactions": random.randint(1, 5),
                "hash": f"0x{uuid.uuid4().hex}"
            })
        
        return jsonify({
            "blocks": blocks,
            "total": blockchain.block_number
        })
        
    except Exception as e:
        print(f"Error getting blocks: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/blockchain/transactions', methods=['GET'])
def get_transactions():
    """Get blockchain transactions."""
    try:
        transactions = smart_contract.transactions[-50:]  # Last 50 transactions
        transactions.reverse()
        
        return jsonify({
            "transactions": transactions,
            "total": len(smart_contract.transactions)
        })
        
    except Exception as e:
        print(f"Error getting transactions: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/blockchain/verify-document', methods=['POST'])
def verify_document():
    """Verify a document hash."""
    try:
        data = request.json
        document_id = data.get('document_id')
        document_hash = data.get('document_hash')
        
        if not document_id or not document_hash:
            return jsonify({"error": "document_id and document_hash required"}), 400
        
        is_valid = blockchain.verify_hash(document_id, document_hash)
        record = blockchain.get_document_record(document_id)
        
        return jsonify({
            "valid": is_valid,
            "document_id": document_id,
            "record": record
        })
        
    except Exception as e:
        print(f"Error verifying document: {e}")
        return jsonify({"error": str(e)}), 500


# ============================================================================
# DEMO ENDPOINTS
# ============================================================================

@app.route('/api/demo/scenarios', methods=['GET'])
def get_demo_scenarios():
    """Get available demo scenarios."""
    return jsonify({
        "scenarios": [
            {
                "id": "instant_approval",
                "name": "Instant Approval",
                "description": "Small claim with all documents - instant approval"
            },
            {
                "id": "manual_review",
                "name": "Manual Review Required",
                "description": "High-value claim requiring manual review"
            },
            {
                "id": "fraud_detection",
                "name": "Fraud Detection",
                "description": "Claim with anomalies triggering audit"
            }
        ]
    })


@app.route('/api/demo/run-scenario', methods=['POST'])
def run_demo_scenario():
    """Run a demo scenario."""
    try:
        data = request.json
        scenario_id = data.get('scenario_id', 'instant_approval')
        
        # Create demo claim based on scenario
        claim_id = f"DEMO_{uuid.uuid4().hex[:8].upper()}"
        
        if scenario_id == 'instant_approval':
            amount = 25000
            status = 'APPROVED'
        elif scenario_id == 'manual_review':
            amount = 150000
            status = 'MANUAL_REVIEW'
        else:  # fraud_detection
            amount = 75000
            status = 'UNDER_AUDIT'
        
        # Create demo claim
        demo_claim = {
            "id": claim_id,
            "patient_id": "demo_patient",
            "amount": amount,
            "status": status,
            "submission_date": datetime.now().isoformat(),
            "admission_date": (datetime.now() - timedelta(days=5)).isoformat(),
            "discharge_date": (datetime.now() - timedelta(days=2)).isoformat(),
            "risk_score": random.uniform(0.1, 0.9),
            "documents": [],
            "reason": f"Demo scenario: {scenario_id}",
            "signature_verified": True,
            "stamp_verified": True,
            "updated_at": datetime.now().isoformat()
        }
        
        claims_db[claim_id] = demo_claim
        
        return jsonify({
            "success": True,
            "claim": demo_claim
        })
        
    except Exception as e:
        print(f"Error running demo scenario: {e}")
        return jsonify({"error": str(e)}), 500


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def process_claim_automatically(claim_id, documents):
    """Automatically process a claim through the system."""
    try:
        # Verify and process through insurer agent
        result = insurer_agent.make_decision(claim_id, smart_contract, documents)
        
        # Update claim status based on decision
        if result['decision'] == 'AUTO_APPROVE':
            claims_db[claim_id]['status'] = 'APPROVED'
        elif result['decision'] == 'APPROVE_WITH_MONITORING':
            claims_db[claim_id]['status'] = 'APPROVED'
        elif result['decision'] == 'REQUIRE_MANUAL_REVIEW':
            claims_db[claim_id]['status'] = 'MANUAL_REVIEW'
        else:
            claims_db[claim_id]['status'] = 'PROCESSING'
        
        claims_db[claim_id]['risk_score'] = result.get('risk_score', 0.0)
        claims_db[claim_id]['updated_at'] = datetime.now().isoformat()
        
    except Exception as e:
        print(f"Error auto-processing claim {claim_id}: {e}")
        claims_db[claim_id]['status'] = 'PROCESSING'


# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    print("\n" + "="*70)
    print("HEALTHCARE SETTLEMENT PLATFORM - API SERVER")
    print("="*70)
    print("\nAll endpoints now match frontend expectations!")
    print("\nStarting server on http://localhost:5000")
    print("="*70 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
