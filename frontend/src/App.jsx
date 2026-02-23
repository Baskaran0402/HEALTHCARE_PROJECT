import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ConsultationPage from './pages/ConsultationPage'
import ResultsPage from './pages/ResultsPage'
import BrainTumorPage from './pages/BrainTumorPage'
import DemoPage from './pages/DemoPage'
import PatientDashboard from './pages/PatientDashboard'
import KiraChat from './components/KiraChat'
import './App.css'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import DoctorDashboard from './pages/doctor/Dashboard'
import FindDoctors from './pages/patient/FindDoctors'

import TelemedicineDashboard from './components/patient/TelemedicineDashboard'
import PatientRecords from './pages/patient/Records'
import PatientDashboard from './pages/PatientDashboard'

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="/find-doctors" element={<FindDoctors />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/patient/dashboard" element={<TelemedicineDashboard user={user} />} />
        <Route path="/records/:patientId" element={<PatientRecords />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/dashboard/:patientId" element={<PatientDashboard />} />
        <Route path="/brain-tumor" element={<BrainTumorPage />} />
      </Routes>
      <KiraChat />
    </Router>
  )
}

export default App
