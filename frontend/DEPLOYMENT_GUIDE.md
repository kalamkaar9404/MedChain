# HealthClaim Platform - Deployment Guide

## Project Overview

The Healthcare Settlement Platform (HealthClaim) is a complete Next.js 16 application featuring AI-powered claim processing, blockchain integration, and real-time fraud detection.

## Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

The application will be available at `http://localhost:3000`

## Architecture

### Core Tech Stack
- **Framework**: Next.js 16 with App Router
- **UI Library**: shadcn/ui with Tailwind CSS v4
- **State Management**: React hooks + SWR for data fetching
- **Charts**: Recharts for analytics visualizations
- **Styling**: Tailwind CSS with custom design tokens
- **Type Safety**: TypeScript with strict mode

### Directory Structure

```
/app                          # Next.js app router pages
  /patient/dashboard         # Patient submission portal
  /patient/claims/[id]       # Individual claim details
  /insurer/dashboard         # Insurer processing portal
  /auditor/dashboard         # Audit and review portal
  /auditor/audit/[id]        # Audit details view
  /blockchain                # Blockchain explorer
  /status                    # System status dashboard
  /demo                      # Interactive demo
  /page.tsx                  # Landing page

/components                   # React components
  /layout                    # Header, Footer
  /claims                    # ClaimForm, ClaimsList
  /analytics                 # Charts, metrics, calculations
  /blockchain                # Blockchain components
  /audit                     # Audit-specific components
  /verification              # Document verification
  /home                      # Landing page sections
  /ui                        # Reusable UI components

/hooks                        # Custom React hooks
  useApi.ts                  # API request wrapper
  useClaims.ts               # Claims data management
  useBlockchain.ts           # Blockchain state
  usePolling.ts              # Real-time polling logic

/lib
  types.ts                   # TypeScript interfaces
  constants.ts               # Application constants
  api.ts                     # API client with endpoints
  utils.ts                   # Utility functions

/styles
  globals.css                # Tailwind imports + design tokens
```

## Key Features Implemented

### 1. Patient Dashboard (`/patient/dashboard`)
- Submit insurance claims with document uploads
- Real-time claim status tracking
- View claim history and details
- Form validation with error handling

### 2. Insurer Dashboard (`/insurer/dashboard`)
- View all submitted claims with filtering
- Analytics dashboard showing claim statistics
- Risk assessment and scoring
- Approval/rejection workflow
- Real-time updates via polling

### 3. Auditor Dashboard (`/auditor/dashboard`)
- Review high-risk claims
- Detect anomalies and suspicious patterns
- Audit trail and document verification
- Clawback calculations for fraudulent claims

### 4. Blockchain Explorer (`/blockchain`)
- View immutable claim transaction history
- Search by transaction hash or claim ID
- Visual transaction timeline
- Proof of authenticity verification

### 5. System Status (`/status`)
- Real-time system health metrics
- API endpoint status
- Database connectivity status
- Performance monitoring

### 6. Demo Page (`/demo`)
- Interactive showcase of all features
- Mock data generation
- Component demonstration

## API Integration

The platform integrates with a Flask backend providing these endpoints:

```
POST   /api/claims/submit          - Submit new claim
GET    /api/claims/list            - Get claims list
GET    /api/claims/{id}            - Get claim details
POST   /api/verify/document        - Verify document
GET    /api/blockchain/state       - Get blockchain state
GET    /api/blockchain/claim/{id}  - Get claim blockchain record
GET    /api/agent/state            - Get AI agent state
GET    /api/system/status          - Get system status
```

Configure the API base URL in `lib/constants.ts`:

```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
```

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NODE_ENV=development
```

## Real-time Updates

The application uses polling to fetch updates with a default interval of 3 seconds. Configure in `lib/constants.ts`:

```typescript
export const POLLING_INTERVAL_MS = 3000 // milliseconds
```

## Design System

### Colors
- **Primary**: Slate-900 (#0f172a)
- **Accent**: Blue-500 (#3b82f6)
- **Success**: Green-600 (#16a34a)
- **Warning**: Yellow-500 (#eab308)
- **Danger**: Red-600 (#dc2626)
- **Info**: Blue-500 (#3b82f6)

### Typography
- **Headings**: Geist font family
- **Body**: Geist font family
- **Mono**: Geist Mono for code

### Layout
- **Desktop**: Multi-column grid layouts
- **Tablet**: 2-column layouts
- **Mobile**: Single column with full width

## Performance Considerations

1. **Code Splitting**: Automatic via Next.js
2. **Image Optimization**: Using `unoptimized: true` for dev
3. **CSS Optimization**: Tailwind CSS purge in production
4. **Data Fetching**: Polling with configurable intervals
5. **Caching**: SWR provides automatic caching and revalidation

## Testing

The application includes a demo page for testing all features:

1. Navigate to `/demo`
2. View all dashboard sections
3. Test form submissions
4. Verify real-time updates
5. Check blockchain explorer

## Security Considerations

- **CORS**: Configure for your deployment domain
- **API Authentication**: Add auth headers in `lib/api.ts`
- **HTTPS**: Enable in production
- **Input Validation**: Implemented in forms and API calls
- **XSS Protection**: React's built-in escaping + Tailwind CSS

## Deployment to Vercel

1. Push code to GitHub repository
2. Import project in Vercel dashboard
3. Set environment variables in project settings
4. Click Deploy
5. Configure custom domain if needed

### Environment Variables for Vercel
```
NEXT_PUBLIC_API_URL = https://your-api-domain.com
```

## Troubleshooting

### Dev server won't start
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
pnpm install

# Restart server
pnpm dev
```

### Styling not loading
- Clear browser cache
- Check Tailwind CSS config
- Verify globals.css imports

### API connection issues
- Check API_BASE_URL in constants
- Verify backend is running
- Check CORS configuration
- Verify network requests in browser DevTools

### Real-time updates not working
- Check polling interval in constants
- Verify API endpoints are responding
- Check browser console for errors
- Increase polling interval if CPU usage high

## Additional Documentation

- See `README.md` for feature overview
- See `BUILD_SUMMARY.md` for implementation details
- See `v0_plans/light-strategy.md` for architecture decisions

## Support

For issues or questions:
1. Check the demo page at `/demo`
2. Review component files in `/components`
3. Check TypeScript types in `lib/types.ts`
4. Verify API integration in `lib/api.ts`
