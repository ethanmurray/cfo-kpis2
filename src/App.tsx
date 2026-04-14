import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { TimePeriodProvider } from './contexts/TimePeriodContext'
import DashboardLayout from './components/layout/DashboardLayout'
import ExecutiveDashboard from './pages/ExecutiveDashboard'
import Financials from './pages/Financials'
import BusinessEconomics from './pages/BusinessEconomics'
import ClientEconomics from './pages/ClientEconomics'
import ProductEconomics from './pages/ProductEconomics'
import Operations from './pages/Operations'
import ALM from './pages/ALM'
import PlanningStrategy from './pages/PlanningStrategy'
import ExternalPositioning from './pages/ExternalPositioning'
import RiskCompliance from './pages/RiskCompliance'
import MarketRisk from './pages/MarketRisk'

function App() {
  return (
    <Router>
      <TimePeriodProvider>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<ExecutiveDashboard />} />
            <Route path="/financials" element={<Financials />} />
            <Route path="/business-economics" element={<BusinessEconomics />} />
            <Route path="/clients" element={<ClientEconomics />} />
            <Route path="/products" element={<ProductEconomics />} />
            <Route path="/operations" element={<Operations />} />
            <Route path="/alm" element={<ALM />} />
            <Route path="/planning" element={<PlanningStrategy />} />
            <Route path="/external-positioning" element={<ExternalPositioning />} />
            <Route path="/risk-compliance" element={<RiskCompliance />} />
            <Route path="/market-risk" element={<MarketRisk />} />
          </Routes>
        </DashboardLayout>
      </TimePeriodProvider>
    </Router>
  )
}

export default App
