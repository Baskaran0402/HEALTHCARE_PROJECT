import React, { useState } from 'react';
import { MapPin, Navigation, Search, CheckCircle, ShieldCheck, Map, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { GlassInput } from '../ui/GlassInput';

const LocationSelector = ({ onLocationSelected }) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState('');

  const getCurrentLocation = () => {
    setLoading(true);
    setStatus('Synchronizing Geodata...');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lng: longitude });
          setLoading(false);
          setStatus('Coordinates Locked');
          if (onLocationSelected) onLocationSelected({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting location', error);
          setLoading(false);
          setStatus('Geofence Error');
        }
      );
    } else {
      setStatus('Geolocation Incompatible');
      setLoading(false);
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('Mapping Workspace...');
    setTimeout(() => {
      const mockCoords = { lat: 12.9716, lng: 77.5946 };
      setCoords(mockCoords);
      setLoading(false);
      setStatus(`Target: ${address ? address.substring(0, 15) + '...' : 'Clinical Center'}`);
      if (onLocationSelected) onLocationSelected(mockCoords);
    }, 1200);
  };

  return (
    <GlassCard variant="elevated" padding="lg" className="border-white/10 group relative overflow-hidden bg-gradient-to-br from-blue-500/5 to-transparent">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 p-8 opacity-5">
         <Map size={100} className="text-white" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
             <MapPin size={20}/>
          </div>
          <div>
             <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Geo Node</h3>
             <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 mt-1">Network Identification</p>
          </div>
        </div>

        <div className="space-y-6">
          <GlassButton 
            onClick={getCurrentLocation}
            disabled={loading}
            fullWidth
            variant="primary"
            size="sm"
            className="rounded-2xl py-6 gap-3 shadow-[0_0_20px_rgba(37,99,235,0.2)] bg-blue-600/10 border-blue-500/20 hover:bg-blue-600/20"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Navigation size={16}/>
            )}
            Establish Current Coord.
          </GlassButton>

          <div className="relative flex flex-col gap-4">
             <div className="flex items-center gap-2 mb-2 px-2">
                <div className="w-px h-2 bg-white/20" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Manual Override</span>
             </div>
             <form onSubmit={handleManualSearch} className="w-full relative">
                 <GlassInput 
                    type="text" 
                    placeholder="Search Clinical Node..."
                    className="w-full pl-12 pr-4 h-14 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black tracking-widest uppercase placeholder:text-white/20"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    icon={<Search size={16} className="text-white/30" />}
                 />
                 <button type="submit" className="absolute right-3 top-3 w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/30 hover:text-white transition-all">
                    <ChevronRight size={14} />
                 </button>
             </form>
          </div>

          <AnimatePresence>
            {status && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/2 border border-white/5 ${status.includes('Error') ? 'text-red-400' : 'text-blue-400'}`}
                >
                    <div className={`w-2 h-2 rounded-full animate-pulse ${status.includes('Error') ? 'bg-red-500 shadow-red-500/50' : 'bg-blue-500 shadow-blue-500/50'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{status}</span>
                    {coords && <ShieldCheck size={14} className="ml-auto opacity-40" />}
                </motion.div>
            )}
          </AnimatePresence>

          {coords && (
             <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0A0E27]/40 p-5 rounded-2xl border border-white/5 backdrop-blur-md relative group/coord"
             >
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Telemetry Matrix</span>
                    <History size={12} className="text-white/20 hover:text-white cursor-pointer transition-colors" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black text-white/20 uppercase mb-1">LATITUDE</span>
                       <span className="text-xs font-black text-white tracking-widest">{coords.lat.toFixed(6)}</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black text-white/20 uppercase mb-1">LONGITUDE</span>
                       <span className="text-xs font-black text-white tracking-widest">{coords.lng.toFixed(6)}</span>
                    </div>
                 </div>
                 <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/coord:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
             </motion.div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default LocationSelector;

const ChevronRight = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
