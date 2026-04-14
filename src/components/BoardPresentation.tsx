import { useState, useMemo } from 'react'
import { generateLiquidityMetrics } from '../data/liquidityMetrics'
import { generateCapitalMetrics } from '../data/capitalMetrics'
import { generateBalanceSheetMetrics } from '../data/balanceSheetMetrics'
import { generateInterestRateMetrics } from '../data/interestRateMetrics'
import { generatePeerData } from '../data/peerData'
import { formatCurrency, formatPercent } from '../utils/dataGenerators'
import { Printer, Download, Eye, EyeOff } from 'lucide-react'
import { BarChart, Bar, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'

export default function BoardPresentation() {
  const [isPrintMode, setIsPrintMode] = useState(false)
  const [visibleSections, setVisibleSections] = useState({
    executive: true,
    capital: true,
    liquidity: true,
    performance: true,
    peer: true,
    outlook: true
  })

  const liquidity = useMemo(() => generateLiquidityMetrics(), [])
  const capital = useMemo(() => generateCapitalMetrics(), [])
  const balanceSheet = useMemo(() => generateBalanceSheetMetrics(), [])
  const interestRate = useMemo(() => generateInterestRateMetrics(), [])
  const peers = useMemo(() => generatePeerData(), [])

  const ownPeer = peers.find(p => p.ticker === 'NTRS')
  const otherPeers = peers.filter(p => p.ticker !== 'NTRS')
  const avgPeerROE = otherPeers.length > 0
    ? otherPeers.reduce((sum, p) => sum + p.fundamentals.roe, 0) / otherPeers.length
    : 12.0

  // If ownPeer not found, use fallback values
  const ownROE = ownPeer?.fundamentals?.roe ?? 12.8
  const ownROA = ownPeer?.fundamentals?.roa ?? 0.92
  const ownNIM = ownPeer?.fundamentals?.nim ?? 2.1
  const ownEfficiency = ownPeer?.fundamentals?.efficiencyRatio ?? 68.5
  const ownCET1 = ownPeer?.fundamentals?.cet1Ratio ?? capital.cet1.ratio

  // Regulatory minimums
  const regulatoryMinimums = {
    cet1: 8.0, // 4.5% + 2.5% buffer + 1.0% GSIB
    tier1: 9.5, // 6.0% + 2.5% buffer + 1.0% GSIB
    total: 11.5, // 8.0% + 2.5% buffer + 1.0% GSIB
    slr: 3.0
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    // In a real implementation, this would generate PDF
    alert('Export functionality would generate PDF using a library like jsPDF or react-pdf')
  }

  const toggleSection = (section: keyof typeof visibleSections) => {
    setVisibleSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const sectionStyle = isPrintMode ? 'mb-8 page-break-inside-avoid' : 'mb-8'
  const pageStyle = isPrintMode ? 'bg-white p-8 max-w-[1200px] mx-auto' : 'bg-white p-6'

  return (
    <div className={pageStyle}>
      {/* Header Controls - Hidden in print */}
      {!isPrintMode && (
        <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4 no-print">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Board Presentation</h1>
            <p className="text-gray-600 mt-2">
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsPrintMode(!isPrintMode)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              {isPrintMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isPrintMode ? 'Edit Mode' : 'Preview Mode'}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>
      )}

      {/* Section Toggles - Hidden in print */}
      {!isPrintMode && (
        <div className="mb-6 flex flex-wrap gap-2 no-print">
          {Object.entries(visibleSections).map(([key, visible]) => (
            <button
              key={key}
              onClick={() => toggleSection(key as keyof typeof visibleSections)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                visible
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {visible ? '✓' : '○'} {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Cover Page */}
      <div className={`${sectionStyle} text-center py-20 border-b-4 border-blue-600`}>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Northern Trust Corporation</h1>
        <h2 className="text-3xl font-semibold text-blue-600 mb-6">Board of Directors Presentation</h2>
        <p className="text-xl text-gray-600 mb-2">
          {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <p className="text-lg text-gray-500">Confidential - For Board Use Only</p>
      </div>

      {/* Executive Summary */}
      {visibleSections.executive && (
        <div className={sectionStyle}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Executive Summary</h2>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="border-l-4 border-green-500 pl-4">
              <div className="text-sm text-gray-600 mb-1">CET1 Ratio</div>
              <div className="text-3xl font-bold text-gray-900">{formatPercent(capital.cet1.ratio)}</div>
              <div className="text-sm text-green-600 mt-1">Above target by {formatPercent(capital.cet1.ratio - capital.cet1.threshold.green)}</div>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="text-sm text-gray-600 mb-1">LCR</div>
              <div className="text-3xl font-bold text-gray-900">{formatPercent(liquidity.lcr.value)}</div>
              <div className="text-sm text-blue-600 mt-1">{formatPercent(liquidity.lcr.value - 100)} above regulatory minimum</div>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <div className="text-sm text-gray-600 mb-1">ROE</div>
              <div className="text-3xl font-bold text-gray-900">{formatPercent(ownROE)}</div>
              <div className="text-sm text-gray-600 mt-1">vs peer avg {formatPercent(avgPeerROE)}</div>
            </div>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Key Highlights</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Capital position strong with CET1 ratio at {formatPercent(capital.cet1.ratio)}, well above regulatory requirements</li>
              <li>• Liquidity coverage ratio at {formatPercent(liquidity.lcr.value)}, exceeding 100% minimum with comfortable buffer</li>
              <li>• NSFR at {formatPercent(liquidity.nsfr.value)}, demonstrating stable funding profile</li>
              <li>• Return on equity at {formatPercent(ownROE)}, reflecting strong profitability and capital efficiency</li>
              <li>• Balance sheet growth controlled with total assets at {formatCurrency(balanceSheet.totalAssets, 0)}</li>
            </ul>
          </div>
        </div>
      )}

      {/* Capital Adequacy */}
      {visibleSections.capital && (
        <div className={sectionStyle}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Capital Adequacy</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Regulatory Capital Ratios</h3>
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Ratio</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-600">Actual</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-600">Minimum</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-600">Excess</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-sm">CET1</td>
                    <td className="py-2 text-sm text-right font-medium">{formatPercent(capital.cet1.ratio)}</td>
                    <td className="py-2 text-sm text-right">{formatPercent(regulatoryMinimums.cet1)}</td>
                    <td className="py-2 text-sm text-right text-green-600 font-medium">{formatPercent(capital.cet1.ratio - regulatoryMinimums.cet1)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-sm">Tier 1</td>
                    <td className="py-2 text-sm text-right font-medium">{formatPercent(capital.tier1.ratio)}</td>
                    <td className="py-2 text-sm text-right">{formatPercent(regulatoryMinimums.tier1)}</td>
                    <td className="py-2 text-sm text-right text-green-600 font-medium">{formatPercent(capital.tier1.ratio - regulatoryMinimums.tier1)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-sm">Total Capital</td>
                    <td className="py-2 text-sm text-right font-medium">{formatPercent(capital.totalCapital.ratio)}</td>
                    <td className="py-2 text-sm text-right">{formatPercent(regulatoryMinimums.total)}</td>
                    <td className="py-2 text-sm text-right text-green-600 font-medium">{formatPercent(capital.totalCapital.ratio - regulatoryMinimums.total)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-sm">SLR</td>
                    <td className="py-2 text-sm text-right font-medium">{formatPercent(capital.slr.ratio)}</td>
                    <td className="py-2 text-sm text-right">{formatPercent(regulatoryMinimums.slr)}</td>
                    <td className="py-2 text-sm text-right text-green-600 font-medium">{formatPercent(capital.slr.ratio - regulatoryMinimums.slr)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">RWA Composition</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Credit Risk', value: capital.cet1.rwa.credit },
                        { name: 'Market Risk', value: capital.cet1.rwa.market },
                        { name: 'Operational Risk', value: capital.cet1.rwa.operational }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#3b82f6" />
                      <Cell fill="#8b5cf6" />
                      <Cell fill="#ec4899" />
                    </Pie>
                    <Tooltip formatter={(v: number) => formatCurrency(v, 0)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Total RWA: {formatCurrency(capital.cet1.rwa.total, 0)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Liquidity Position */}
      {visibleSections.liquidity && (
        <div className={sectionStyle}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Liquidity Position</h2>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">HQLA Composition</h3>
              <table className="min-w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-sm">Level 1</td>
                    <td className="py-2 text-sm text-right font-medium">{formatCurrency(liquidity.lcr.hqla.level1, 1)}B</td>
                    <td className="py-2 text-sm text-right text-gray-600">100%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-sm">Level 2A</td>
                    <td className="py-2 text-sm text-right font-medium">{formatCurrency(liquidity.lcr.hqla.level2A, 1)}B</td>
                    <td className="py-2 text-sm text-right text-gray-600">85%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-sm">Level 2B</td>
                    <td className="py-2 text-sm text-right font-medium">{formatCurrency(liquidity.lcr.hqla.level2B, 1)}B</td>
                    <td className="py-2 text-sm text-right text-gray-600">50%</td>
                  </tr>
                  <tr className="font-semibold">
                    <td className="py-2 text-sm">Total HQLA</td>
                    <td className="py-2 text-sm text-right">{formatCurrency(liquidity.lcr.hqla.total, 1)}B</td>
                    <td className="py-2 text-sm text-right"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">LCR</span>
                  <span className="text-lg font-bold text-gray-900">{formatPercent(liquidity.lcr.value)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">NSFR</span>
                  <span className="text-lg font-bold text-gray-900">{formatPercent(liquidity.nsfr.value)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Liquidity Buffer</span>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(liquidity.liquidityBuffer, 1)}B</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {visibleSections.performance && (
        <div className={sectionStyle}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Financial Performance</h2>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">ROE</div>
              <div className="text-2xl font-bold text-gray-900">{formatPercent(ownROE)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">ROA</div>
              <div className="text-2xl font-bold text-gray-900">{formatPercent(ownROA)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">NIM</div>
              <div className="text-2xl font-bold text-gray-900">{formatPercent(interestRate.nim)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Efficiency Ratio</div>
              <div className="text-2xl font-bold text-gray-900">{formatPercent(ownEfficiency)}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Balance Sheet</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Assets</span>
                  <span className="font-medium">{formatCurrency(balanceSheet.totalAssets, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Deposits</span>
                  <span className="font-medium">{formatCurrency(balanceSheet.deposits.total, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Loans</span>
                  <span className="font-medium">{formatCurrency(balanceSheet.loans.total, 0)}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Asset Quality</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">NPL Ratio</span>
                  <span className="font-medium">{formatPercent(balanceSheet.qualityProxies.nplRatio)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">NCO Rate</span>
                  <span className="font-medium">{formatPercent(balanceSheet.qualityProxies.ncoRatio)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ACL Coverage</span>
                  <span className="font-medium">{formatPercent(balanceSheet.qualityProxies.aclRatio)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Peer Comparison */}
      {visibleSections.peer && (
        <div className={sectionStyle}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Peer Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Institution</th>
                  <th className="text-right py-2">ROE</th>
                  <th className="text-right py-2">P/TBV</th>
                  <th className="text-right py-2">CET1</th>
                  <th className="text-right py-2">Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {peers.slice(0, 8).map((peer, i) => (
                  <tr key={i} className={`border-b ${peer.ticker === 'NTRS' ? 'bg-amber-50 font-semibold' : ''}`}>
                    <td className="py-2">{peer.ticker}</td>
                    <td className="py-2 text-right">{formatPercent(peer.fundamentals.roe)}</td>
                    <td className="py-2 text-right">{peer.valuation.ptbv.toFixed(2)}x</td>
                    <td className="py-2 text-right">{formatPercent(peer.fundamentals.cet1Ratio)}</td>
                    <td className="py-2 text-right">{formatPercent(peer.fundamentals.efficiencyRatio)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Outlook & Recommendations */}
      {visibleSections.outlook && (
        <div className={sectionStyle}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Outlook & Strategic Considerations</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-green-600 bg-green-50 p-4 rounded-r-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Strengths</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Strong capital position provides strategic flexibility for growth and capital actions</li>
                <li>• Liquidity buffers exceed regulatory requirements with high-quality HQLA composition</li>
                <li>• Stable funding profile with NSFR well above 100%</li>
              </ul>
            </div>
            <div className="border-l-4 border-amber-600 bg-amber-50 p-4 rounded-r-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Areas of Focus</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Monitor deposit stability in rising rate environment to maintain LCR comfort zone</li>
                <li>• Continue focus on ROE improvement relative to peer group</li>
                <li>• Balance sheet optimization to enhance capital efficiency</li>
              </ul>
            </div>
            <div className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded-r-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Strategic Recommendations</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Consider incremental capital deployment opportunities given strong CET1 position</li>
                <li>• Enhance HQLA yield while maintaining liquidity coverage adequacy</li>
                <li>• Continue relationship-focused deposit retention strategies</li>
                <li>• Opportunistically optimize RWA density through portfolio management</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-4 border-t-2 border-gray-200 text-center text-sm text-gray-500">
        <p>Northern Trust Corporation - Confidential</p>
        <p>Generated: {new Date().toLocaleString()}</p>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .page-break-inside-avoid {
            page-break-inside: avoid;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  )
}
