import React, { useState, useEffect } from 'react'
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
import AdminDashboard from './pages/admin/AdminDashboard'
import FindDoctors from './pages/patient/FindDoctors'

import TelemedicineDashboard from './components/patient/TelemedicineDashboard'
import PatientRecords from './pages/patient/Records'

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem('user')));
    };
    window.addEventListener('storage', handleStorageChange);
    // Custom event to trigger update in same window
    window.addEventListener('authChange', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <div className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/demo" element={<DemoPage />} />
          
          {/* Clinical Contexts */}
          <Route path="/consultation" element={<ConsultationPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/brain-tumor" element={<BrainTumorPage />} />
          
          {/* Dashboard Contexts */}
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/patient/dashboard" element={<TelemedicineDashboard user={user} />} />
          <Route path="/find-doctors" element={<FindDoctors />} />
          <Route path="/records/:patientId" element={<PatientRecords />} />
          
          {/* Legacy/Redirects Mapping */}
          <Route path="/dashboard/:patientId" element={<TelemedicineDashboard user={user} />} />
        </Routes>
        <KiraChat />
      </div>
    </Router>
  )
}

export default App
