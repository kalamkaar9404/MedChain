# Complete Frontend Development Prompt for Vercel v0

## Project Context

You are building a **complete, production-ready frontend** for an Agent-First Healthcare Settlement Platform. This is a real working system (not a mockup) that connects to a Python Flask backend API for automated insurance claim processing using AI agents and blockchain technology.

---

## 🎯 Project Overview

**Name**: Healthcare Settlement Platform Frontend  
**Tech Stack**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui  
**Deployment**: Vercel  
**Backend API**: Flask REST API (running on http://localhost:5000 or deployed URL)

**Core Purpose**: Enable patients, insurers, and auditors to interact with an AI-powered claim settlement system that processes insurance claims in seconds instead of weeks.

---

## 📋 Complete Feature Requirements

### 1. Landing Page (Public)

**Route**: `/`

**Components Needed**:
- Hero section with animated gradient background
- Value proposition: "Insurance Claims Settled in Seconds, Not Weeks"
- Key statistics cards:
  - "99.9% Faster Processing"
  - "70% Reduction in Manual Reviews"
  - "100% Automated Fraud Detection"
- Feature showcase with icons:
  - Cryptographic Document Integrity
  - AI-Powered Risk Assessment
  - Instant Settlements
  - Automated Fraud Detection
- How it works (3-step process with animations)
- CTA buttons: "Submit Claim" and "View Demo"
- Footer with links

**Design**: Modern, clean, healthcare-focused with blue/green color scheme

---

### 2. Patient Dashboard

**Route**: `/patient/dashboard`

**Features**:
- **Submit New Claim Form**:
  - Patient ID input
  - Document upload section (drag & drop or file picker)
  - Document type selector (Hospital Bill, Discharge Summary, etc.)
  - Amount input with currency formatting
  - Admission/Discharge date pickers
  - Signature verification checkbox
  - Hospital stamp verification checkbox
  - Submit button with loading state
  
- **My Claims List**:
  - Table/card view of all submitted claims
  - Columns: Claim ID, Amount, Status, Submission Date, Actions
  - Status badges with colors:
    - Pending (yellow)
    - Approved (green)
    - Paid (blue)
    - Under Review (orange)
    - Rejected (red)
    - Clawback Initiated (purple)
  - Filter by status
  - Search by claim ID
  - Sort by date/amount
  
- **Claim Details Modal**:
  - Full claim information
  - Document hashes with verification status
  - Transaction history timeline
  - Risk score visualization (if available)
  - Download receipt button

**Real-time Updates**: Use polling or WebSocket to show claim status changes

---

### 3. Insurer Dashboard

**Route**: `/insurer/dashboard`

**Features**:
- **Pending Claims Queue**:
  - List of claims awaiting verification
  - Priority sorting (high risk first)
  - Bulk actions (approve/reject multiple)
  
- **Claim Review Interface**:
  - Split view: Documents on left, Analysis on right
  - Document hash verification status
  - Risk assessment panel:
    - Risk score gauge (0.0-1.0)
    - Risk factors breakdown
    - Confidence percentage
    - AI reasoning display
  - Policy compliance checklist
  - Decision buttons:
    - Auto-Approve (green)
    - Approve with Monitoring (yellow)
    - Reject (red)
    - Request Manual Review (orange)
  
- **Analytics Dashboard**:
  - Total claims processed (today/week/month)
  - Auto-approval rate chart
  - Average processing time
  - Fraud detection rate
  - Escrow balance display
  - Claims by status (pie chart)
  - Processing timeline (line chart)
  
- **Agent Memory Viewer**:
  - Recent decisions made by AI agent
  - Observations logged
  - Decision confidence trends

---

### 4. Auditor Dashboard

**Route**: `/auditor/dashboard`

**Features**:
- **Audit Queue**:
  - Claims flagged for audit
  - Paid claims requiring routine review
  - High-risk claims with monitoring flag
  
- **Deep Audit Interface**:
  - Multi-layer analysis results:
    - Timeline Consistency (with visual timeline)
    - Document Authenticity (signature/stamp checks)
    - Cost Pattern Analysis (charts)
  - Anomaly detection results:
    - List of detected anomalies
    - Severity scores for each
    - Average severity calculation
  - Clawback calculator:
    - Severity-based amount calculation
    - Reason text area
    - Execute clawback button
  
- **Audit History**:
  - Past audits with outcomes
  - Clawback success rate
  - Fraud detection statistics

---

### 5. Blockchain Explorer

**Route**: `/blockchain`

**Features**:
- **Block Explorer**:
  - List of blocks with block number, timestamp, entries
  - Click to view block details
  
- **Document Registry**:
  - Search by document ID
  - View document hash
  - Verification status
  - Metadata display
  - Immutability indicator
  
- **Transaction History**:
  - All transactions (payments, clawbacks)
  - Filter by type
  - Transaction details modal
  - Visual flow diagram

---

### 6. Live Demo Page

**Route**: `/demo`

**Features**:
- **Interactive Demo**:
  - Step-by-step walkthrough
  - Pre-filled sample data
  - "Run Scenario" buttons:
    - Scenario 1: Instant Payment
    - Scenario 2: Clawback
    - Scenario 3: Manual Review
  - Real-time processing visualization
  - Animated flow diagram
  - Results display with explanations

---

### 7. System Status Page

**Route**: `/status`

**Features**:
- **Health Check Display**:
  - API status (green/red indicator)
  - Blockchain status
  - Agent status
  - Last updated timestamp
  
- **System Metrics**:
  - Total blocks
  - Total claims
  - Total transactions
  - Escrow balance
  - Uptime percentage
  
- **Performance Metrics**:
  - Average response time
  - Claims per second
  - Success rate

---

## 🎨 Design System Requirements

### Color Palette
```css
Primary: #2563eb (Blue)
Secondary: #10b981 (Green)
Accent: #f59e0b (Amber)
Error: #ef4444 (Red)
Warning: #f97316 (Orange)
Success: #22c55e (Green)
Background: #f8fafc (Light Gray)
Surface: #ffffff (White)
Text Primary: #1e293b (Dark Gray)
Text Secondary: #64748b (Medium Gray)
```

### Typography
- Headings: Inter or Poppins (bold, 600-700 weight)
- Body: Inter or System UI (regular, 400 weight)
- Monospace: JetBrains Mono (for hashes, IDs)

### Components to Use (shadcn/ui)
- Button
- Card
- Badge
- Table
- Dialog/Modal
- Form
- Input
- Select
- Tabs
- Progress
- Alert
- Skeleton (loading states)
- Toast (notifications)
- Dropdown Menu
- Calendar (date picker)
- Chart (recharts)

### Animations
- Smooth transitions (200-300ms)
- Loading spinners for async operations
- Skeleton loaders for data fetching
- Success/error animations
- Progress bars for multi-step processes

---

## 🔌 API Integration

### Base URL
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
```

### API Endpoints to Integrate

#### 1. Health Check
```typescript
GET /health
Response: {
  status: "healthy",
  timestamp: string,
  blockchain_blocks: number,
  total_claims: number,
  escrow_balance: number
}
```

#### 2. Submit Claim
```typescript
POST /api/v1/claims
Body: {
  claim_id: string,
  documents: Array<{
    document_type: string,
    total_amount?: number,
    has_signature: boolean,
    has_stamp: boolean,
    admission_date: string,
    discharge_date: string,
    // ... other fields
  }>
}
Response: {
  success: boolean,
  claim_id: string,
  status: string,
  amount: number,
  document_count: number,
  created_at: string
}
```

#### 3. Verify Claim
```typescript
POST /api/v1/claims/{claim_id}/verify
Body: {
  documents: Array<Document>
}
Response: {
  success: boolean,
  claim_id: string,
  result: {
    status: string,
    risk_score?: number,
    confidence?: number,
    reasoning?: string,
    transaction?: Transaction
  }
}
```

#### 4. Audit Claim
```typescript
POST /api/v1/claims/{claim_id}/audit
Body: {
  documents: Array<Document>
}
Response: {
  success: boolean,
  claim_id: string,
  audit_result: {
    status: string,
    anomalies: Array<Anomaly>,
    severity?: number,
    transaction?: Transaction
  }
}
```

#### 5. Get Claim Status
```typescript
GET /api/v1/claims/{claim_id}
Response: {
  success: boolean,
  claim: Claim,
  transactions: Array<Transaction>
}
```

#### 6. Get Blockchain State
```typescript
GET /api/v1/blockchain/state
Response: {
  success: boolean,
  block_number: number,
  registry_entries: number,
  total_claims: number,
  total_transactions: number,
  escrow_balance: number
}
```

#### 7. Verify Document Hash
```typescript
POST /api/v1/documents/{document_id}/verify
Body: {
  document_data: object
}
Response: {
  success: boolean,
  document_id: string,
  is_valid: boolean,
  provided_hash: string,
  stored_record: DocumentRecord
}
```

#### 8. Get Agent State
```typescript
GET /api/v1/agents/state
Response: {
  success: boolean,
  insurer_agent: AgentState,
  audit_agent: AgentState
}
```

---

## 📱 Responsive Design Requirements

### Breakpoints
- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+

### Mobile-First Approach
- Stack cards vertically on mobile
- Hamburger menu for navigation
- Bottom navigation bar for main actions
- Swipeable cards for claims list
- Touch-friendly buttons (min 44px height)

### Tablet Optimizations
- Two-column layouts
- Side drawer navigation
- Larger touch targets

### Desktop Features
- Multi-column layouts
- Hover states
- Keyboard shortcuts
- Advanced filtering/sorting

---

## 🔐 Security & Validation

### Input Validation
- Claim ID: Alphanumeric, max 50 chars
- Amount: Positive number, max 500000
- Dates: Valid date range, discharge after admission
- Document types: Whitelist of allowed types

### Error Handling
- Network errors: Retry with exponential backoff
- API errors: Display user-friendly messages
- Validation errors: Inline field errors
- Global error boundary for crashes

### Data Privacy
- No sensitive data in localStorage
- Mask patient IDs in public views
- Secure API communication (HTTPS in production)

---

## 🎭 User Experience Requirements

### Loading States
- Skeleton loaders for initial data fetch
- Inline spinners for button actions
- Progress bars for multi-step processes
- Optimistic UI updates where possible

### Success/Error Feedback
- Toast notifications for actions
- Success animations (checkmark, confetti)
- Error messages with retry options
- Confirmation dialogs for destructive actions

### Accessibility (WCAG 2.1 AA)
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Color contrast ratios
- Screen reader support

---

## 📊 Data Visualization Requirements

### Charts Needed

1. **Risk Score Gauge** (Insurer Dashboard)
   - Semi-circular gauge
   - Color-coded: Green (0-0.3), Yellow (0.3-0.7), Red (0.7-1.0)
   - Animated needle

2. **Claims by Status** (Analytics)
   - Pie chart or donut chart
   - Color-coded by status
   - Hover tooltips with counts

3. **Processing Timeline** (Analytics)
   - Line chart showing claims over time
   - Multiple series (submitted, approved, rejected)
   - Date range selector

4. **Severity Distribution** (Auditor Dashboard)
   - Bar chart of anomaly severities
   - Threshold line at 0.6

5. **Transaction Flow** (Blockchain Explorer)
   - Sankey diagram or flow chart
   - From patient → escrow → clawback

---

## 🧩 Component Structure

### Suggested File Structure
```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── patient/
│   │   └── dashboard/
│   │       └── page.tsx            # Patient dashboard
│   ├── insurer/
│   │   └── dashboard/
│   │       └── page.tsx            # Insurer dashboard
│   ├── auditor/
│   │   └── dashboard/
│   │       └── page.tsx            # Auditor dashboard
│   ├── blockchain/
│   │   └── page.tsx                # Blockchain explorer
│   ├── demo/
│   │   └── page.tsx                # Live demo
│   └── status/
│       └── page.tsx                # System status
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── Navigation.tsx
│   ├── claims/
│   │   ├── ClaimCard.tsx
│   │   ├── ClaimForm.tsx
│   │   ├── ClaimDetails.tsx
│   │   ├── ClaimsList.tsx
│   │   └── ClaimStatusBadge.tsx
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   ├── RiskGauge.tsx
│   │   ├── AnalyticsChart.tsx
│   │   └── RecentActivity.tsx
│   ├── blockchain/
│   │   ├── BlockCard.tsx
│   │   ├── TransactionList.tsx
│   │   └── DocumentRegistry.tsx
│   ├── audit/
│   │   ├── AnomalyCard.tsx
│   │   ├── AuditTimeline.tsx
│   │   └── ClawbackCalculator.tsx
│   └── demo/
│       ├── ScenarioCard.tsx
│       ├── FlowDiagram.tsx
│       └── ResultsDisplay.tsx
├── lib/
│   ├── api.ts                      # API client functions
│   ├── types.ts                    # TypeScript types
│   ├── utils.ts                    # Utility functions
│   └── constants.ts                # Constants
├── hooks/
│   ├── useApi.ts                   # API hook
│   ├── useClaims.ts                # Claims data hook
│   ├── useBlockchain.ts            # Blockchain data hook
│   └── usePolling.ts               # Polling hook
└── styles/
    └── globals.css                 # Global styles
```

---

## 🔧 Technical Implementation Details

### TypeScript Types

```typescript
// types.ts

export interface Claim {
  claim_id: string;
  patient_id: string;
  amount: number;
  document_ids: string[];
  status: ClaimStatus;
  created_at: string;
  paid_amount: number;
  clawback_amount: number;
  risk_score?: number;
  confidence?: number;
}

export enum ClaimStatus {
  PENDING = "pending",
  APPROVED = "approved",
  PAID = "paid",
  UNDER_REVIEW = "under_review",
  REJECTED = "rejected",
  CLAWBACK_INITIATED = "clawback_initiated"
}

export interface Document {
  document_type: string;
  hospital_name?: string;
  patient_id: string;
  admission_date: string;
  discharge_date: string;
  total_amount?: number;
  has_signature: boolean;
  has_stamp?: boolean;
  [key: string]: any;
}

export interface Transaction {
  tx_id: string;
  type: "payment" | "clawback";
  claim_id: string;
  amount: number;
  timestamp: string;
  reason?: string;
}

export interface Anomaly {
  anomaly_detected: boolean;
  type: string;
  description: string;
  severity: number;
}

export interface BlockchainState {
  block_number: number;
  registry_entries: number;
  total_claims: number;
  total_transactions: number;
  escrow_balance: number;
}

export interface AgentState {
  agent_id: string;
  decisions_made: number;
  observations: number;
  recent_context: string;
}
```

### API Client Example

```typescript
// lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function submitClaim(claimData: {
  claim_id: string;
  documents: Document[];
}): Promise<ApiResponse<Claim>> {
  const response = await fetch(`${API_BASE_URL}/api/v1/claims`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(claimData)
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  
  return response.json();
}

export async function verifyClaim(
  claimId: string,
  documents: Document[]
): Promise<ApiResponse<VerificationResult>> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/claims/${claimId}/verify`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documents })
    }
  );
  
  return response.json();
}

export async function getClaimStatus(
  claimId: string
): Promise<ApiResponse<{ claim: Claim; transactions: Transaction[] }>> {
  const response = await fetch(`${API_BASE_URL}/api/v1/claims/${claimId}`);
  return response.json();
}

export async function getBlockchainState(): Promise<ApiResponse<BlockchainState>> {
  const response = await fetch(`${API_BASE_URL}/api/v1/blockchain/state`);
  return response.json();
}

export async function getHealthCheck(): Promise<ApiResponse<HealthStatus>> {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
}
```

### Custom Hooks Example

```typescript
// hooks/useClaims.ts

export function useClaims() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchClaims = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/claims`);
      const data = await response.json();
      setClaims(data.claims || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchClaims();
  }, []);
  
  return { claims, loading, error, refetch: fetchClaims };
}
```

---

## 🎨 Example Component Implementations

### ClaimStatusBadge Component

```typescript
// components/claims/ClaimStatusBadge.tsx

import { Badge } from "@/components/ui/badge";
import { ClaimStatus } from "@/lib/types";

const statusConfig = {
  [ClaimStatus.PENDING]: { label: "Pending", color: "bg-yellow-500" },
  [ClaimStatus.APPROVED]: { label: "Approved", color: "bg-green-500" },
  [ClaimStatus.PAID]: { label: "Paid", color: "bg-blue-500" },
  [ClaimStatus.UNDER_REVIEW]: { label: "Under Review", color: "bg-orange-500" },
  [ClaimStatus.REJECTED]: { label: "Rejected", color: "bg-red-500" },
  [ClaimStatus.CLAWBACK_INITIATED]: { label: "Clawback", color: "bg-purple-500" }
};

export function ClaimStatusBadge({ status }: { status: ClaimStatus }) {
  const config = statusConfig[status];
  
  return (
    <Badge className={`${config.color} text-white`}>
      {config.label}
    </Badge>
  );
}
```

### RiskGauge Component

```typescript
// components/dashboard/RiskGauge.tsx

import { Progress } from "@/components/ui/progress";

export function RiskGauge({ score }: { score: number }) {
  const percentage = score * 100;
  const color = score < 0.3 ? "bg-green-500" : 
                score < 0.7 ? "bg-yellow-500" : "bg-red-500";
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium">Risk Score</span>
        <span className="text-sm font-bold">{score.toFixed(2)}</span>
      </div>
      <Progress value={percentage} className={color} />
      <div className="flex justify-between text-xs text-gray-500">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
    </div>
  );
}
```

---

## 🚀 Deployment Configuration

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Healthcare Settlement Platform
NEXT_PUBLIC_ENABLE_DEMO=true
```

### Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url"
  }
}
```

---

## ✅ Acceptance Criteria

The frontend is complete when:

1. ✅ All 7 pages are implemented and functional
2. ✅ All API endpoints are integrated
3. ✅ Real-time data updates work (polling or WebSocket)
4. ✅ All charts and visualizations render correctly
5. ✅ Responsive design works on mobile, tablet, desktop
6. ✅ Loading states and error handling are comprehensive
7. ✅ Accessibility standards are met (WCAG 2.1 AA)
8. ✅ TypeScript types are complete with no `any` types
9. ✅ All forms have validation
10. ✅ Success/error feedback is clear and helpful
11. ✅ Navigation is intuitive
12. ✅ Performance is optimized (Lighthouse score > 90)
13. ✅ Code is well-organized and documented
14. ✅ Deploys successfully to Vercel
15. ✅ Works with the Python backend API

---

## 🎯 Priority Order

### Phase 1 (MVP - Week 1)
1. Landing page
2. Patient dashboard (submit claim + view claims)
3. Basic API integration
4. Claim status display

### Phase 2 (Core Features - Week 2)
5. Insurer dashboard (review interface)
6. Risk assessment visualization
7. Blockchain explorer
8. System status page

### Phase 3 (Advanced - Week 3)
9. Auditor dashboard
10. Analytics charts
11. Live demo page
12. Real-time updates

### Phase 4 (Polish - Week 4)
13. Animations and transitions
14. Mobile optimization
15. Accessibility improvements
16. Performance optimization

---

## 📝 Additional Notes

### Mock Data for Development
If backend is not available, create mock data that matches the API response structure for development.

### Testing
- Unit tests for utility functions
- Integration tests for API calls
- E2E tests for critical user flows

### Documentation
- Component documentation with Storybook
- API integration guide
- Deployment guide

---

## 🎨 Design Inspiration

Look at these for inspiration:
- Stripe Dashboard (clean, data-focused)
- Vercel Dashboard (modern, fast)
- Linear (smooth animations)
- Notion (intuitive UX)

---

## 🚀 Final Deliverables

1. Complete Next.js 14 application
2. All components implemented with shadcn/ui
3. Full TypeScript type coverage
4. Responsive design (mobile-first)
5. API integration with error handling
6. Deployed to Vercel
7. README with setup instructions
8. Environment variables documented

---

**This is a complete, production-ready frontend that connects to a real working backend. Build it with attention to detail, performance, and user experience.**

**Start with Phase 1 (MVP) and iterate from there. Good luck!** 🚀
