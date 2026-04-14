import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs'
import ProductProfitability from '../components/products/ProductProfitability'
import ProductPricing from '../components/products/ProductPricing'
import ExpenseManagement from '../components/products/ExpenseManagement'
import { TrendingUp, CheckCircle2, AlertCircle, Clock, TrendingDown } from 'lucide-react'

export default function ProductEconomics() {
  return (
    <div className="space-y-4">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-nt-forest">Product Economics & Cost Management</h1>
          <p className="text-xs mt-1 text-gray-600">
            Product P&L, pricing optimization, unit economics, and expense management
          </p>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg shadow-md" style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0.04) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.25)'
        }}>
          <TrendingDown className="h-5 w-5 text-nt-gold" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-gray-600">Cost/Income</div>
            <div className="flex items-baseline gap-1.5">
              <div className="text-lg font-bold text-nt-gold">62.5%</div>
              <div className="text-[10px] font-semibold text-green-600">-0.8%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="executive-summary">
        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="p-1.5 rounded-lg bg-nt-gold bg-opacity-20">
            <TrendingUp className="h-5 w-5 text-nt-gold" />
          </div>
          <h2 className="text-base font-bold text-nt-forest">Executive Summary</h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-xs text-nt-forest">Product Performance</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• Custody & Admin: $2.85B revenue, 11.2% RAROC</li>
              <li>• Fund Services: $1.25B revenue, 10.8% RAROC</li>
              <li>• Securities Lending: $485M (+12% YoY)</li>
              <li>• 73% of revenue from top 3 products</li>
            </ul>
          </div>

          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="font-semibold text-xs text-nt-forest">Pricing Opportunities</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• 32 clients priced below market benchmarks</li>
              <li>• $45M revenue opportunity from repricing</li>
              <li>• Investment Mgmt below 10% hurdle rate</li>
              <li>• Fee compression in custody (-2bps YoY)</li>
            </ul>
          </div>

          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-xs text-nt-forest">Cost Actions</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• Target $638M cost savings through automation</li>
              <li>• Efficiency ratio: 60.1% → 58.5% target</li>
              <li>• Consolidate vendor spend ($485M opportunity)</li>
              <li>• Offshore non-client facing roles (15% reduction)</li>
            </ul>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profitability">
        <TabsList>
          <TabsTrigger value="profitability">Product P&L</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Value Capture</TabsTrigger>
          <TabsTrigger value="expenses">Expense Management</TabsTrigger>
        </TabsList>

        <TabsContent value="profitability">
          <ProductProfitability />
        </TabsContent>

        <TabsContent value="pricing">
          <ProductPricing />
        </TabsContent>

        <TabsContent value="expenses">
          <ExpenseManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
