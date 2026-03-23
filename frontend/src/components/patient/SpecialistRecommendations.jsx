import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, ArrowRight, ShieldCheck, Activity, Info, Zap, User, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import doctorService from '../../services/doctorService';

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
        const data = await doctorService.getNearbyDoctors(coords.lat, coords.lng, 25, recommendedSpec);
        setRecommendations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch nearby doctors', err);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNearby();
  }, [coords, recommendedSpec]);

  if (!coords) return null;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h3 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
             <Activity className="text-blue-500" size={28}/>
             Nearby Specialist Recommendations
           </h3>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mt-1">Top verified experts within 25km of your location</p>
        </div>
        
        {recommendedSpec && (
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="px-6 py-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-3 shadow-[0_0_20px_rgba(59,130,246,0.1)] relative group"
            >
                <div className="absolute inset-0 bg-blue-500/5 blur-[20px] rounded-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none" />
                <ShieldCheck size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">AI Target: {recommendedSpec}</span>
            </motion.div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1,2].map(i => (
                <div key={i} className="h-64 bg-white/5 border border-white/5 animate-pulse rounded-[2.5rem]"></div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {recommendations.length === 0 ? (
             <GlassCard padding="lg" variant="elevated" className="col-span-full border-dashed border-white/10 text-center py-20 bg-white/2">
                <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 mx-auto mb-6">
                   <Info size={32} />
                </div>
                <h4 className="text-xl font-black text-white/60 mb-2 uppercase tracking-tighter">No Specialized Data Found</h4>
                <p className="text-[10px] font-black text-white/20 max-w-sm mx-auto uppercase tracking-widest leading-loose">
                   No specific specialized nodes found within a 25km radius. Expand search parameters or contact clinical operations.
                </p>
                <GlassButton variant="ghost" className="mt-8 text-[10px] font-black uppercase tracking-widest">Global Provider View</GlassButton>
             </GlassCard>
          ) : (
            recommendations.map((doctor, i) => (
              <DoctorInsightCard 
                key={doctor.id} 
                doctor={doctor} 
                index={i}
                onSelect={() => navigate(`/doctor/${doctor.id}`)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

const DoctorInsightCard = ({ doctor, index, onSelect }) => (
   <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
      onClick={onSelect}
   >
      <GlassCard 
         padding="lg" 
         variant="interactive" 
         className="border-white/10 relative overflow-hidden h-full flex flex-col group-hover:bg-white/5 transition-all duration-500 rounded-[2.5rem]"
      >
         <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShieldCheck size={120} className="text-white" />
         </div>

         <div className="flex justify-between items-start mb-10 relative z-10">
            <div className="flex gap-6 items-center">
               <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-tr from-blue-500/20 to-indigo-500/10 border border-white/10 flex items-center justify-center text-white text-3xl font-black p-4 group-hover:scale-110 transition-transform duration-500 shadow-xl overflow-hidden">
                  {doctor.profile_photo ? (
                    <img src={doctor.profile_photo} alt={doctor.name} className="w-full h-full object-cover" />
                  ) : (
                    doctor.name.substring(0, 2).toUpperCase()
                  )}
               </div>
               <div>
                  <div className="flex items-center gap-2 mb-2">
                     <span className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[9px] font-black text-blue-400 uppercase tracking-widest leading-none">
                        {doctor.specialization}
                     </span>
                     <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[9px] font-black text-amber-500 uppercase tracking-widest leading-none">
                        <Star size={10} fill="currentColor" />
                        {doctor.rating || '4.9'}
                     </div>
                  </div>
                  <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-blue-400 transition-colors">Dr. {doctor.name}</h4>
                  <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mt-2">
                     {doctor.years_of_experience || 8}+ Years Professional Tenure
                  </div>
               </div>
            </div>
            
            <div className="text-right">
               <span className="text-[9px] font-black text-white/10 uppercase tracking-widest block mb-1 leading-none">Distance</span>
               <div className="text-2xl font-black text-white tracking-tighter leading-none flex items-center justify-end gap-1">
                  {doctor.distance ? doctor.distance.toFixed(1) : '0.0'}
                  <span className="text-[10px] text-white/20 uppercase tracking-widest mt-1 ml-0.5">km</span>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-white/5 relative z-10">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/30 group-hover:text-white transition-colors">
                  <MapPin size={14} />
               </div>
               <div className="min-w-0">
                  <span className="text-[8px] font-black text-white/20 uppercase tracking-widest block mb-1">Affiliation</span>
                  <span className="text-[10px] font-bold text-white/60 uppercase truncate block">{doctor.hospital_affiliation || 'Clinical Network'}</span>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/30 group-hover:text-white transition-colors">
                  <Clock size={14} />
               </div>
               <div className="min-w-0">
                  <span className="text-[8px] font-black text-white/20 uppercase tracking-widest block mb-1">Uplink Status</span>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase truncate block">Available Tomorrow</span>
               </div>
            </div>
         </div>

         <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
            <div>
               <span className="text-[9px] font-black text-white/10 uppercase tracking-widest block mb-1">Consultation Protocol</span>
               <div className="text-3xl font-black text-white tracking-tighter flex items-center gap-1 leading-none">
                  <span className="text-lg opacity-40">$</span>
                  {doctor.consultation_fee || '45.00'}
               </div>
            </div>
            <button className="flex items-center gap-3 px-8 py-4 rounded-[1.5rem] bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-blue-500/60 hover:scale-105 transition-all active:scale-95 group/btn">
               Establish Node Link
               <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
         </div>
      </GlassCard>
   </motion.div>
);

export default SpecialistRecommendations;
