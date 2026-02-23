import React, { useState, useEffect } from 'react';
import { doctorService } from '../../lib/api/doctors';
import { consultationService } from '../../lib/api/consultations';
import LocationSelector from '../../components/patient/LocationSelector';
import SpecialistRecommendations from '../../components/patient/SpecialistRecommendations';
import { Search, MapPin, Star, Filter, Calendar, CheckCircle, Info } from 'lucide-react';

const FindDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);
  const [requestSent, setRequestSent] = useState(false);

  // Mock patient risk for demo purposes
  const patientRisk = 'Heart Disease'; 

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
      const user = JSON.parse(localStorage.getItem('user'));
      await consultationService.requestConsultation({
        doctor_id: doctorId,
        patient_id: user.id, // Placeholder
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
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold font-heading text-slate-900 tracking-tight">Find Specialists</h1>
            <p className="text-slate-500 font-medium">Connect with top-rated medical professionals in your area.</p>
          </div>
          
          <div className="flex bg-white rounded-2xl shadow-sm border border-slate-100 p-1.5 flex-1 max-w-xl group focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <div className="flex items-center px-4 text-slate-400 group-focus-within:text-blue-600">
               <Search size={20}/>
            </div>
            <input 
              type="text" 
              placeholder="Search by specialization (e.g. Cardiologist)..."
              className="flex-1 py-3 focus:outline-none text-slate-700 bg-transparent font-medium"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchDoctors()}
            />
            <button 
              onClick={fetchDoctors}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100"
            >
              Search
            </button>
          </div>
        </header>

        {requestSent && (
          <div className="bg-green-100 border border-green-200 text-green-700 px-6 py-4 rounded-2xl flex items-center space-x-3 mb-6 animate-in slide-in-from-top-4 fade-in">
            <CheckCircle size={24} />
            <span className="font-bold uppercase text-sm tracking-wide">Consultation request sent successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1 space-y-6">
                <LocationSelector onLocationSelected={(c) => setCoords(c)} />
                
                <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-xl space-y-4">
                    <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center">
                        <Info size={20}/>
                    </div>
                    <h4 className="font-bold text-lg">AI Smart Match</h4>
                    <p className="text-blue-100 text-sm leading-relaxed">
                        Based on your latest health assessment, we suggest consulting a <strong>Cardiologist</strong> for better cardiovascular monitoring.
                    </p>
                </div>
            </aside>

            <main className="lg:col-span-3 space-y-10">
                {coords && (
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <SpecialistRecommendations coords={coords} patientRisk={patientRisk} />
                    </section>
                )}

                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-slate-800">Available Professionals</h3>
                        <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline">
                            <Filter size={14}/>
                            Advanced Filters
                        </button>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1,2,3,4].map(i => <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-2xl"></div>)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {doctors.length === 0 ? (
                            <div className="col-span-full text-center p-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                                <p className="text-slate-500 font-bold">No doctors found. Try expanding your search.</p>
                            </div>
                            ) : (
                            doctors.map(doctor => (
                                <DoctorCard key={doctor.id} doctor={doctor} onBook={() => handleRequest(doctor.id)} />
                            ))
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
      </div>
    </div>
  );
};

const DoctorCard = ({ doctor, onBook }) => (
  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all group hover:-translate-y-1">
    <div className="p-6">
      <div className="flex items-start space-x-4">
        {doctor.profile_photo ? (
          <img src={doctor.profile_photo} alt={doctor.name} className="w-20 h-20 rounded-2xl object-cover shadow-md" />
        ) : (
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-2xl shadow-inner uppercase">
            {doctor.name.substring(0, 2)}
          </div>
        )}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-black text-lg text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">Dr. {doctor.name}</h3>
            <div className="bg-amber-50 text-amber-600 px-2 py-1 rounded-lg flex items-center text-xs font-black">
              <Star size={12} fill="currentColor" className="mr-1" />
              {doctor.rating || 'NEW'}
            </div>
          </div>
          <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.15em] mt-1">{doctor.specialization}</p>
          <div className="flex items-center text-slate-500 text-xs mt-4 font-medium gap-1">
            <MapPin size={14} className="text-slate-300" />
            {doctor.hospital_affiliation || 'Private Specialist'}
          </div>
          <div className="flex items-center text-slate-500 text-xs mt-1 font-medium gap-1">
            <Calendar size={14} className="text-slate-300" />
            {doctor.years_of_experience || 0}+ Years of Excellence
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Consultation</p>
          <p className="text-2xl font-black text-slate-900">${doctor.consultation_fee || '0.00'}</p>
        </div>
        <button 
          onClick={onBook}
          className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
        >
          Book Now
        </button>
      </div>
    </div>
  </div>
);

export default FindDoctors;
