import { BarChart, Bar, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ComposedChart } from 'recharts'

export default function ExpenseManagement() {
  // Unit cost trends over time
  const unitCostTrends = [
    { month: 'Jan', costPerTxn: 1.85, costPerAccount: 142, costPerClient: 28500 },
    { month: 'Feb', costPerTxn: 1.82, costPerAccount: 140, costPerClient: 28200 },
    { month: 'Mar', costPerTxn: 1.78, costPerAccount: 138, costPerClient: 27800 },
    { month: 'Apr', costPerTxn: 1.76, costPerAccount: 136, costPerClient: 27400 },
    { month: 'May', costPerTxn: 1.73, costPerAccount: 134, costPerClient: 27100 },
    { month: 'Jun', costPerTxn: 1.71, costPerAccount: 132, costPerClient: 26800 },
    { month: 'Jul', costPerTxn: 1.69, costPerAccount: 131, costPerClient: 26500 },
    { month: 'Aug', costPerTxn: 1.67, costPerAccount: 130, costPerClient: 26300 },
    { month: 'Sep', costPerTxn: 1.65, costPerAccount: 129, costPerClient: 26100 },
    { month: 'Oct', costPerTxn: 1.63, costPerAccount: 128, costPerClient: 25900 },
    { month: 'Nov', costPerTxn: 1.62, costPerAccount: 127, costPerClient: 25700 },
    { month: 'Dec', costPerTxn: 1.60, costPerAccount: 126, costPerClient: 25500 },
  ]

  // Vendor spend analysis
  const vendorSpend = [
    { vendor: 'Technology & Infrastructure', annual: 485, contracts: 42, avgDiscount: 8, consolidationOpp: 35, category: 'IT' },
    { vendor: 'Third Party Processors', annual: 342, contracts: 18, avgDiscount: 12, consolidationOpp: 28, category: 'Operations' },
    { vendor: 'Market Data & Analytics', annual: 278, contracts: 15, avgDiscount: 5, consolidationOpp: 15, category: 'IT' },
    { vendor: 'Professional Services', annual: 195, contracts: 67, avgDiscount: 15, consolidationOpp: 42, category: 'Corp' },
    { vendor: 'Compliance & Regulatory', annual: 156, contracts: 12, avgDiscount: 3, consolidationOpp: 8, category: 'Risk' },
    { vendor: 'Telecommunications', annual: 89, contracts: 8, avgDiscount: 18, consolidationOpp: 12, category: 'IT' },
    { vendor: 'Facilities & Real Estate', annual: 412, contracts: 35, avgDiscount: 10, consolidationOpp: 25, category: 'Corp' },
    { vendor: 'Marketing & Events', annual: 67, contracts: 28, avgDiscount: 22, consolidationOpp: 18, category: 'Corp' },
  ]

  // Efficiency initiatives
  const efficiencyInitiatives = [
    {
      initiative: 'STP Rate Improvement',
      status: 'In Progress',
      currentSTP: 87.5,
      targetSTP: 95.0,
      investmentMM: 25,
      annualSavingsMM: 82,
      paybackMonths: 3.7,
      impactArea: 'Operations',
      completionPct: 68
    },
    {
      initiative: 'Vendor Consolidation',
      status: 'Planning',
      currentVendors: 255,
      targetVendors: 180,
      investmentMM: 8,
      annualSavingsMM: 183,
      paybackMonths: 0.5,
      impactArea: 'Procurement',
      completionPct: 15
    },
    {
      initiative: 'Cloud Migration',
      status: 'In Progress',
      currentCloud: 35,
      targetCloud: 75,
      investmentMM: 120,
      annualSavingsMM: 95,
      paybackMonths: 15.2,
      impactArea: 'Technology',
      completionPct: 42
    },
    {
      initiative: 'Process Automation (RPA)',
      status: 'Executing',
      currentAuto: 22,
      targetAuto: 68,
      investmentMM: 35,
      annualSavingsMM: 125,
      paybackMonths: 3.4,
      impactArea: 'Operations',
      completionPct: 78
    },
    {
      initiative: 'Offshore Expansion',
      status: 'Executing',
      currentOffshore: 28,
      targetOffshore: 45,
      investmentMM: 18,
      annualSavingsMM: 68,
      paybackMonths: 3.2,
      impactArea: 'HR',
      completionPct: 85
    },
    {
      initiative: 'Real Estate Footprint',
      status: 'Planning',
      currentSqFt: 485000,
      targetSqFt: 340000,
      investmentMM: 42,
      annualSavingsMM: 85,
      paybackMonths: 5.9,
      impactArea: 'Facilities',
      completionPct: 12
    },
  ]

  // Unit economics benchmarking
  const unitEconBenchmark = [
    {
      metric: 'Cost per Transaction',
      ourCost: 1.60,
      peerAvg: 1.95,
      topQuartile: 1.45,
      unit: '$',
      variance: -18,
      rating: 'Strong'
    },
    {
      metric: 'Cost per Account',
      ourCost: 126,
      peerAvg: 148,
      topQuartile: 115,
      unit: '$',
      variance: -15,
      rating: 'Good'
    },
    {
      metric: 'Cost per Client',
      ourCost: 25500,
      peerAvg: 31200,
      topQuartile: 22800,
      unit: '$',
      variance: -18,
      rating: 'Strong'
    },
    {
      metric: 'Cost/Income Ratio',
      ourCost: 62.5,
      peerAvg: 68.2,
      topQuartile: 58.5,
      unit: '%',
      variance: -8,
      rating: 'Good'
    },
    {
      metric: 'Revenue per FTE',
      ourCost: 485,
      peerAvg: 425,
      topQuartile: 520,
      unit: '$K',
      variance: 14,
      rating: 'Good'
    },
    {
      metric: 'Tech Spend as % Revenue',
      ourCost: 9.2,
      peerAvg: 8.5,
      topQuartile: 7.8,
      unit: '%',
      variance: 8,
      rating: 'Watch'
    },
    {
      metric: 'Automation Rate',
      ourCost: 22,
      peerAvg: 32,
      topQuartile: 45,
      unit: '%',
      variance: -31,
      rating: 'Weak'
    },
  ]

  // Cost allocation by function
  const costAllocation = [
    { function: 'Operations', personnel: 425, technology: 158, facilities: 85, other: 65, total: 733 },
    { function: 'Technology', personnel: 298, technology: 245, facilities: 42, other: 38, total: 623 },
    { function: 'Client Service', personnel: 185, technology: 52, facilities: 38, other: 28, total: 303 },
    { function: 'Risk & Compliance', personnel: 142, technology: 68, facilities: 25, other: 22, total: 257 },
    { function: 'Product Management', personnel: 95, technology: 35, facilities: 18, other: 15, total: 163 },
    { function: 'Finance & Admin', personnel: 88, technology: 42, facilities: 22, other: 18, total: 170 },
    { function: 'Sales & Marketing', personnel: 125, technology: 28, facilities: 32, other: 25, total: 210 },
  ]

  // Zero-based budgeting opportunities
  const zbBudgetOpps = [
    { category: 'Discretionary Spending', current: 285, proposed: 198, savings: 87, confidence: 'High', initiatives: 12 },
    { category: 'Vendor Renegotiation', current: 1845, proposed: 1662, savings: 183, confidence: 'Medium', initiatives: 8 },
    { category: 'Process Reengineering', current: 733, proposed: 626, savings: 107, confidence: 'High', initiatives: 6 },
    { category: 'Technology Rationalization', current: 485, proposed: 412, savings: 73, confidence: 'Medium', initiatives: 15 },
    { category: 'Facilities Optimization', current: 412, proposed: 327, savings: 85, confidence: 'High', initiatives: 4 },
    { category: 'Organizational Design', current: 1358, proposed: 1290, savings: 68, confidence: 'Low', initiatives: 3 },
  ]

  const totalCurrentSpend = zbBudgetOpps.reduce((sum, item) => sum + item.current, 0)
  const totalProposedSpend = zbBudgetOpps.reduce((sum, item) => sum + item.proposed, 0)
  const totalSavings = totalCurrentSpend - totalProposedSpend

  const totalVendorSpend = vendorSpend.reduce((sum, v) => sum + v.annual, 0)
  const totalConsolidationOpp = vendorSpend.reduce((sum, v) => sum + v.consolidationOpp, 0)

  const totalInitiativeInvestment = efficiencyInitiatives.reduce((sum, i) => sum + i.investmentMM, 0)
  const totalInitiativeSavings = efficiencyInitiatives.reduce((sum, i) => sum + i.annualSavingsMM, 0)

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Executing': return '#10b981'
      case 'In Progress': return '#3b82f6'
      case 'Planning': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getRatingColor = (rating: string) => {
    switch(rating) {
      case 'Strong': return '#10b981'
      case 'Good': return '#3b82f6'
      case 'Watch': return '#f59e0b'
      case 'Weak': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getConfidenceColor = (confidence: string) => {
    switch(confidence) {
      case 'High': return '#10b981'
      case 'Medium': return '#f59e0b'
      case 'Low': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Cost per Transaction</div>
          <div className="text-2xl font-bold text-gray-900">$1.60</div>
          <div className="text-sm text-green-600">↓ 13.5% YoY</div>
          <div className="text-xs text-gray-500 mt-1">Target: $1.45 (-9%)</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Cost per Client</div>
          <div className="text-2xl font-bold text-gray-900">$25.5K</div>
          <div className="text-sm text-green-600">↓ 10.5% YoY</div>
          <div className="text-xs text-gray-500 mt-1">18% below peer avg</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Cost/Income Ratio</div>
          <div className="text-2xl font-bold text-gray-900">62.5%</div>
          <div className="text-sm text-green-600">↓ 3.2pp YoY</div>
          <div className="text-xs text-gray-500 mt-1">Target: 58.5% (top quartile)</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">ZBB Opportunity</div>
          <div className="text-2xl font-bold text-blue-600">${totalSavings}M</div>
          <div className="text-sm text-gray-600">{zbBudgetOpps.length} initiatives</div>
          <div className="text-xs text-gray-500 mt-1">13% reduction potential</div>
        </div>
      </div>

      {/* Unit Cost Trends */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Unit Cost Trends (12-Month)</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-2">Cost per Transaction</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={unitCostTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[1.5, 2.0]} />
                <Tooltip />
                <Line type="monotone" dataKey="costPerTxn" stroke="#3b82f6" strokeWidth={2} name="Cost/Txn ($)" />
              </LineChart>
            </ResponsiveContainer>
            <div className="text-xs text-gray-500 mt-2">
              Dec: $1.60 | Jan: $1.85 | Change: -13.5%
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-2">Cost per Account</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={unitCostTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[120, 145]} />
                <Tooltip />
                <Line type="monotone" dataKey="costPerAccount" stroke="#10b981" strokeWidth={2} name="Cost/Account ($)" />
              </LineChart>
            </ResponsiveContainer>
            <div className="text-xs text-gray-500 mt-2">
              Dec: $126 | Jan: $142 | Change: -11.3%
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-2">Cost per Client</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={unitCostTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[25000, 29000]} />
                <Tooltip />
                <Line type="monotone" dataKey="costPerClient" stroke="#f59e0b" strokeWidth={2} name="Cost/Client ($)" />
              </LineChart>
            </ResponsiveContainer>
            <div className="text-xs text-gray-500 mt-2">
              Dec: $25,500 | Jan: $28,500 | Change: -10.5%
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Spend Analysis */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Vendor Spend Analysis</h3>
          <div className="text-sm text-gray-600">
            Total Spend: <span className="font-semibold">${totalVendorSpend}M</span> |
            Consolidation Opportunity: <span className="font-semibold text-blue-600"> ${totalConsolidationOpp}M</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Vendor Category</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Annual Spend</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500"># Contracts</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Avg Discount</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Consolidation Opp</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vendorSpend.map((vendor, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{vendor.vendor}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">${vendor.annual}M</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-600">{vendor.contracts}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-600">{vendor.avgDiscount}%</td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-blue-600">${vendor.consolidationOpp}M</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{vendor.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <div className="font-medium text-blue-900">Key Findings</div>
          <ul className="mt-2 space-y-1 text-sm text-blue-800">
            <li>• 255 total vendors across 8 categories - opportunity to consolidate to ~180 vendors</li>
            <li>• Professional Services: 67 contracts with 15% avg discount - $42M consolidation opportunity</li>
            <li>• Technology: $485M annual spend across 42 contracts - rationalize overlapping tools</li>
            <li>• High discount categories (Marketing 22%, Telecom 18%) indicate weak negotiation leverage</li>
          </ul>
        </div>
      </div>

      {/* Efficiency Initiatives */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Efficiency Initiative Portfolio</h3>
          <div className="text-sm text-gray-600">
            Total Investment: <span className="font-semibold">${totalInitiativeInvestment}M</span> |
            Annual Savings: <span className="font-semibold text-green-600"> ${totalInitiativeSavings}M</span> |
            Payback: <span className="font-semibold">4.2 months</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Initiative</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Investment</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Annual Savings</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Payback</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Completion</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Impact Area</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {efficiencyInitiatives.map((init, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{init.initiative}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium rounded" style={{
                      backgroundColor: getStatusColor(init.status) + '20',
                      color: getStatusColor(init.status)
                    }}>
                      {init.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">${init.investmentMM}M</td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-green-600">${init.annualSavingsMM}M</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-600">{init.paybackMonths.toFixed(1)}mo</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${init.completionPct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{init.completionPct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{init.impactArea}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded">
            <div className="font-medium text-green-900">High ROI Initiatives (3 executing)</div>
            <ul className="mt-2 space-y-1 text-sm text-green-800">
              <li>• Offshore Expansion: 85% complete, 3.2mo payback, $68M annual savings</li>
              <li>• Process Automation: 78% complete, 3.4mo payback, $125M annual savings</li>
              <li>• STP Improvement: 68% complete, 3.7mo payback, $82M annual savings</li>
            </ul>
          </div>
          <div className="p-4 bg-amber-50 rounded">
            <div className="font-medium text-amber-900">Priority Actions</div>
            <ul className="mt-2 space-y-1 text-sm text-amber-800">
              <li>• Accelerate Vendor Consolidation (0.5mo payback, only 15% complete)</li>
              <li>• Cloud Migration running behind - reassess timeline and resourcing</li>
              <li>• Real Estate footprint reduction in planning - expedite lease negotiations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Unit Economics Benchmarking */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Unit Economics vs Peer Benchmark</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Metric</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Our Cost</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Peer Avg</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Top Quartile</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">vs Peer</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {unitEconBenchmark.map((metric, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{metric.metric}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                    {metric.unit === '$' ? '$' : ''}{metric.ourCost.toLocaleString()}{metric.unit === '%' ? '%' : metric.unit === '$K' ? 'K' : ''}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-600">
                    {metric.unit === '$' ? '$' : ''}{metric.peerAvg.toLocaleString()}{metric.unit === '%' ? '%' : metric.unit === '$K' ? 'K' : ''}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-600">
                    {metric.unit === '$' ? '$' : ''}{metric.topQuartile.toLocaleString()}{metric.unit === '%' ? '%' : metric.unit === '$K' ? 'K' : ''}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={metric.variance < 0 ? 'text-green-600' : 'text-red-600'}>
                      {metric.variance > 0 ? '+' : ''}{metric.variance}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium rounded" style={{
                      backgroundColor: getRatingColor(metric.rating) + '20',
                      color: getRatingColor(metric.rating)
                    }}>
                      {metric.rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded">
            <div className="font-medium text-green-900">Strengths</div>
            <ul className="mt-2 space-y-1 text-sm text-green-800">
              <li>• Cost per transaction 18% below peers</li>
              <li>• Cost per client 18% below peers</li>
              <li>• Strong revenue productivity at $485K/FTE</li>
            </ul>
          </div>
          <div className="p-4 bg-amber-50 rounded">
            <div className="font-medium text-amber-900">Areas to Watch</div>
            <ul className="mt-2 space-y-1 text-sm text-amber-800">
              <li>• Tech spend 8% above peer average</li>
              <li>• Cost/Income ratio above top quartile target</li>
              <li>• Still room to reach best-in-class levels</li>
            </ul>
          </div>
          <div className="p-4 bg-red-50 rounded">
            <div className="font-medium text-red-900">Opportunities</div>
            <ul className="mt-2 space-y-1 text-sm text-red-800">
              <li>• Automation rate 31% below peers (22% vs 32%)</li>
              <li>• Gap to top quartile automation: 23pp</li>
              <li>• $125M annual savings if reach peer avg</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Cost Allocation by Function */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Cost Allocation by Function ($M)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={costAllocation} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="function" type="category" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="personnel" stackId="a" fill="#3b82f6" name="Personnel" />
            <Bar dataKey="technology" stackId="a" fill="#10b981" name="Technology" />
            <Bar dataKey="facilities" stackId="a" fill="#f59e0b" name="Facilities" />
            <Bar dataKey="other" stackId="a" fill="#6b7280" name="Other" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Personnel</div>
            <div className="text-lg font-semibold text-blue-600">
              ${costAllocation.reduce((sum, item) => sum + item.personnel, 0)}M
            </div>
            <div className="text-xs text-gray-500">59% of total</div>
          </div>
          <div>
            <div className="text-gray-600">Technology</div>
            <div className="text-lg font-semibold text-green-600">
              ${costAllocation.reduce((sum, item) => sum + item.technology, 0)}M
            </div>
            <div className="text-xs text-gray-500">26% of total</div>
          </div>
          <div>
            <div className="text-gray-600">Facilities</div>
            <div className="text-lg font-semibold text-amber-600">
              ${costAllocation.reduce((sum, item) => sum + item.facilities, 0)}M
            </div>
            <div className="text-xs text-gray-500">10% of total</div>
          </div>
          <div>
            <div className="text-gray-600">Other</div>
            <div className="text-lg font-semibold text-gray-600">
              ${costAllocation.reduce((sum, item) => sum + item.other, 0)}M
            </div>
            <div className="text-xs text-gray-500">5% of total</div>
          </div>
        </div>
      </div>

      {/* Zero-Based Budgeting Opportunities */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Zero-Based Budgeting Analysis</h3>
          <div className="text-sm text-gray-600">
            Current Spend: <span className="font-semibold">${totalCurrentSpend}M</span> →
            Proposed: <span className="font-semibold">${totalProposedSpend}M</span> =
            <span className="font-semibold text-green-600"> ${totalSavings}M savings</span> (13%)
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Category</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Current</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Proposed</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Savings</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">% Reduction</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Confidence</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Initiatives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {zbBudgetOpps.map((opp, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{opp.category}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">${opp.current}M</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">${opp.proposed}M</td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-green-600">${opp.savings}M</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-600">
                    {((opp.savings / opp.current) * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium rounded" style={{
                      backgroundColor: getConfidenceColor(opp.confidence) + '20',
                      color: getConfidenceColor(opp.confidence)
                    }}>
                      {opp.confidence}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-600">{opp.initiatives}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <div className="font-medium text-gray-900 mb-2">Savings Waterfall ($M)</div>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={[
              { name: 'Current', value: totalCurrentSpend, fill: '#6b7280' },
              { name: 'Vendor', value: -183, fill: '#ef4444' },
              { name: 'Process', value: -107, fill: '#ef4444' },
              { name: 'Facilities', value: -85, fill: '#ef4444' },
              { name: 'Discretionary', value: -87, fill: '#ef4444' },
              { name: 'Technology', value: -73, fill: '#ef4444' },
              { name: 'Org Design', value: -68, fill: '#ef4444' },
              { name: 'Proposed', value: totalProposedSpend, fill: '#10b981' },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5500]} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6">
                {zbBudgetOpps.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#6b7280' : index === zbBudgetOpps.length - 1 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <div className="font-medium text-blue-900">Implementation Roadmap</div>
          <div className="mt-2 grid grid-cols-3 gap-4 text-sm text-blue-800">
            <div>
              <div className="font-medium">Q1-Q2 2024 (High Confidence)</div>
              <ul className="mt-1 space-y-1">
                <li>• Discretionary spending: $87M</li>
                <li>• Process reengineering: $107M</li>
                <li>• Facilities optimization: $85M</li>
              </ul>
            </div>
            <div>
              <div className="font-medium">Q3-Q4 2024 (Medium Confidence)</div>
              <ul className="mt-1 space-y-1">
                <li>• Vendor renegotiation: $183M</li>
                <li>• Technology rationalization: $73M</li>
              </ul>
            </div>
            <div>
              <div className="font-medium">2025 (Lower Confidence)</div>
              <ul className="mt-1 space-y-1">
                <li>• Organizational design: $68M</li>
                <li>• Requires change management</li>
                <li>• Union negotiations needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
