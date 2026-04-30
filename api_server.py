"""
REST API server for the healthcare settlement platform.
Provides HTTP endpoints for integration with external systems.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from blockchain_layer import BlockchainRegistry, SmartContract
from document_processor import DocumentProcessor
from agents import PatientAgent, InsurerAgent, AuditAgent
from advanced_agents import AdvancedInsurerAgent, AdvancedAuditAgent
import config
from datetime import datetime
import json

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


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "blockchain_blocks": blockchain.block_number,
        "total_claims": len(smart_contract.claims),
        "escrow_balance": smart_contract.escrow_balance
    })


@app.route('/api/v1/claims', methods=['POST'])
def submit_claim():
    """
    Submit a new claim.
    
    Request body:
    {
        "claim_id": "CLAIM_001",
        "documents": [
            {
                "document_type": "hospital_bill",
                "total_amount": 45000,
                "has_signature": true,
                ...
            }
        ]
    }
    """
    try:
        data = request.json
        claim_id = data.get('claim_id')
        documents = data.get('documents', [])
        
        if not claim_id or not documents:
            return jsonify({"error": "claim_id and documents are required"}), 400
        
        # Submit claim
        claim = patient_agent.submit_claim(claim_id, documents, smart_contract)
        
        return jsonify({
            "success": True,
            "claim_id": claim_id,
            "status": claim["status"],
            "amount": claim["amount"],
            "document_count": len(documents),
            "created_at": claim["created_at"]
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/v1/claims/<claim_id>/verify', methods=['POST'])
def verify_claim(claim_id):
    """
    Verify and process a claim.
    
    Request body:
    {
        "documents": [...]  # Original documents for verification
    }
    """
    try:
        data = request.json
        documents = data.get('documents', [])
        
        if not documents:
            return jsonify({"error": "documents are required"}), 400
        
        # Verify and process
        result = insurer_agent.make_decision(claim_id, smart_contract, documents)
        
        return jsonify({
            "success": True,
            "claim_id": claim_id,
            "result": result
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/v1/claims/<claim_id>/audit', methods=['POST'])
def audit_claim(claim_id):
    """
    Audit a claim.
    
    Request body:
    {
        "documents": [...]  # All documents including follow-ups
    }
    """
    try:
        data = request.json
        documents = data.get('documents', [])
        
        if not documents:
            return jsonify({"error": "documents are required"}), 400
        
        # Perform audit
        result = audit_agent.deep_audit(claim_id, smart_contract, documents)
        
        return jsonify({
            "success": True,
            "claim_id": claim_id,
            "audit_result": result
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/v1/claims/<claim_id>', methods=['GET'])
def get_claim_status(claim_id):
    """Get claim status and details."""
    try:
        claim = smart_contract.get_claim_status(claim_id)
        
        if not claim:
            return jsonify({"error": "Claim not found"}), 404
        
        # Get transaction history
        transactions = smart_contract.get_transaction_history(claim_id)
        
        return jsonify({
            "success": True,
            "claim": claim,
            "transactions": transactions
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/v1/documents/<document_id>/verify', methods=['POST'])
def verify_document_hash(document_id):
    """
    Verify a document hash.
    
    Request body:
    {
        "document_data": {...}  # Document to verify
    }
    """
    try:
        data = request.json
        document_data = data.get('document_data')
        
        if not document_data:
            return jsonify({"error": "document_data is required"}), 400
        
        # Generate hash
        provided_hash = doc_processor.generate_document_hash(document_data)
        
        # Verify against blockchain
        is_valid = blockchain.verify_hash(document_id, provided_hash)
        
        # Get record
        record = blockchain.get_document_record(document_id)
        
        return jsonify({
            "success": True,
            "document_id": document_id,
            "is_valid": is_valid,
            "provided_hash": provided_hash,
            "stored_record": record
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/v1/blockchain/state', methods=['GET'])
def get_blockchain_state():
    """Get current blockchain state."""
    try:
        return jsonify({
            "success": True,
            "block_number": blockchain.block_number,
            "registry_entries": len(blockchain.registry),
            "total_claims": len(smart_contract.claims),
            "total_transactions": len(smart_contract.transactions),
            "escrow_balance": smart_contract.escrow_balance
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/v1/agents/state', methods=['GET'])
def get_agents_state():
    """Get state of all agents."""
    try:
        return jsonify({
            "success": True,
            "insurer_agent": insurer_agent.get_agent_state(),
            "audit_agent": audit_agent.get_agent_state() if hasattr(audit_agent, 'get_agent_state') else {}
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    print("\n" + "="*70)
    print("HEALTHCARE SETTLEMENT PLATFORM - API SERVER")
    print("="*70)
    print("\nAPI Endpoints:")
    print("  POST   /api/v1/claims                    - Submit new claim")
    print("  POST   /api/v1/claims/<id>/verify        - Verify and process claim")
    print("  POST   /api/v1/claims/<id>/audit         - Audit claim")
    print("  GET    /api/v1/claims/<id>               - Get claim status")
    print("  POST   /api/v1/documents/<id>/verify     - Verify document hash")
    print("  GET    /api/v1/blockchain/state          - Get blockchain state")
    print("  GET    /api/v1/agents/state              - Get agents state")
    print("  GET    /health                           - Health check")
    print("\nStarting server on http://localhost:5000")
    print("="*70 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
