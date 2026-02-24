import React, { useState, useEffect } from 'react';
import { consultationService } from '../../lib/api/consultations';
import { doctorService } from '../../lib/api/doctors';
import { User, Calendar, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';

const DoctorDashboard = () => {
  const [consultations, setConsultations] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        // Find doctor profile for this user
        // This is a simplified fetch, ideally handled by a global store
        const drResp = await doctorService.searchDoctors({ user_id: user.id });
        if (drResp.length > 0) {
          const dr = drResp[0];
          setDoctor(dr);
          const cons = await consultationService.getDoctorConsultations(dr.id);
          setConsultations(cons);
        }
      } catch {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await consultationService.updateStatus(id, status);
      setConsultations(consultations.map(c => c.id === id ? { ...c, status } : c));
    } catch {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="p-10 text-center font-heading text-slate-500">Loading Dashboard...</div>;

  if (!doctor) return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold font-heading text-slate-800">Complete Your Doctor Profile</h1>
      <p className="text-slate-600 mt-2">You need to set up your professional profile to start receiving consultation requests.</p>
      <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Complete Profile</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold font-heading text-slate-900">Welcome, Dr. {doctor.name}</h1>
            <p className="text-slate-500 mt-1">{doctor.specialization} • {doctor.hospital_affiliation}</p>
          </div>
          <div className="flex space-x-4">
             <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-3">
               <div className="bg-green-100 p-2 rounded-lg text-green-600"><CheckCircle size={20}/></div>
               <div><p className="text-xs text-slate-500">Verified</p><p className="font-bold text-slate-800">License # {doctor.medical_license_number}</p></div>
             </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard icon={<Calendar className="text-blue-600" />} label="Total Consultations" value={doctor.total_consultations} />
          <StatCard icon={<Clock className="text-amber-600" />} label="Pending Requests" value={consultations.filter(c => c.status === 'pending').length} />
          <StatCard icon={<User className="text-purple-600" />} label="Active Patients" value={new Set(consultations.map(c => c.patient_id)).size} />
          <StatCard icon={<MessageSquare className="text-green-600" />} label="New Messages" value="0" />
        </div>

        {/* Consultation Requests */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Consultation Requests</h2>
            <select className="bg-slate-50 border-none text-sm rounded-lg px-3 py-1 font-medium text-slate-600">
               <option>All Requests</option>
               <option>Pending</option>
               <option>Accepted</option>
            </select>
          </div>
          
          <div className="divide-y divide-slate-50">
            {consultations.length === 0 ? (
              <div className="p-10 text-center text-slate-400">No consultation requests found.</div>
            ) : (
              consultations.map(request => (
                <div key={request.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {request.patient_id.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Patient ID: {request.patient_id.substring(0, 8)}...</p>
                      <p className="text-sm text-slate-500">{new Date(request.requested_at).toLocaleDateString()} • {request.consultation_type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Status</p>
                      <StatusBadge status={request.status} />
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleStatusUpdate(request.id, 'accepted')}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition-all hover:scale-105"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(request.id, 'cancelled')}
                          className="bg-slate-200 text-slate-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-300 transition-all"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    
                    {request.status === 'accepted' && (
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all flex items-center space-x-2">
                        <MessageSquare size={16}/>
                        <span>Start Chat</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
    <div className="bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
      {icon}
    </div>
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-amber-100 text-amber-600',
    accepted: 'bg-green-100 text-green-600',
    completed: 'bg-blue-100 text-blue-600',
    cancelled: 'bg-red-100 text-red-600',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${styles[status] || 'bg-slate-100'}`}>
      {status}
    </span>
  );
};

export default DoctorDashboard;
