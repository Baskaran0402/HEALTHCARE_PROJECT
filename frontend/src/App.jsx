import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ConsultationPage from './pages/ConsultationPage'
import ResultsPage from './pages/ResultsPage'
import BrainTumorPage from './pages/BrainTumorPage'
import DemoPage from './pages/DemoPage'
import PatientDashboard from './pages/PatientDashboard'
import KiraChat from './components/KiraChat'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/dashboard/:patientId" element={<PatientDashboard />} />
        <Route path="/brain-tumor" element={<BrainTumorPage />} />
      </Routes>
      <KiraChat />
    </Router>
  )
}

export default App
