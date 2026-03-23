import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Globe, Activity, Star, 
  MapPin, Clock, ArrowRight, ShieldCheck, 
  Cpu, Database, Layers, CheckCircle2,
  Users, User, Calendar, Check
} from 'lucide-react';
import doctorService from '../../services/doctorService';
import consultationService from '../../services/consultationService';
import { AruviAILayout } from '../../components/ui/AruviAILayout';
import { Card, Badge } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const FindDoctors = () => {
  const location = useLocation();
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState(location.state?.filter || '');
  const [loading, setLoading] = useState(false);
  const [requestingId, setRequestingId] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState({}); // { doctorId: slotIndex }
  const { addToast } = useToast();
  const { isMobile } = useBreakpoint();

  // Generate some mock slots for the next 2 days
  const getMockSlots = (docId) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const slots = [
      { day: 'Today', time: '10:30 AM', date: today },
      { day: 'Today', time: '02:00 PM', date: today },
      { day: 'Tomorrow', time: '09:15 AM', date: tomorrow },
      { day: 'Tomorrow', time: '11:45 AM', date: tomorrow }
    ];
    return slots;
  };

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const data = await doctorService.searchDoctors({ specialization });
      const enhancedData = (Array.isArray(data) ? data : []).map(doc => ({
        ...doc,
        fee: doc.fee || (Math.floor(Math.random() * (1500 - 600 + 1)) + 600),
        slots: getMockSlots(doc.id)
      }));
      const uniqueData = enhancedData.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
      setDoctors(uniqueData);
    } catch (error) {
      console.error('Failed to fetch specialists', error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [specialization]);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  useEffect(() => {
    if (location.state?.filter) {
      setSpecialization(location.state.filter);
    }
  }, [location.state]);

  const handleBook = async (doc) => {
    const slotIdx = selectedSlots[doc.id];
    if (slotIdx === undefined) {
      addToast("Please select a time slot first.", "warning");
      return;
    }

    const slot = doc.slots[slotIdx];
    setRequestingId(doc.id);
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      // Calculate actual date object for booking
      const bookingDate = new Date(slot.date);
      const [time, modifier] = slot.time.split(' ');
      let [hours, minutes] = time.split(':');
      if (modifier === 'PM' && hours !== '12') hours = parseInt(hours) + 12;
      if (modifier === 'AM' && hours === '12') hours = '00';
      bookingDate.setHours(hours, minutes, 0, 0);

      await consultationService.requestConsultation({
        doctor_id: doc.id,
        patient_id: user?.id || 'guest',
        consultation_type: 'video',
        symptoms: 'Scheduled Specialist Consultation',
        scheduled_for: bookingDate.toISOString()
      });

      addToast(`Appointment requested with Dr. ${doc.name} for ${slot.day} at ${slot.time}.`, "success");
      
      // In a real app, we'd navigate to a 'My Appointments' page
      // Here we'll just show success state
      setSelectedSlots(prev => {
        const next = {...prev};
        delete next[doc.id];
        return next;
      });
    } catch (error) {
       addToast("Booking failed: Network congestion or Node error.", "error");
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <AruviAILayout activeTab="Nodes">
      <div className={`w-full max-w-7xl mx-auto ${isMobile ? 'px-4' : 'px-8'}`}>
        <div className="space-y-8 md:space-y-12 pb-20 pt-6 md:pt-10">
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-4 md:mb-10 border-b border-[#e8ede9] pb-8">
             <div className="text-center lg:text-left w-full lg:w-auto">
                <p className="text-[11px] md:text-[0.65rem] uppercase tracking-[0.15em] text-[#0fd68c] font-black mb-2 font-syne">
                  REGISTRY DISCOVERY
                </p>
                <h1 className="font-syne font-black text-2xl md:text-4xl text-[#0a0a0f] tracking-[-0.04em] leading-tight mb-2">
                  Specialist <span className="text-[#0fd68c]">Nodes.</span>
                </h1>
                <p className="text-[#0a0a0f]/40 text-sm font-bold font-dm max-w-lg mx-auto lg:mx-0">
                   Schedule institutional consultations with clinical specialists across the decentralized network.
                </p>
             </div>
             
             <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                <div className="relative w-full sm:flex-1 lg:w-72">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718096]" size={16} />
                   <input 
                     type="text" 
                     placeholder="Search specialty nodes..."
                     className="w-full bg-white border border-[#e8ede9] rounded-xl py-3 pl-11 pr-4 text-sm font-bold focus:border-[#0fd68c] focus:ring-4 focus:ring-[#0fd68c]/5 outline-none shadow-subtle transition-all text-[#0a0a0f]"
                     value={specialization}
                     onChange={(e) => setSpecialization(e.target.value)}
                   />
                </div>
                <Button variant="secondary" icon={Filter} className="w-full sm:w-auto h-12 text-[10px] uppercase tracking-widest font-black shadow-subtle">Filter</Button>
             </div>
          </div>

        <div className="flex items-center gap-3 pb-6 border-b border-gray-100 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
           {['All Nodes', 'Endocrinology', 'Nephrology', 'Cardiology', 'Neurology', 'Oncology'].map((f, i) => (
              <button 
                key={i}
                onClick={() => setSpecialization(f === 'All Nodes' ? '' : f)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-none ${
                  (specialization === f || (f === 'All Nodes' && !specialization)) 
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' 
                    : 'bg-white border border-gray-200 text-gray-400 hover:border-teal-300 hover:text-teal-600'
                }`}
              >
                 {f}
              </button>
           ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
             {[1,2,3].map(n => <div key={n} className="h-[500px] rounded-[2.5rem] bg-gray-50 animate-pulse border border-slate-100" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
             {doctors.map((doc, idx) => (
               <motion.div key={doc.id || idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                 <Card noPadding className="h-full flex flex-col group hover:shadow-premium hover:-translate-y-1.5 transition-all border-[#e8ede9] bg-white overflow-hidden">
                    <div className="h-24 md:h-28 bg-slate-50 relative group-hover:bg-teal-50/30 transition-colors">
                       <div className="absolute inset-0 opacity-10 bg-teal-600 blur-3xl" />
                       <div className="absolute bottom-4 left-6"><Badge variant="primary" className="bg-white/80 font-black text-[9px] uppercase tracking-widest border-[#0fd68c]/20">{doc.specialization}</Badge></div>
                    </div>
                    <div className="p-6 md:p-7 flex-1 flex flex-col gap-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 font-black text-lg border-2 border-white shadow-sm">{doc.name?.substring(0, 2).toUpperCase()}</div>
                          <div>
                             <h3 className="font-black text-slate-900 group-hover:text-teal-700 transition-colors">Dr. {doc.name}</h3>
                             <div className="flex items-center gap-1 text-amber-500"><Star size={12} fill="currentColor" /><span className="text-[11px] text-slate-900 font-bold ml-1">4.9 / 5.0</span></div>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                               <Calendar size={12} /> Select Availability
                            </h4>
                            <span className="text-teal-700 font-black text-xs">₹{doc.fee}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                             {doc.slots.map((slot, sIdx) => (
                               <button 
                                 key={sIdx}
                                 onClick={() => setSelectedSlots(prev => ({...prev, [doc.id]: sIdx}))}
                                 className={`py-2 px-3 rounded-xl border text-[10px] font-black uppercase tracking-tight transition-all flex flex-col items-center justify-center gap-0.5 ${
                                   selectedSlots[doc.id] === sIdx
                                     ? 'bg-teal-600 border-teal-600 text-white shadow-md'
                                     : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-teal-300'
                                 }`}
                               >
                                  <span className="opacity-60">{slot.day}</span>
                                  <span>{slot.time}</span>
                               </button>
                             ))}
                          </div>
                       </div>

                       <div className="flex flex-col gap-2.5 py-4 border-t border-slate-50 mt-auto">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><MapPin size={14} className="text-teal-500" /> {doc.hospital_affiliation || 'Institutional Node'}</div>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Clock size={14} className="text-teal-500" /> {doc.years_of_experience}+ Years Active Duty</div>
                       </div>

                       <Button 
                         variant="primary" 
                         size="lg" 
                         className="w-full text-[10px] uppercase font-black tracking-[0.15em] py-4 shadow-glow" 
                         isLoading={requestingId === doc.id}
                         icon={selectedSlots[doc.id] !== undefined ? Check : null}
                         onClick={() => handleBook(doc)}
                       >
                         {selectedSlots[doc.id] !== undefined ? 'Confirm Booking' : 'Select Slot to Schedule'}
                       </Button>
                    </div>
                 </Card>
               </motion.div>
             ))}
             {doctors.length === 0 && !loading && (
                <div className="col-span-full py-20 text-center">
                   <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Users size={32} className="text-slate-200" />
                   </div>
                   <h3 className="text-xl font-black text-slate-900 mb-2">No Active Nodes Found</h3>
                   <p className="text-sm font-bold text-slate-400 max-w-sm mx-auto">Try broadening your search or switching specialization filters.</p>
                </div>
             )}
          </div>
        )}
      </div>
      </div>
    </AruviAILayout>
  );
};

export default FindDoctors;
