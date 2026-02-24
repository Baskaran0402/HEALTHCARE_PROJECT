import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Phone, Navigation, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SOSButton = ({ patientId }) => {
    const [status, setStatus] = useState('idle'); // idle, active, locating, resolved
    const [nearbyHospitals, setNearbyHospitals] = useState([]);
    const [location, setLocation] = useState(null);

    const triggerSOS = async () => {
        setStatus('locating');
        
        // 1. Get Location
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });

                try {
                    // Mock API Call to backend
                    const response = await fetch('http://127.0.0.1:8000/api/emergency/sos', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            patient_id: patientId,
                            latitude,
                            longitude,
                            alert_type: 'panic'
                        })
                    });
                    
                    const data = await response.json();
                    setNearbyHospitals(data.nearby_hospitals || []);
                    setStatus('active');
                } catch (err) {
                    console.error("SOS failed", err);
                    // Fallback for demo if backend is down
                    setNearbyHospitals([
                        { name: "Apollo Emergency Care", distance: "0.4 km", phone: "+91 911 000 000" },
                        { name: "Fortis ICU Unit", distance: "1.2 km", phone: "+91 911 555 555" }
                    ]);
                    setStatus('active');
                }
            });
        }
    };

    return (
        <div className="sos-component">
            <AnimatePresence mode="wait">
                {status === 'idle' && (
                    <motion.button
                        key="idle"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.2, opacity: 0 }}
                        onClick={triggerSOS}
                        className="sos-main-btn"
                    >
                        <div className="pulse-ring"></div>
                        <div className="pulse-ring-inner"></div>
                        <div className="sos-content">
                           <ShieldAlert size={32} />
                           <span>SOS PANIC</span>
                        </div>
                    </motion.button>
                )}

                {(status === 'locating' || status === 'active') && (
                    <motion.div
                        key="active"
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="sos-active-panel glass"
                    >
                        <div className="panel-header">
                            <div className="flex items-center gap-3">
                                <div className="bg-danger p-2 rounded-full animate-pulse">
                                    <AlertTriangle size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 uppercase">Emergency Active</h3>
                                    <p className="text-[10px] font-bold text-slate-500">RESCOVERY PROTOCOL INITIATED</p>
                                </div>
                            </div>
                            <button onClick={() => setStatus('idle')} className="text-slate-400 hover:text-slate-900 font-black text-xs uppercase">
                                Cancel
                            </button>
                        </div>

                        <div className="panel-body">
                            {status === 'locating' ? (
                                <div className="flex flex-col items-center py-10">
                                    <Loader2 size={32} className="text-primary animate-spin mb-4" />
                                    <p className="font-black text-slate-800 uppercase text-xs tracking-widest">Triangulating Position...</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-4 bg-slate-50 p-2 rounded-xl">
                                        <MapPin size={14} className="text-danger" />
                                        <span className="text-[10px] font-bold text-slate-600">L: {location?.lat?.toFixed(4)}, G: {location?.lng?.toFixed(4)}</span>
                                    </div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nearest Responders</h4>
                                    <div className="hospital-list">
                                        {nearbyHospitals.map((h, i) => (
                                            <div key={i} className="hospital-item">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h5 className="font-black text-slate-800 text-sm">{h.name}</h5>
                                                        <p className="text-[10px] font-bold text-slate-500 uppercase">{h.distance}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button className="bg-primary text-white p-2 rounded-lg"><Navigation size={14} /></button>
                                                        <button className="bg-slate-900 text-white p-2 rounded-lg"><Phone size={14} /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {status === 'active' && (
                            <div className="panel-footer">
                                <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">
                                   Connect to Dispatch
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .sos-main-btn {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    background: var(--danger);
                    color: white;
                    border: none;
                    font-weight: 800;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    box-shadow: 0 0 30px rgba(239, 68, 68, 0.4);
                    transition: all 0.3s;
                    z-index: 10;
                }
                .sos-main-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 50px rgba(239, 68, 68, 0.6);
                }
                .sos-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }
                .sos-content span {
                    font-size: 10px;
                    letter-spacing: 0.1em;
                }
                .pulse-ring {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: var(--danger);
                    border-radius: 50%;
                    animation: sos-pulse 3s infinite;
                    z-index: -1;
                    opacity: 0.5;
                }
                .pulse-ring-inner {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: var(--danger);
                    border-radius: 50%;
                    animation: sos-pulse 3s infinite 1.5s;
                    z-index: -1;
                    opacity: 0.3;
                }
                @keyframes sos-pulse {
                    0% { transform: scale(1); opacity: 0.5; }
                    100% { transform: scale(2); opacity: 0; }
                }

                .sos-active-panel {
                    width: 360px;
                    background: white;
                    border-radius: 2rem;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    padding: 2rem;
                    border: 1px solid var(--border-color);
                }
                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid var(--border-color);
                }
                .hospital-item {
                    background: #f8fafc;
                    padding: 1.25rem;
                    border-radius: 1.5rem;
                    margin-bottom: 1rem;
                    border: 1px solid var(--border-color);
                    transition: all 0.2s;
                }
                .hospital-item:hover {
                    border-color: var(--primary);
                    background: white;
                    box-shadow: var(--shadow-md);
                }
            `}</style>
        </div>
    );
};

export default SOSButton;
