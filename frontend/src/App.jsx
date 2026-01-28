import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ConsultationPage from './pages/ConsultationPage'
import ResultsPage from './pages/ResultsPage'
import DemoPage from './pages/DemoPage'
import BrainTumorPage from './pages/BrainTumorPage'
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
        <Route path="/brain-tumor" element={<BrainTumorPage />} />
      </Routes>
      <KiraChat />
    </Router>
  )
}

export default App
