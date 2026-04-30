# HealthClaim - Healthcare Settlement Platform

A full-stack healthcare settlement platform with AI-powered claims processing, blockchain transparency, and fraud detection.

## 🚀 Project Overview

HealthClaim is an enterprise platform for managing healthcare insurance claims with:

- **Patient Portal**: Submit and track insurance claims
- **Insurer Dashboard**: Review and approve/reject claims with AI-powered risk assessment
- **Auditor Dashboard**: Monitor suspicious claims and detect fraud patterns
- **Blockchain Explorer**: Track all transactions on immutable ledger
- **System Status**: Real-time monitoring of system health and agent state
- **Demo Center**: Run interactive scenarios to see the platform in action

## 📁 Project Structure

```
/app
  ├── /patient/dashboard          # Patient claim submission & tracking
  ├── /patient/claims/[id]        # Claim details page
  ├── /insurer/dashboard          # Insurer review dashboard
  ├── /auditor/dashboard          # Auditor fraud detection
  ├── /auditor/audit/[id]         # Detailed audit review
  ├── /blockchain                 # Blockchain explorer
  ├── /status                     # System status monitoring
  ├── /demo                       # Interactive demo scenarios
  ├── page.tsx                    # Landing page
  └── layout.tsx                  # Root layout with header/footer

/components
  ├── /layout
  │   ├── Header.tsx
  │   └── Footer.tsx
  ├── /ui
  │   ├── ClaimStatusBadge.tsx    # Status indicator badges
  │   ├── StatsCard.tsx           # KPI cards
  │   ├── RiskGauge.tsx           # Risk score visualization
  │   ├── VerificationBadge.tsx   # Verification status
  │   ├── LoadingState.tsx        # Skeleton loaders
  │   ├── SystemStatus.tsx        # Health indicators
  │   ├── FilterBar.tsx           # Filter controls
  │   └── ... (shadcn/ui components)
  ├── /claims
  │   ├── ClaimForm.tsx           # Claim submission form
  │   └── ClaimsList.tsx          # Claims list with filters
  ├── /analytics
  │   ├── AnalyticsCharts.tsx     # Claims analytics charts
  │   ├── TransactionList.tsx     # Transaction history
  │   ├── AnomalyCard.tsx         # Anomaly detection cards
  │   └── ClawbackCalculator.tsx  # Clawback calculations
  ├── /blockchain
  │   ├── TransactionCard.tsx     # Blockchain transactions
  │   └── ClaimDetail.tsx         # Collapsible claim details
  └── /verification
      ├── DocumentVerification.tsx # Document verification status
      └── VerificationFlow.tsx     # Multi-step verification flow

/hooks
  ├── useApi.ts                   # Generic API fetching
  ├── useClaims.ts                # Claims data management
  ├── useBlockchain.ts            # Blockchain data fetching
  └── usePolling.ts               # Real-time data polling

/lib
  ├── types.ts                    # TypeScript type definitions
  ├── api.ts                      # API client methods
  ├── utils.ts                    # Formatting & utility functions
  ├── constants.ts                # Color configs, status labels, etc.
  └── ...

/public                           # Static assets
```

## 🛠️ Technology Stack

- **Frontend Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: shadcn/ui v4
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Data Fetching**: Custom hooks with SWR patterns
- **Date Handling**: date-fns
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm package manager

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3000 in your browser
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📱 Pages Overview

### Patient Dashboard (`/patient/dashboard`)
- Submit new claims with form validation
- View all submitted claims
- Filter by status and search by claim ID
- Track risk scores and approval status

### Insurer Dashboard (`/insurer/dashboard`)
- View pending claims for review
- AI-powered risk scoring and flagging
- Analytics on claim patterns
- Approve/reject/audit actions

### Auditor Dashboard (`/auditor/dashboard`)
- Monitor suspicious claims
- View detected anomalies
- Analyze fraud indicators
- Clawback calculations
- Audit history and trends

### Blockchain Explorer (`/blockchain`)
- View immutable transaction ledger
- Search transactions by hash or claim ID
- Verify document hashes
- Monitor system settlement status

### System Status (`/status`)
- Real-time health checks
- API availability
- Agent state and message queues
- System uptime and performance metrics

### Demo Center (`/demo`)
- Interactive scenarios
- Run claim simulations
- See live processing
- Fraud detection examples

## 🎨 Design System

### Color Palette
- **Primary**: Slate (#0f172a)
- **Accent**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)
- **Status Specific**: Cyan, Orange, Purple, Emerald

### Typography
- **Headings**: Geist font family
- **Body**: Geist font family
- **Monospace**: Geist Mono (for transaction hashes)

## 📊 Key Features

### Real-Time Updates
- Polling-based data refreshing (configurable intervals)
- Automatic status updates
- Live analytics

### Data Validation
- Form validation with error messages
- Amount limits and constraints
- Date range validation

### Risk Assessment
- Visual risk gauges (0-100%)
- Risk score color coding
- Anomaly detection cards

### Document Management
- Multiple document type support
- Verification status tracking
- Upload tracking and hashing

### Comprehensive Analytics
- Claims processing charts
- Risk distribution analysis
- Approval rate trends
- Clawback tracking

## 🔌 API Integration

All components communicate with a Flask backend API:

- `/api/claims/*` - Claim management
- `/api/insurer/*` - Insurer operations
- `/api/auditor/*` - Auditor operations
- `/api/blockchain/*` - Blockchain queries
- `/api/health` - System health
- `/api/agent/state` - AI agent status

## 🎯 Development Guidelines

### Adding New Pages
1. Create folder in `/app`
2. Add `page.tsx` 
3. Import layout components
4. Use existing hooks for data fetching

### Creating New Components
1. Place in appropriate `/components` subdirectory
2. Add `'use client'` directive if interactive
3. Accept data via props
4. Use `cn()` utility for conditional classes

### Styling
- Use Tailwind utility classes
- Reference design tokens in `globals.css`
- Maintain consistent spacing (gap, p, m values)
- Keep components responsive (mobile-first)

## 📦 Building for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 📝 License

MIT

---

**Ready to deploy?** Use the Publish button in v0 to deploy to Vercel!
