# CFO KPI Dashboard

A comprehensive dashboard application designed for CFOs and senior finance executives, providing real-time insights into financial performance, operational efficiency, assets under custody, and risk metrics.

## Features

### Dashboard Sections

1. **Executive Summary** - High-level KPIs and alerts
2. **Group Financials** - P&L, balance sheet, capital, liquidity, NII/NIM
3. **Business Economics** - Segment P&L, ROE & SVA, variance analysis
4. **Client Economics** - RAROC, wallet share, relationship health, profit attribution
5. **Product Economics** - Product P&L, pricing, expense management
6. **Finance Operations** - Daily pulse, custody & settlement, treasury ops, month-end close
7. **ALM & Treasury** - Interest rate risk, liquidity, funding, hedging
8. **Planning & Strategy** - Initiatives, scenario builder, driver trees, stress tests
9. **External Positioning** - Peer scoreboard, competitive dynamics, performance trends
10. **Risk & Compliance** - Risk metrics, appetite, compliance, regulatory oversight
11. **Workforce Analytics** - Headcount, compensation, productivity, attrition
12. **Forecast Performance** - Forecast accuracy, budget performance, bias analysis

### AI-Powered Analysis

- Natural language question interface powered by Claude
- Intelligent routing: questions are classified and either navigate to the relevant dashboard page or trigger custom analysis
- Custom analysis generates Python code, executive narrative, and SVG charts
- Conversation history for follow-up questions

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Routing**: React Router
- **Icons**: Lucide React
- **State Management**: Zustand
- **AI**: Claude (Anthropic API / AWS Bedrock)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3000`

### Environment Variables

Create a `.env` file:

```
ANTHROPIC_API_KEY=sk-ant-...   # For direct Anthropic API (Vercel deployment)
E2B_API_KEY=...                # For code execution sandbox
```

For local development with AWS Bedrock, omit `ANTHROPIC_API_KEY` and configure AWS credentials instead.

### Multi-Client Support

The dashboard supports multiple client configurations. The default client (Acme Bank) is included in the repo. Additional client configs can be added in `src/config/clients.private.ts` (gitignored) using the `registerClient()` API:

```typescript
import { registerClient, type ClientConfig } from './clientConfig'

const MY_CLIENT: ClientConfig = { /* ... */ }
registerClient(MY_CLIENT)
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

Proprietary
