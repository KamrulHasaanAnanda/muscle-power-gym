import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './Layout.jsx'
import DressCode from './pages/DressCode.jsx'
import Home from './pages/Home.jsx'
import Rules from './pages/Rules.jsx'
import WorkoutChart from './pages/WorkoutChart.jsx'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dress-code" element={<DressCode />} />
          <Route path="rules" element={<Rules />} />
          <Route path="workout-chart" element={<WorkoutChart />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
