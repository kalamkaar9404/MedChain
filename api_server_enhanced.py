"""
Enhanced REST API server that matches the frontend expectations.
Provides complete integration between frontend and backend agents.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from blockchain_layer import BlockchainRegistry, SmartContract, ClaimStatus
from document_processor import DocumentProcessor
from agents import PatientAgent, InsurerAgent, AuditAgent
from advanced_agents import AdvancedInsurerAgent, AdvancedAuditAgent
import config
from datetime import datetime
import json
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

# In-memory storage for demo (in production, use a database)
claims_storage = {}
audit_records = []


def map_backend_status_to_frontend(backend_status: str) -> str:
    """Map backend status to frontend ClaimStatus enum."""
    status_mapping = {
        "pending": "SUBMITTED",
        "approved": "APPROVED",
        "paid": "PAID",
        "under_review": "UNDER_AUDIT",
        "rejected": "REJECTED",
        "clawback_initiated": "CLAWED_BACK"
    }
    return status_mapping.get(backend_status, "PROCESSING")


def format_claim_for_frontend(claim: dict, transactions: list = None) -> dict:
    """Format backend claim data for frontend consumption."""
    return {
        "id": claim["claim_id"],
        "claimId": claim["claim_id"],
        "patientId": claim["patient_id"],
        "amount": claim["amount"],
        "status": map_backend_status_to_frontend(claim["status"]),
        "submittedAt": claim.get("created_at", datetime.now().isoformat()),
        "updatedAt": claim.get("created_at", datetime.now().isoformat()),
        "documents": claim.get("document_ids", []),
        "riskScore": claim.get("risk_score"),
        "confidence": claim.get("confidence"),
        "paidAmount": claim.get("paid_amount", 0),
        "clawbackAmount": claim.get("clawback_amount", 0),
        "transactions": transactions or []
    }


# ============================================================================
# HEALTH & SYSTEM ENDPOINTS
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "success": True,
        "data": {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "blockchainBlocks": blockchain.block_number,
            "totalClaims": len(smart_contract.claims),
            "escrowBalance": smart_contract.escrow_balance,
            "version": "1.0.0"
        }
    })


@app.route('/api/agent/state', methods=['GET'])
def get_agent_state():
    """Get state of all agents."""
    return jsonify({
        "success": True,
        "data": {
            "insurerAgent": insurer_agent.get_agent_state(),
            "auditAgent": audit_agent.get_agent_state() if hasattr(audit_agent, 'get_agent_state') else {}
        }
    })


@app.route('/api/system/metrics', methods=['GET'])
def get_system_metrics():
    """Get system-wide metrics."""
    claims = list(smart_contract.claims.values())
    
    status_counts = {}
    for claim in claims:
        status = map_backend_status_to_frontend(claim["status"])
        status_counts[status] = status_counts.get(status, 0) + 1
    
    return jsonify({
        "success": True,
        "data": {
            "totalClaims": len(claims),
            "totalProcessed": len([c for c in claims if c["status"] in ["paid", "rejected"]]),
            "totalPaid": sum(c["paid_amount"] for c in claims),
            "averageProcessingTime": "< 1 second",
            "autoApprovalRate": 0.7,
            "fraudDetectionRate": 0.15,
            "statusBreakdown": status_counts
        }
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
        claim_id = data.get('claimId') or f"CLAIM_{uuid.uuid4().hex[:8].upper()}"
        patient_id = data.get('patientId', 'patient_001')
        
        # Process documents
        documents = []
        total_amount = 0
        
        for doc_data in data.get('documents', []):
            doc = {
                "document_type": doc_data.get('type', 'hospital_bill'),
                "patient_id": patient_id,
                "admission_date": doc_data.get('admissionDate', datetime.now().isoformat()),
                "discharge_date": doc_data.get('dischargeDate', datetime.now().isoformat()),
                "total_amount": doc_data.get('amount', 0),
                "has_signature": doc_data.get('hasSignature', True),
                "has_stamp": doc_data.get('hasStamp', True),
                "hospital_name": doc_data.get('hospitalName', 'Hospital'),
                "file_name": doc_data.get('fileName', 'document.pdf')
            }
            documents.append(doc)
            total_amount += doc.get('total_amount', 0)
        
        # Submit claim through patient agent
        claim = patient_agent.submit_claim(claim_id, documents, smart_contract)
        
        # Store in memory
        claims_storage[claim_id] = {
            **claim,
            "documents_data": documents
        }
        
        formatted_claim = format_claim_for_frontend(claim)
        
        return jsonify({
            "success": True,
            "data": formatted_claim,
            "message": "Claim submitted successfully"
        }), 201
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/claims', methods=['GET'])
def get_claims():
    """Get all claims or filter by patient ID."""
    try:
        patient_id = request.args.get('patient_id')
        
        claims = list(smart_contract.claims.values())
        
        if patient_id:
            claims = [c for c in claims if c.get("patient_id") == patient_id]
        
        formatted_claims = [format_claim_for_frontend(c) for c in claims]
        
        return jsonify({
            "success": True,
            "data": {
                "claims": formatted_claims,
                "total": len(formatted_claims)
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/claims/<claim_id>', methods=['GET'])
def get_claim_details(claim_id):
    """Get detailed claim information."""
    try:
        claim = smart_contract.get_claim_status(claim_id)
        
        if not claim:
            return jsonify({
                "success": False,
                "error": "Claim not found"
            }), 404
        
        transactions = smart_contract.get_transaction_history(claim_id)
        
        # Get stored documents data
        stored_claim = claims_storage.get(claim_id, {})
        documents_data = stored_claim.get("documents_data", [])
        
        formatted_claim = format_claim_for_frontend(claim, transactions)
        formatted_claim["documentsData"] = documents_data
        
        return jsonify({
            "success": True,
            "data": formatted_claim
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/claims/<claim_id>/status', methods=['GET'])
def get_claim_status(claim_id):
    """Get claim status."""
    try:
        claim = smart_contract.get_claim_status(claim_id)
        
        if not claim:
            return jsonify({
                "success": False,
                "error": "Claim not found"
            }), 404
        
        return jsonify({
            "success": True,
            "data": {
                "status": map_backend_status_to_frontend(claim["status"])
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ============================================================================
# INSURER ENDPOINTS
# ============================================================================

@app.route('/api/insurer/pending-claims', methods=['GET'])
def get_pending_claims():
    """Get claims pending verification."""
    try:
        claims = list(smart_contract.claims.values())
        pending = [c for c in claims if c["status"] == "pending"]
        
        formatted_claims = [format_claim_for_frontend(c) for c in pending]
        
        return jsonify({
            "success": True,
            "data": {
                "claims": formatted_claims,
                "total": len(formatted_claims)
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/claims/<claim_id>/verify', methods=['POST'])
def verify_claim(claim_id):
    """Verify and process a claim using AI agent."""
    try:
        # Get stored documents
        stored_claim = claims_storage.get(claim_id)
        if not stored_claim:
            return jsonify({
                "success": False,
                "error": "Claim not found in storage"
            }), 404
        
        documents = stored_claim.get("documents_data", [])
        
        # Use advanced insurer agent for decision
        result = insurer_agent.make_decision(claim_id, smart_contract, documents)
        
        # Get updated claim
        claim = smart_contract.get_claim_status(claim_id)
        transactions = smart_contract.get_transaction_history(claim_id)
        
        formatted_claim = format_claim_for_frontend(claim, transactions)
        formatted_claim["verificationResult"] = result
        
        return jsonify({
            "success": True,
            "data": formatted_claim,
            "message": f"Claim {result['status']}"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/claims/<claim_id>/approve', methods=['POST'])
def approve_claim(claim_id):
    """Manually approve a claim."""
    try:
        transaction = smart_contract.approve_and_pay(claim_id, insurer_agent.agent_id)
        
        claim = smart_contract.get_claim_status(claim_id)
        formatted_claim = format_claim_for_frontend(claim)
        
        return jsonify({
            "success": True,
            "data": formatted_claim,
            "message": "Claim approved and paid"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/claims/<claim_id>/reject', methods=['POST'])
def reject_claim(claim_id):
    """Reject a claim."""
    try:
        data = request.json
        reason = data.get('reason', 'Claim rejected by insurer')
        
        # Update claim status (in production, add reject method to smart contract)
        claim = smart_contract.get_claim_status(claim_id)
        if claim:
            claim["status"] = "rejected"
            claim["rejection_reason"] = reason
        
        formatted_claim = format_claim_for_frontend(claim)
        
        return jsonify({
            "success": True,
            "data": formatted_claim,
            "message": "Claim rejected"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/claims/<claim_id>/manual-review', methods=['POST'])
def request_manual_review(claim_id):
    """Flag claim for manual review."""
    try:
        claim = smart_contract.get_claim_status(claim_id)
        if claim:
            claim["status"] = "under_review"
            claim["flagged_for_review"] = True
        
        formatted_claim = format_claim_for_frontend(claim)
        
        return jsonify({
            "success": True,
            "data": formatted_claim,
            "message": "Claim flagged for manual review"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/insurer/stats', methods=['GET'])
def get_insurer_stats():
    """Get insurer dashboard statistics."""
    try:
        claims = list(smart_contract.claims.values())
        
        total_claims = len(claims)
        approved_claims = len([c for c in claims if c["status"] in ["approved", "paid"]])
        rejected_claims = len([c for c in claims if c["status"] == "rejected"])
        pending_claims = len([c for c in claims if c["status"] == "pending"])
        
        total_paid = sum(c.get("paid_amount", 0) for c in claims)
        
        return jsonify({
            "success": True,
            "data": {
                "totalClaims": total_claims,
                "approvedClaims": approved_claims,
                "rejectedClaims": rejected_claims,
                "pendingClaims": pending_claims,
                "totalPaid": total_paid,
                "autoApprovalRate": approved_claims / total_claims if total_claims > 0 else 0,
                "averageProcessingTime": "< 1 second",
                "escrowBalance": smart_contract.escrow_balance
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ============================================================================
# AUDITOR ENDPOINTS
# ============================================================================

@app.route('/api/auditor/queue', methods=['GET'])
def get_audit_queue():
    """Get claims requiring audit."""
    try:
        claims = list(smart_contract.claims.values())
        audit_queue = [c for c in claims if c["status"] in ["paid", "approved"]]
        
        formatted_claims = [format_claim_for_frontend(c) for c in audit_queue]
        
        return jsonify({
            "success": True,
            "data": formatted_claims
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/auditor/anomalies', methods=['GET'])
def get_anomalies():
    """Get detected anomalies."""
    try:
        # Return anomalies from audit records
        anomalies = []
        for record in audit_records:
            if record.get("anomalies"):
                anomalies.extend(record["anomalies"])
        
        return jsonify({
            "success": True,
            "data": anomalies
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/claims/<claim_id>/audit', methods=['POST'])
def audit_claim(claim_id):
    """Perform deep audit on a claim."""
    try:
        # Get stored documents
        stored_claim = claims_storage.get(claim_id)
        if not stored_claim:
            return jsonify({
                "success": False,
                "error": "Claim not found"
            }), 404
        
        documents = stored_claim.get("documents_data", [])
        
        # Perform audit
        audit_result = audit_agent.deep_audit(claim_id, smart_contract, documents)
        
        # Store audit record
        audit_record = {
            "id": f"AUDIT_{uuid.uuid4().hex[:8].upper()}",
            "claimId": claim_id,
            "timestamp": datetime.now().isoformat(),
            "status": audit_result["status"],
            "anomalies": audit_result.get("anomalies", []),
            "severity": audit_result.get("severity", 0),
            "auditorId": audit_agent.agent_id
        }
        audit_records.append(audit_record)
        
        return jsonify({
            "success": True,
            "data": audit_record,
            "message": f"Audit completed: {audit_result['status']}"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/claims/<claim_id>/clawback', methods=['POST'])
def initiate_clawback(claim_id):
    """Initiate clawback for a claim."""
    try:
        data = request.json
        reason = data.get('reason', 'Fraud detected')
        amount = data.get('amount')
        
        claim = smart_contract.get_claim_status(claim_id)
        if not claim:
            return jsonify({
                "success": False,
                "error": "Claim not found"
            }), 404
        
        # Calculate clawback amount if not provided
        if not amount:
            amount = claim["paid_amount"] * 0.5  # Default 50%
        
        # Execute clawback
        transaction = smart_contract.initiate_clawback(
            claim_id,
            reason,
            amount,
            audit_agent.agent_id
        )
        
        # Update audit record
        audit_record = {
            "id": f"AUDIT_{uuid.uuid4().hex[:8].upper()}",
            "claimId": claim_id,
            "timestamp": datetime.now().isoformat(),
            "status": "clawback_initiated",
            "clawbackAmount": amount,
            "reason": reason,
            "transaction": transaction
        }
        audit_records.append(audit_record)
        
        return jsonify({
            "success": True,
            "data": audit_record,
            "message": f"Clawback initiated: ₹{amount:,.2f}"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/auditor/history', methods=['GET'])
def get_audit_history():
    """Get audit history."""
    try:
        return jsonify({
            "success": True,
            "data": audit_records
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ============================================================================
# BLOCKCHAIN ENDPOINTS
# ============================================================================

@app.route('/api/blockchain/state', methods=['GET'])
def get_blockchain_state():
    """Get current blockchain state."""
    try:
        return jsonify({
            "success": True,
            "data": {
                "blockNumber": blockchain.block_number,
                "registryEntries": len(blockchain.registry),
                "totalClaims": len(smart_contract.claims),
                "totalTransactions": len(smart_contract.transactions),
                "escrowBalance": smart_contract.escrow_balance
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/blockchain/blocks', methods=['GET'])
def get_blocks():
    """Get blockchain blocks."""
    try:
        blocks = []
        for doc_id, record in blockchain.registry.items():
            blocks.append({
                "blockNumber": record["block_number"],
                "documentId": doc_id,
                "hash": record["hash"],
                "timestamp": record["timestamp"],
                "metadata": record["metadata"]
            })
        
        return jsonify({
            "success": True,
            "data": {
                "blocks": sorted(blocks, key=lambda x: x["blockNumber"], reverse=True)
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/blockchain/transactions', methods=['GET'])
def get_transactions():
    """Get all transactions."""
    try:
        return jsonify({
            "success": True,
            "data": smart_contract.transactions
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/blockchain/verify-document', methods=['GET'])
def verify_document():
    """Verify a document hash."""
    try:
        document_id = request.args.get('document_id')
        
        if not document_id:
            return jsonify({
                "success": False,
                "error": "document_id is required"
            }), 400
        
        record = blockchain.get_document_record(document_id)
        
        if not record:
            return jsonify({
                "success": False,
                "error": "Document not found"
            }), 404
        
        return jsonify({
            "success": True,
            "data": {
                "verified": True,
                "hash": record["hash"],
                "timestamp": record["timestamp"],
                "blockNumber": record["block_number"]
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ============================================================================
# DEMO ENDPOINTS
# ============================================================================

@app.route('/api/demo/scenarios', methods=['GET'])
def get_demo_scenarios():
    """Get available demo scenarios."""
    scenarios = [
        {
            "id": "instant-payment",
            "name": "Instant Payment",
            "description": "Low-risk claim with instant approval and payment",
            "type": "instant_payment"
        },
        {
            "id": "clawback",
            "name": "Fraud Detection & Clawback",
            "description": "Claim with anomalies detected during audit",
            "type": "clawback"
        },
        {
            "id": "manual-review",
            "name": "Manual Review Required",
            "description": "High-risk claim requiring human review",
            "type": "manual_review"
        }
    ]
    
    return jsonify({
        "success": True,
        "data": scenarios
    })


@app.route('/api/demo/run-scenario', methods=['POST'])
def run_demo_scenario():
    """Run a demo scenario."""
    try:
        data = request.json
        scenario_id = data.get('scenario_id')
        
        if scenario_id == "instant-payment":
            # Create low-risk claim
            claim_id = f"DEMO_INSTANT_{uuid.uuid4().hex[:6].upper()}"
            documents = [
                {
                    "document_type": "hospital_bill",
                    "patient_id": "demo_patient",
                    "admission_date": datetime.now().isoformat(),
                    "discharge_date": datetime.now().isoformat(),
                    "total_amount": 25000,
                    "has_signature": True,
                    "has_stamp": True,
                    "hospital_name": "Demo Hospital"
                }
            ]
            
            # Submit and verify
            claim = patient_agent.submit_claim(claim_id, documents, smart_contract)
            claims_storage[claim_id] = {"documents_data": documents, **claim}
            result = insurer_agent.make_decision(claim_id, smart_contract, documents)
            
            return jsonify({
                "success": True,
                "data": {
                    "claimId": claim_id,
                    "result": result,
                    "message": "Instant payment demo completed"
                }
            })
        
        elif scenario_id == "clawback":
            # Create claim that will be clawed back
            claim_id = f"DEMO_CLAWBACK_{uuid.uuid4().hex[:6].upper()}"
            documents = [
                {
                    "document_type": "hospital_bill",
                    "patient_id": "demo_patient",
                    "admission_date": datetime.now().isoformat(),
                    "discharge_date": datetime.now().isoformat(),
                    "total_amount": 45000,
                    "has_signature": True,
                    "has_stamp": True,
                    "hospital_name": "Demo Hospital"
                }
            ]
            
            # Submit, verify, then audit with anomalous document
            claim = patient_agent.submit_claim(claim_id, documents, smart_contract)
            claims_storage[claim_id] = {"documents_data": documents, **claim}
            result = insurer_agent.make_decision(claim_id, smart_contract, documents)
            
            # Add anomalous document and audit
            anomalous_doc = doc_processor.create_anomalous_document()
            all_docs = documents + [anomalous_doc]
            audit_result = audit_agent.deep_audit(claim_id, smart_contract, all_docs)
            
            return jsonify({
                "success": True,
                "data": {
                    "claimId": claim_id,
                    "verificationResult": result,
                    "auditResult": audit_result,
                    "message": "Clawback demo completed"
                }
            })
        
        else:
            return jsonify({
                "success": False,
                "error": "Unknown scenario"
            }), 400
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == '__main__':
    import os
    
    # Get port from environment variable (for Railway/Render) or default to 5000
    port = int(os.environ.get('PORT', 5000))
    
    # Check if running in production
    is_production = os.environ.get('FLASK_ENV') == 'production'
    
    print("\n" + "="*70)
    print("ENHANCED HEALTHCARE SETTLEMENT PLATFORM - API SERVER")
    print("="*70)
    print("\nFrontend-Compatible API Endpoints:")
    print("\n  Patient Endpoints:")
    print("    POST   /api/claims/submit")
    print("    GET    /api/claims")
    print("    GET    /api/claims/<id>")
    print("    GET    /api/claims/<id>/status")
    print("\n  Insurer Endpoints:")
    print("    GET    /api/insurer/pending-claims")
    print("    POST   /api/claims/<id>/verify")
    print("    POST   /api/claims/<id>/approve")
    print("    POST   /api/claims/<id>/reject")
    print("    POST   /api/claims/<id>/manual-review")
    print("    GET    /api/insurer/stats")
    print("\n  Auditor Endpoints:")
    print("    GET    /api/auditor/queue")
    print("    GET    /api/auditor/anomalies")
    print("    POST   /api/claims/<id>/audit")
    print("    POST   /api/claims/<id>/clawback")
    print("    GET    /api/auditor/history")
    print("\n  Blockchain Endpoints:")
    print("    GET    /api/blockchain/state")
    print("    GET    /api/blockchain/blocks")
    print("    GET    /api/blockchain/transactions")
    print("    GET    /api/blockchain/verify-document")
    print("\n  System Endpoints:")
    print("    GET    /api/health")
    print("    GET    /api/agent/state")
    print("    GET    /api/system/metrics")
    print("\n  Demo Endpoints:")
    print("    GET    /api/demo/scenarios")
    print("    POST   /api/demo/run-scenario")
    print(f"\nEnvironment: {'Production' if is_production else 'Development'}")
    print(f"Starting server on port {port}")
    print("="*70 + "\n")
    
    # Run with appropriate settings
    app.run(
        debug=not is_production,
        host='0.0.0.0',
        port=port
    )
