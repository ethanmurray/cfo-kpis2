import { useState } from 'react'
import { getRiskMetrics, getBalanceSheetData } from '../data/mockData'
import { formatCurrency } from '../utils/dataGenerators'
import MetricCard from '../components/MetricCard'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs'
import RWAEfficiency from '../components/optimization/RWAEfficiency'
import LiquidityOptimization from '../components/optimization/LiquidityOptimization'
import NIMDecomposition from '../components/optimization/NIMDecomposition'
import CapitalDeployment from '../components/optimization/CapitalDeployment'

export default function CapitalBalanceSheet() {
  const data = getRiskMetrics()
  const bsData = getBalanceSheetData()

  const GaugeChart = ({ value, threshold, label }: { value: number; threshold: number; label: string }) => {
    const percentage = Math.min((value / (threshold * 1.5)) * 100, 100)
    const isAboveThreshold = value > threshold
    const color = isAboveThreshold ? 'bg-green-500' : 'bg-red-500'

    return (
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(percentage / 100) * 352} 352`}
              className={color.replace('bg-', 'text-')}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{value.toFixed(1)}%</div>
              <div className="text-xs text-gray-500">Min: {threshold}%</div>
            </div>
          </div>
        </div>
        <div className="text-sm font-medium text-gray-700 mt-2">{label}</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Capital & Balance Sheet Optimization</h1>
        <p className="text-gray-600 mt-2">
          Capital ratios, balance sheet composition, and strategic optimization analytics
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rwa">RWA Efficiency</TabsTrigger>
          <TabsTrigger value="liquidity">Liquidity Optimization</TabsTrigger>
          <TabsTrigger value="nim">NIM Decomposition</TabsTrigger>
          <TabsTrigger value="deployment">Capital Deployment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div>

      {/* Capital Ratios */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Tier 1 Capital Ratio"
          value={data.capitalRatios.tier1}
          format="percentage"
          decimals={1}
          subtitle={`Minimum: ${data.capitalRatios.tier1Threshold}%`}
        />
        <MetricCard
          title="Total Capital Ratio"
          value={data.capitalRatios.total}
          format="percentage"
          decimals={1}
          subtitle={`Minimum: ${data.capitalRatios.totalThreshold}%`}
        />
        <MetricCard
          title="Liquidity Coverage Ratio"
          value={data.liquidityRatios.lcr}
          format="percentage"
          decimals={1}
          subtitle="Minimum: 100%"
        />
        <MetricCard
          title="Net Stable Funding Ratio"
          value={data.liquidityRatios.nsfr}
          format="percentage"
          decimals={1}
          subtitle="Minimum: 100%"
        />
      </div>

      {/* Capital Ratios Visual */}
      <div className="metric-card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Regulatory Capital Ratios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GaugeChart
            value={data.capitalRatios.tier1}
            threshold={data.capitalRatios.tier1Threshold}
            label="Tier 1 Capital Ratio"
          />
          <GaugeChart
            value={data.capitalRatios.total}
            threshold={data.capitalRatios.totalThreshold}
            label="Total Capital Ratio"
          />
        </div>
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <div className="text-sm font-medium text-green-800">
            ✓ Capital position remains strong with comfortable buffers above regulatory minimums
          </div>
        </div>
      </div>

      {/* Liquidity Ratios */}
      <div className="metric-card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Liquidity Ratios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GaugeChart
            value={data.liquidityRatios.lcr}
            threshold={100}
            label="Liquidity Coverage Ratio (LCR)"
          />
          <GaugeChart
            value={data.liquidityRatios.nsfr}
            threshold={100}
            label="Net Stable Funding Ratio (NSFR)"
          />
        </div>
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <div className="text-sm font-medium text-green-800">
            ✓ Liquidity ratios comfortably exceed 100% regulatory minimum
          </div>
        </div>
      </div>

      {/* Balance Sheet Summary */}
      <div className="metric-card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Balance Sheet Summary</h2>

        {/* Top Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <MetricCard
            title="Total Assets"
            value={bsData.totalAssets}
            format="currency"
            decimals={1}
          />
          <MetricCard
            title="Total Equity"
            value={bsData.equity.total}
            format="currency"
            decimals={1}
          />
          <MetricCard
            title="Leverage Ratio"
            value={bsData.leverageRatio}
            format="number"
            decimals={1}
            subtitle={`${bsData.leverageRatio.toFixed(1)}x Assets/Equity`}
          />
          <MetricCard
            title="Risk-Weighted Assets"
            value={bsData.rwa}
            format="currency"
            decimals={1}
          />
        </div>

        {/* Asset Composition */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Asset Composition</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Loans</div>
              <div className="text-xl font-bold text-gray-900">{formatCurrency(bsData.loans.total, 1)}</div>
              <div className="text-xs text-gray-600 mt-1">{bsData.loans.percentage.toFixed(1)}% of assets</div>
              <div className="text-xs text-green-600 mt-1">
                NPL Ratio: {bsData.loans.nplRatio.toFixed(2)}%
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Securities</div>
              <div className="text-xl font-bold text-gray-900">{formatCurrency(bsData.securities.total, 1)}</div>
              <div className="text-xs text-gray-600 mt-1">
                HTM: {formatCurrency(bsData.securities.htm, 1)}
              </div>
              <div className="text-xs text-gray-600">
                AFS: {formatCurrency(bsData.securities.afs, 1)}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                Avg Yield: {bsData.securities.averageYield.toFixed(2)}%
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Deposits</div>
              <div className="text-xl font-bold text-gray-900">{formatCurrency(bsData.deposits.total, 1)}</div>
              <div className="text-xs text-gray-600 mt-1">
                DDA: {formatCurrency(bsData.deposits.dda, 1)} (65%)
              </div>
              <div className="text-xs text-gray-600">
                Savings: {formatCurrency(bsData.deposits.savings, 1)}
              </div>
              <div className="text-xs text-orange-600 mt-1">
                Cost of Funds: {bsData.deposits.costOfFunds.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        {/* Equity Composition */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Shareholders' Equity</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-xs text-blue-700 mb-1">Total Equity</div>
              <div className="text-lg font-bold text-blue-900">{formatCurrency(bsData.equity.total, 1)}</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-xs text-green-700 mb-1">Common Equity</div>
              <div className="text-lg font-bold text-green-900">{formatCurrency(bsData.equity.commonEquity, 1)}</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-xs text-purple-700 mb-1">Retained Earnings</div>
              <div className="text-lg font-bold text-purple-900">{formatCurrency(bsData.equity.retainedEarnings, 1)}</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-xs text-orange-700 mb-1">AOCI</div>
              <div className="text-lg font-bold text-orange-900">{formatCurrency(bsData.equity.aoci, 1)}</div>
              <div className="text-xs text-orange-700 mt-1">Unrealized losses</div>
            </div>
          </div>
        </div>
      </div>

      {/* Capital Deployment */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Capital Allocation Strategy</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="text-sm font-medium text-blue-900 mb-1">Dividends (YTD)</div>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(bsData.capitalAllocation.dividends, 0)}</div>
            <div className="text-xs text-blue-700 mt-1">Quarterly payments</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="text-sm font-medium text-green-900 mb-1">Share Buybacks (YTD)</div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(bsData.capitalAllocation.buybacks, 0)}</div>
            <div className="text-xs text-green-700 mt-1">Opportunistic repurchases</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="text-sm font-medium text-purple-900 mb-1">Organic Growth</div>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(bsData.capitalAllocation.organicGrowth, 0)}</div>
            <div className="text-xs text-purple-700 mt-1">Retained for investment</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <div className="text-sm font-medium text-orange-900 mb-1">Payout Ratio</div>
            <div className="text-2xl font-bold text-orange-600">{bsData.capitalAllocation.payoutRatio.toFixed(1)}%</div>
            <div className="text-xs text-orange-700 mt-1">Div + Buybacks / Net Income</div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Capital Allocation Philosophy</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                <strong>Dividends First:</strong> Maintain progressive dividend policy with {bsData.capitalAllocation.payoutRatio.toFixed(0)}% target payout ratio
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">•</span>
              <span>
                <strong>Buybacks Opportunistic:</strong> Repurchase shares when trading below intrinsic value (current P/TBV: 0.68x)
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-600 mt-0.5">•</span>
              <span>
                <strong>Organic Investment:</strong> Technology, talent, and product development to drive ROE expansion
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-orange-600 mt-0.5">•</span>
              <span>
                <strong>M&A Discipline:</strong> Selective acquisitions focused on capability gaps and strategic adjacencies
              </span>
            </div>
          </div>
        </div>
      </div>
          </div>
        </TabsContent>

        <TabsContent value="rwa">
          <RWAEfficiency />
        </TabsContent>

        <TabsContent value="liquidity">
          <LiquidityOptimization />
        </TabsContent>

        <TabsContent value="nim">
          <NIMDecomposition />
        </TabsContent>

        <TabsContent value="deployment">
          <CapitalDeployment />
        </TabsContent>
      </Tabs>
    </div>
  )
}
