// This module serializes all mock data into a JSON string for the E2B sandbox.
// It calls the data generator functions and snapshots their outputs.
// NOTE: Because the generators use Math.random(), values will differ per call.
// We cache the result per clientId so a single session gets consistent data.

import {
  getExecutiveSummaryData,
  getRevenueData,
  getAUCData,
  getOperationalMetrics,
  getProfitabilityData,
  getRiskMetrics,
  getClientMetrics,
  getMarketPositionData,
  getStrategicTargetsData,
  getPeerComparisonData,
  getBalanceSheetData,
  getEmployeeProductivityData,
  getSegmentPnLData,
  getTechnologyROIData,
  getRegulatoryExaminationData,
  getCybersecurityMetricsData,
  getCreditRiskDetailData,
  setActiveClientConfig,
} from '../../data/mockData'

import { generateCapitalMetrics } from '../../data/capitalMetrics'
import { generateLiquidityMetrics } from '../../data/liquidityMetrics'
import { generateInterestRateMetrics } from '../../data/interestRateMetrics'
import { generateOrderFlowMetrics } from '../../data/orderFlowMetrics'
import { generateBalanceSheetMetrics } from '../../data/balanceSheetMetrics'
import { getAllForecasts } from '../../data/forecastData'
import { generatePeerData } from '../../data/peerData'
import { getClientConfig, DEFAULT_CLIENT_ID, type ClientConfig } from '../../config/clientConfig'

const dataCache = new Map<string, string>()

function serializeDate(obj: unknown): unknown {
  if (obj instanceof Date) return obj.toISOString()
  if (Array.isArray(obj)) return obj.map(serializeDate)
  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[key] = serializeDate(value)
    }
    return result
  }
  return obj
}

export function getDataJson(clientId?: string): string {
  const id = clientId ?? DEFAULT_CLIENT_ID
  if (dataCache.has(id)) return dataCache.get(id)!

  // Switch mock data generators to this client
  const config = getClientConfig(id)
  setActiveClientConfig(config)

  const data = {
    executiveSummary: getExecutiveSummaryData(),
    revenue: getRevenueData(),
    auc: getAUCData(),
    operational: getOperationalMetrics(),
    profitability: getProfitabilityData(),
    risk: getRiskMetrics(),
    clientMetrics: getClientMetrics(),
    marketPosition: getMarketPositionData(),
    strategicTargets: getStrategicTargetsData(),
    peerComparison: getPeerComparisonData(),
    balanceSheet: getBalanceSheetData(),
    employees: getEmployeeProductivityData(),
    segmentPnL: getSegmentPnLData(),
    techROI: getTechnologyROIData(),
    regulatory: getRegulatoryExaminationData(),
    cybersecurity: getCybersecurityMetricsData(),
    creditRisk: getCreditRiskDetailData(),
    capital: generateCapitalMetrics(),
    liquidity: generateLiquidityMetrics(),
    interestRate: generateInterestRateMetrics(),
    orderFlow: generateOrderFlowMetrics(),
    balanceSheetDetailed: generateBalanceSheetMetrics(),
    forecasts: getAllForecasts(),
    peers: generatePeerData(),
  }

  const json = JSON.stringify(serializeDate(data))
  dataCache.set(id, json)
  return json
}
