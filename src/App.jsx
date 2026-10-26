import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './Layout.jsx'
import Pwa from './Pwa.jsx'
import DressCode from './pages/DressCode.jsx'
import Home from './pages/Home.jsx'
import PriceChart from './pages/PriceChart.jsx'
import Program from './pages/Program.jsx'
import Rules from './pages/Rules.jsx'
import StaffGate from './pages/StaffGate.jsx'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Pwa />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dress-code" element={<DressCode />} />
          <Route path="rules" element={<Rules />} />
          <Route element={<StaffGate />}>
            <Route path="price-chart" element={<PriceChart />} />
            <Route path="weight-loss" element={<Program key="weight-loss" id="weight-loss" />} />
            <Route path="weight-gain" element={<Program key="weight-gain" id="weight-gain" />} />
            <Route path="custom" element={<Program key="custom" id="custom" />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
