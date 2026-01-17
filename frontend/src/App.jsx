import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ConsultationPage from './pages/ConsultationPage'
import ResultsPage from './pages/ResultsPage'
import DemoPage from './pages/DemoPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </Router>
  )
}

export default App
