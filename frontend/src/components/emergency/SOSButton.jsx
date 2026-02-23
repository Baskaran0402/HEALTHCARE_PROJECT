import React, { useState, useEffect } from 'react';
import { AlertCircle, MapPin, Phone, Shield, ArrowRight, Loader2 } from 'lucide-react';
import apiClient from '../../lib/api/client';

const SOSButton = ({ patientId }) => {
  const [loading, setLoading] = useState(false);
  const [sosStatus, setSosStatus] = useState(null);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);

  const triggerSOS = async () => {
    setLoading(true);
    try {
      // 1. Get current position
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        
        // 2. Call SOS API
        const response = await apiClient.post('/api/emergency/sos', {
          patient_id: patientId,
          latitude,
          longitude,
          severity: 'critical'
        });
        
        setSosStatus(response.data);
        setNearbyHospitals(response.data.nearby_hospitals);
        setLoading(false);
      }, (err) => {
        alert("Location access required for SOS");
        setLoading(false);
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const resolveSOS = async () => {
    if (!sosStatus) return;
    await apiClient.post(`/api/emergency/resolve/${sosStatus.id}`);
    setSosStatus(null);
    setNearbyHospitals([]);
  };

  return (
    <div className="relative">
      {!sosStatus ? (
        <button 
          onClick={triggerSOS}
          disabled={loading}
          className="group relative flex items-center justify-center w-24 h-24 bg-red-600 rounded-full shadow-2xl hover:bg-red-700 transition-all active:scale-95 border-8 border-red-100 animate-pulse"
        >
          {loading ? (
             <Loader2 className="text-white animate-spin" size={32} />
          ) : (
            <div className="text-center">
                <AlertCircle className="text-white mx-auto" size={32} />
                <span className="text-[10px] text-white font-black uppercase tracking-tighter">SOS</span>
            </div>
          )}
          <span className="absolute -top-2 -right-2 flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500"></span>
          </span>
        </button>
      ) : (
        <div className="fixed inset-0 z-[9999] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6">
            <div className="max-w-lg w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="bg-red-600 p-8 text-white text-center">
                    <div className="bg-white/20 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <Shield size={32} />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tight">Emergency Active</h2>
                    <p className="text-red-100 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Help is being routed to your location</p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-widest px-1">Nearby Emergency Facilities</h3>
                        {nearbyHospitals.map((hosp, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-red-200 transition-colors">
                                <div className="flex gap-4 items-center">
                                    <div className="bg-white p-3 rounded-xl shadow-sm text-red-600">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-800 uppercase text-xs">{hosp.name}</p>
                                        <p className="text-slate-400 text-[10px] font-bold">{hosp.distance} • Fastest Route</p>
                                    </div>
                                </div>
                                <button className="bg-slate-900 text-white p-3 rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-800">
                                    <Phone size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button 
                            onClick={() => window.open('https://www.google.com/maps', '_blank')}
                            className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all text-center"
                        >
                            Open Maps Guidance
                        </button>
                        <button 
                            onClick={resolveSOS}
                            className="bg-slate-100 text-slate-400 py-4 px-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                <div className="px-8 pb-8 text-center">
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Digital Emergency Response Protocol active</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SOSButton;
