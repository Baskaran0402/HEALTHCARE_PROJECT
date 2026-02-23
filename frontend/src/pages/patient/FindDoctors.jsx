import React, { useState, useEffect } from 'react';
import { doctorService } from '../../lib/api/doctors';
import { consultationService } from '../../lib/api/consultations';
import { Search, MapPin, Star, Filter, Calendar } from 'lucide-react';

const FindDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [requestSent, setRequestSent] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await doctorService.searchDoctors({ specialization });
      setDoctors(data);
    } catch (err) {
      console.error('Failed to fetch doctors', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleRequest = async (doctorId) => {
    try {
      const patient = JSON.parse(localStorage.getItem('user'));
      // In a real app, we'd have a patient profile ID
      // For now, using user ID as a placeholder for patient ID
      await consultationService.requestConsultation({
        doctor_id: doctorId,
        patient_id: patient.id, // Placeholder
        consultation_type: 'chat',
        symptoms: 'Initial health consultation'
      });
      setRequestSent(true);
      setTimeout(() => setRequestSent(false), 3000);
    } catch (err) {
      alert('Failed to send request');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading text-slate-900">Find Specialists</h1>
            <p className="text-slate-500">Connect with certified medical professionals</p>
          </div>
          
          <div className="flex bg-white rounded-xl shadow-sm border border-slate-100 p-1 flex-1 max-w-xl">
            <div className="flex items-center px-4 text-slate-400">
               <Search size={20}/>
            </div>
            <input 
              type="text" 
              placeholder="Search by specialization (e.g. Cardiologist)..."
              className="flex-1 py-3 focus:outline-none text-slate-700 bg-transparent"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchDoctors()}
            />
            <button 
              onClick={fetchDoctors}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all"
            >
              Search
            </button>
          </div>
        </div>

        {requestSent && (
          <div className="bg-green-100 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center space-x-3 mb-6 animate-fade-in">
            <CheckCircle size={24} />
            <span className="font-bold">Consultation request sent successfully! The doctor will review it shortly.</span>
          </div>
        )}

        {loading ? (
          <div className="text-center p-10 font-heading text-slate-400">Searching for experts...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.length === 0 ? (
              <div className="col-span-full text-center p-10 bg-white rounded-2xl border border-dashed border-slate-300">
                 <p className="text-slate-500">No doctors found matching your criteria. Try searching for a different specialization.</p>
              </div>
            ) : (
              doctors.map(doctor => (
                <DoctorCard key={doctor.id} doctor={doctor} onBook={() => handleRequest(doctor.id)} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const DoctorCard = ({ doctor, onBook }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all group">
    <div className="p-6">
      <div className="flex items-start space-x-4">
        {doctor.profile_photo ? (
          <img src={doctor.profile_photo} alt={doctor.name} className="w-20 h-20 rounded-2xl object-cover shadow-sm" />
        ) : (
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-2xl">
            {doctor.name.substring(0, 2).toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">Dr. {doctor.name}</h3>
            <div className="flex items-center text-amber-500 text-sm font-bold">
              <Star size={14} fill="currentColor" className="mr-1" />
              {doctor.rating || 'New'}
            </div>
          </div>
          <p className="text-blue-600 font-bold text-sm tracking-wide uppercase mt-1">{doctor.specialization}</p>
          <div className="flex items-center text-slate-500 text-sm mt-3">
            <MapPin size={14} className="mr-1" />
            {doctor.hospital_affiliation || 'Private Clinic'}
          </div>
          <div className="flex items-center text-slate-500 text-sm mt-1">
            <Calendar size={14} className="mr-1" />
            {doctor.years_of_experience || 0}+ Years Exp.
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Consultation Fee</p>
          <p className="text-xl font-bold text-slate-900">${doctor.consultation_fee || '0.00'}</p>
        </div>
        <button 
          onClick={onBook}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all hover:scale-105 shadow-md shadow-blue-200"
        >
          Book Consultation
        </button>
      </div>
    </div>
  </div>
);

const CheckCircle = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default FindDoctors;
