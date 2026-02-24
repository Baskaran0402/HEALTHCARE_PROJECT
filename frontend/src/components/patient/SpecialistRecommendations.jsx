import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SpecialistRecommendations = ({ coords, patientRisk }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Map AI risk concerns to medical specializations
  const riskToSpecialist = {
    'Heart Disease': 'Cardiologist',
    'Stroke': 'Neurologist',
    'Diabetes': 'Endocrinologist',
    'Liver': 'Hepatologist',
    'Kidney': 'Nephrologist',
    'High BP': 'Cardiologist',
    'Cancer': 'Oncologist',
  };

  const recommendedSpec = patientRisk ? riskToSpecialist[patientRisk] || 'General Physician' : null;

  useEffect(() => {
    const fetchNearby = async () => {
      if (!coords) return;
      setLoading(true);
      try {
        // Fetch nearby doctors with radius search
        // If we have an AI recommended specialization, filter by it
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/doctors/nearby?lat=${coords.lat}&lng=${coords.lng}&radius=25${recommendedSpec ? `&specialization=${recommendedSpec}` : ''}`, {
           headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        setRecommendations(data);
      } catch (err) {
        console.error('Failed to fetch nearby doctors', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNearby();
  }, [coords, recommendedSpec]);

  if (!coords) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
             <Activity className="text-blue-600" size={24}/>
             Nearby Specialist Recommendations
           </h3>
           <p className="text-slate-500 text-sm font-medium">Top certified experts within 25km of your location</p>
        </div>
        
        {recommendedSpec && (
            <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl border border-amber-100 flex items-center gap-2 animate-pulse">
                <ShieldCheck size={18}/>
                <span className="text-xs font-bold uppercase tracking-tight">AI Recommended: {recommendedSpec}</span>
            </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2].map(i => (
                <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-2xl"></div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.length === 0 ? (
             <div className="col-span-full bg-slate-50 p-10 rounded-2xl text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-500 font-medium">No specialized doctors found within 25km. Try expanding your search area or looking for a General Physician.</p>
                <button className="mt-4 text-blue-600 font-bold hover:underline">View General Physicians</button>
             </div>
          ) : (
            recommendations.map(doctor => (
              <div 
                key={doctor.id} 
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-1"
                onClick={() => navigate(`/doctor/${doctor.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-2xl shadow-inner uppercase">
                      {doctor.name.substring(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">Dr. {doctor.name}</h4>
                      <p className="text-blue-600 font-bold text-xs uppercase tracking-widest">{doctor.specialization}</p>
                      <div className="flex items-center text-amber-500 text-xs font-bold mt-1">
                        <Star size={12} fill="currentColor" className="mr-1"/>
                        {doctor.rating || 'New'} • {doctor.years_of_experience || 0}+ Years Exp
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Distance</p>
                     <p className="text-lg font-black text-slate-800">{doctor.distance ? doctor.distance.toFixed(1) : '0.0'} km</p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-50 pt-4">
                   <div className="flex items-center gap-2 text-slate-500 text-xs">
                     <MapPin size={14} className="text-slate-300"/>
                     <span className="font-medium truncate">{doctor.address || doctor.hospital_affiliation || 'Location not specified'}</span>
                   </div>
                   <div className="flex items-center gap-2 text-slate-500 text-xs">
                     <Clock size={14} className="text-slate-300"/>
                     <span className="font-medium">Next Available: Tomorrow, 10:00 AM</span>
                   </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultation Fee</p>
                        <p className="text-xl font-black text-slate-900">${doctor.consultation_fee || '0.00'}</p>
                    </div>
                    <button className="bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200">
                        Book Now
                        <ArrowRight size={16}/>
                    </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SpecialistRecommendations;
