import React, { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAuthStore from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';

// Page Imports
import HomePage from './pages/HomePage';
import ConsultationPage from './pages/ConsultationPage';
import ResultsPage from './pages/ResultsPage';
import BrainTumorPage from './pages/BrainTumorPage';
import PatientDashboard from './pages/PatientDashboard';
import KiraChat from './components/KiraChat';
import './App.css';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DoctorDashboard from './pages/doctor/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import FindDoctors from './pages/patient/FindDoctors';

import TelemedicineDashboard from './components/patient/TelemedicineDashboard';
import PatientRecords from './pages/patient/Records';
import Settings from './pages/Settings';

import Diagnostics from './pages/Diagnostics';
import Patients from './pages/Patients';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import { Security, About, Docs, Contact } from './pages/StaticPages';
import NotFoundPage from './pages/NotFoundPage';

import PatientHome from './pages/patient/PatientHome';
import DoctorHome from './pages/doctor/DoctorHome';
import InstitutionHome from './pages/institution/InstitutionHome';
import DashboardLayout from './components/layout/DashboardLayout';

import PatientQueuePage from './pages/doctor/PatientQueuePage';
import VideoConsultPage from './pages/doctor/VideoConsultPage';
import SchedulePage from './pages/doctor/SchedulePage';

import { ToastProvider } from './components/ui/Toast';

// Global Configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const queryClient = new QueryClient();

function DashboardHome() {
  const { user } = useAuthStore();
  const role = user?.role || 'patient';
  if (role === 'doctor') return <DoctorHome />;
  if (role === 'institution' || role === 'super_admin') return <InstitutionHome />;
  return <PatientHome />;
}

const Unauthorized = () => (
  <div className="min-h-screen bg-[#f7f9f8] flex items-center justify-center p-6 text-center">
    <div className="max-w-sm">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm border border-red-100">
        <p className="text-4xl">🔒</p>
      </div>
      <h1 className="font-[Syne] font-black text-3xl text-[#0a0a0f] mb-4 tracking-tight">Access Restricted</h1>
      <p className="text-[#0a0a0f]/40 text-sm mb-10 leading-relaxed font-[DM_Sans]">
        Institutional credentials unauthorized for this clinical node.
      </p>
      <a href="/dashboard" className="inline-block bg-[#0fd68c] text-[#060d0a] font-[Syne] font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest hover:bg-[#0ab876] transition-all">
        Return to Portal
      </a>
    </div>
  </div>
);

export default function App() {
  const { user, isAuthenticated, refreshUser, isLoading } = useAuthStore();

  useEffect(() => {
    if (localStorage.getItem('access_token') && !user) {
      refreshUser();
    }
    const savedTheme = localStorage.getItem('aruviai-theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, [user, refreshUser]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#060d0a] flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#0fd68c] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <ToastProvider>
          <Router>
            <div className="app-main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                
                {/* Auth Gates */}
                <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
                <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Dashboard Root */}
                <Route path="/dashboard" element={<DashboardLayout><DashboardHome /></DashboardLayout>} />

                {/* Clinical Nodes */}
                <Route path="/assessment" element={<DashboardLayout><ProtectedRoute allowedRoles={['patient','doctor','institution']}><ConsultationPage /></ProtectedRoute></DashboardLayout>} />
                <Route path="/brain-tumor" element={<DashboardLayout><ProtectedRoute allowedRoles={['patient','doctor','institution']}><BrainTumorPage /></ProtectedRoute></DashboardLayout>} />
                <Route path="/results" element={<DashboardLayout><ProtectedRoute allowedRoles={['patient','doctor','institution']}><ResultsPage /></ProtectedRoute></DashboardLayout>} />
                
                {/* Role Specific Routes */}
                <Route path="/my-reports" element={<DashboardLayout><ProtectedRoute allowedRoles={['patient']}><Reports /></ProtectedRoute></DashboardLayout>} />
                <Route path="/find-doctor" element={<DashboardLayout><ProtectedRoute allowedRoles={['patient']}><FindDoctors /></ProtectedRoute></DashboardLayout>} />
                <Route path="/appointments" element={<DashboardLayout><ProtectedRoute allowedRoles={['patient','doctor']}><TelemedicineDashboard user={user} /></ProtectedRoute></DashboardLayout>} />
                <Route path="/profile" element={<DashboardLayout><ProtectedRoute allowedRoles={['patient','doctor','institution']}><Settings /></ProtectedRoute></DashboardLayout>} />

                <Route path="/queue" element={<DashboardLayout><ProtectedRoute allowedRoles={['doctor','institution']}><PatientQueuePage /></ProtectedRoute></DashboardLayout>} />
                <Route path="/records" element={<DashboardLayout><ProtectedRoute allowedRoles={['doctor','institution']}><Patients /></ProtectedRoute></DashboardLayout>} />
                <Route path="/records/:patientId" element={<DashboardLayout><ProtectedRoute allowedRoles={['doctor','institution']}><PatientRecords /></ProtectedRoute></DashboardLayout>} />
                <Route path="/consult" element={<DashboardLayout><ProtectedRoute allowedRoles={['doctor']}><VideoConsultPage /></ProtectedRoute></DashboardLayout>} />
                <Route path="/consultation" element={<DashboardLayout><ProtectedRoute allowedRoles={['patient','doctor','institution']}><ConsultationPage /></ProtectedRoute></DashboardLayout>} />
                <Route path="/schedule" element={<DashboardLayout><ProtectedRoute allowedRoles={['doctor']}><SchedulePage /></ProtectedRoute></DashboardLayout> } />
                <Route path="/risk-dashboard" element={<DashboardLayout><ProtectedRoute allowedRoles={['doctor','institution']}><Analytics /></ProtectedRoute></DashboardLayout>} />

                <Route path="/inst-dashboard" element={<DashboardLayout><ProtectedRoute allowedRoles={['institution']}><InstitutionHome /></ProtectedRoute></DashboardLayout>} />
                <Route path="/analytics" element={<DashboardLayout><ProtectedRoute allowedRoles={['institution']}><Analytics /></ProtectedRoute></DashboardLayout>} />
                <Route path="/doctors" element={<DashboardLayout><ProtectedRoute allowedRoles={['institution']}><AdminDashboard /></ProtectedRoute></DashboardLayout>} />
                <Route path="/all-appointments" element={<DashboardLayout><ProtectedRoute allowedRoles={['institution']}><TelemedicineDashboard user={user} /></ProtectedRoute></DashboardLayout>} />
                <Route path="/access" element={<DashboardLayout><ProtectedRoute allowedRoles={['institution']}><Security /></ProtectedRoute></DashboardLayout>} />
                <Route path="/compliance" element={<DashboardLayout><ProtectedRoute allowedRoles={['institution']}><Reports /></ProtectedRoute></DashboardLayout>} />
                <Route path="/system" element={<DashboardLayout><ProtectedRoute allowedRoles={['institution']}><Analytics /></ProtectedRoute></DashboardLayout>} />

                {/* Catch All */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <KiraChat />
            </div>
          </Router>
        </ToastProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}
