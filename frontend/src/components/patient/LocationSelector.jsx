import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, CheckCircle } from 'lucide-react';

const LocationSelector = ({ onLocationSelected }) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState('');

  const getCurrentLocation = () => {
    setLoading(true);
    setStatus('Detecting your location...');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lng: longitude });
          setLoading(false);
          setStatus('Location detected!');
          if (onLocationSelected) onLocationSelected({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting location', error);
          setLoading(false);
          setStatus('Failed to detect location. Please enter manually.');
        }
      );
    } else {
      setStatus('Geolocation not supported by your browser.');
      setLoading(false);
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    // This would ideally call a Geocoding API (Google/Mapbox)
    // For demo, we'll mock a coordinate for a few cities
    setStatus('Searching address...');
    setTimeout(() => {
      const mockCoords = { lat: 12.9716, lng: 77.5946 }; // Bangalore
      setCoords(mockCoords);
      setStatus(`Using: ${address}`);
      if (onLocationSelected) onLocationSelected(mockCoords);
    }, 1000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <MapPin size={20} className="text-blue-600"/>
        <h3 className="text-lg font-bold text-slate-800">Your Location</h3>
      </div>

      <div className="space-y-4">
        <button 
          onClick={getCurrentLocation}
          disabled={loading}
          className="w-full py-3 bg-blue-50 text-blue-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-all border border-blue-100"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Navigation size={18}/>
          )}
          Use Current Location
        </button>

        <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={16}/>
            </div>
            <form onSubmit={handleManualSearch} className="w-full">
                <input 
                    type="text" 
                    placeholder="Enter city or area..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </form>
        </div>

        {status && (
            <div className={`text-xs font-bold flex items-center gap-1.5 ${status.includes('Failed') ? 'text-red-500' : 'text-green-600'}`}>
                {status.includes('detected') || status.includes('Using') ? <CheckCircle size={14}/> : null}
                {status}
            </div>
        )}

        {coords && (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">Coordinates</p>
                <p className="text-xs font-mono text-slate-600 font-bold">
                    {coords.lat.toFixed(4)}°, {coords.lng.toFixed(4)}°
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default LocationSelector;
