// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title HealthcareClaimSettlement
 * @dev Smart contract for automated healthcare insurance claim processing
 * 
 * This contract demonstrates:
 * - Document hash registry for immutability
 * - Automated claim approval and payment
 * - Clawback mechanism for fraudulent claims
 */
contract HealthcareClaimSettlement {
    
    // Enums
    enum ClaimStatus { 
        Pending, 
        Approved, 
        Paid, 
        UnderReview, 
        Rejected, 
        ClawbackInitiated 
    }
    
    // Structs
    struct DocumentRecord {
        bytes32 documentHash;
        string documentType;
        uint256 timestamp;
        bool exists;
    }
    
    struct Claim {
        string claimId;
        address patient;
        uint256 amount;
        string[] documentIds;
        ClaimStatus status;
        uint256 createdAt;
        uint256 paidAmount;
        uint256 clawbackAmount;
        address approver;
        address auditor;
        string clawbackReason;
    }
    
    // State variables
    mapping(string => DocumentRecord) public documentRegistry;
    mapping(string => Claim) public claims;
    mapping(address => uint256) public escrowBalances;
    
    address public insurerAddress;
    uint256 public autoApprovalThreshold = 50000 * 10**18; // 50,000 INR in wei equivalent
    
    // Events
    event DocumentHashStored(string indexed documentId, bytes32 documentHash, uint256 timestamp);
    event ClaimCreated(string indexed claimId, address indexed patient, uint256 amount);
    event ClaimApproved(string indexed claimId, address indexed approver, uint256 amount);
    event PaymentExecuted(string indexed claimId, address indexed patient, uint256 amount);
    event ClawbackInitiated(string indexed claimId, uint256 clawbackAmount, string reason);
    
    // Modifiers
    modifier onlyInsurer() {
        require(msg.sender == insurerAddress, "Only insurer can call this");
        _;
    }
    
    modifier claimExists(string memory claimId) {
        require(bytes(claims[claimId].claimId).length > 0, "Claim does not exist");
        _;
    }
    
    // Constructor
    constructor() {
        insurerAddress = msg.sender;
        escrowBalances[insurerAddress] = 10000000 * 10**18; // 10M INR initial escrow
    }
    
    /**
     * @dev Store document hash on-chain for immutability
     */
    function storeDocumentHash(
        string memory documentId,
        bytes32 documentHash,
        string memory documentType
    ) public returns (bool) {
        require(!documentRegistry[documentId].exists, "Document already registered");
        
        documentRegistry[documentId] = DocumentRecord({
            documentHash: documentHash,
            documentType: documentType,
            timestamp: block.timestamp,
            exists: true
        });
        
        emit DocumentHashStored(documentId, documentHash, block.timestamp);
        return true;
    }
    
    /**
     * @dev Verify document hash against registry
     */
    function verifyDocumentHash(
        string memory documentId,
        bytes32 providedHash
    ) public view returns (bool) {
        require(documentRegistry[documentId].exists, "Document not found in registry");
        return documentRegistry[documentId].documentHash == providedHash;
    }
    
    /**
     * @dev Create a new claim
     */
    function createClaim(
        string memory claimId,
        address patient,
        uint256 amount,
        string[] memory documentIds
    ) public returns (bool) {
        require(bytes(claims[claimId].claimId).length == 0, "Claim already exists");
        
        claims[claimId] = Claim({
            claimId: claimId,
            patient: patient,
            amount: amount,
            documentIds: documentIds,
            status: ClaimStatus.Pending,
            createdAt: block.timestamp,
            paidAmount: 0,
            clawbackAmount: 0,
            approver: address(0),
            auditor: address(0),
            clawbackReason: ""
        });
        
        emit ClaimCreated(claimId, patient, amount);
        return true;
    }
    
    /**
     * @dev Approve and pay claim (straight-through processing)
     */
    function approveAndPay(
        string memory claimId
    ) public onlyInsurer claimExists(claimId) returns (bool) {
        Claim storage claim = claims[claimId];
        
        require(claim.status == ClaimStatus.Pending, "Claim not in pending status");
        require(escrowBalances[insurerAddress] >= claim.amount, "Insufficient escrow balance");
        
        // Update claim status
        claim.status = ClaimStatus.Paid;
        claim.paidAmount = claim.amount;
        claim.approver = msg.sender;
        
        // Execute payment
        escrowBalances[insurerAddress] -= claim.amount;
        escrowBalances[claim.patient] += claim.amount;
        
        emit ClaimApproved(claimId, msg.sender, claim.amount);
        emit PaymentExecuted(claimId, claim.patient, claim.amount);
        
        return true;
    }
    
    /**
     * @dev Initiate clawback for fraudulent/erroneous claims
     */
    function initiateClawback(
        string memory claimId,
        uint256 clawbackAmount,
        string memory reason
    ) public onlyInsurer claimExists(claimId) returns (bool) {
        Claim storage claim = claims[claimId];
        
        require(claim.status == ClaimStatus.Paid, "Can only clawback paid claims");
        require(clawbackAmount <= claim.paidAmount, "Clawback exceeds paid amount");
        
        // Update claim status
        claim.status = ClaimStatus.ClawbackInitiated;
        claim.clawbackAmount = clawbackAmount;
        claim.clawbackReason = reason;
        claim.auditor = msg.sender;
        
        // Execute clawback
        require(escrowBalances[claim.patient] >= clawbackAmount, "Insufficient patient balance");
        escrowBalances[claim.patient] -= clawbackAmount;
        escrowBalances[insurerAddress] += clawbackAmount;
        
        emit ClawbackInitiated(claimId, clawbackAmount, reason);
        
        return true;
    }
    
    /**
     * @dev Get claim details
     */
    function getClaimStatus(string memory claimId) 
        public 
        view 
        claimExists(claimId) 
        returns (
            address patient,
            uint256 amount,
            ClaimStatus status,
            uint256 paidAmount,
            uint256 clawbackAmount
        ) 
    {
        Claim storage claim = claims[claimId];
        return (
            claim.patient,
            claim.amount,
            claim.status,
            claim.paidAmount,
            claim.clawbackAmount
        );
    }
    
    /**
     * @dev Get document record
     */
    function getDocumentRecord(string memory documentId)
        public
        view
        returns (
            bytes32 documentHash,
            string memory documentType,
            uint256 timestamp,
            bool exists
        )
    {
        DocumentRecord storage doc = documentRegistry[documentId];
        return (
            doc.documentHash,
            doc.documentType,
            doc.timestamp,
            doc.exists
        );
    }
}
