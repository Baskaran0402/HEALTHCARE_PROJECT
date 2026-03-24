import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Monitor, Settings, MessageSquare } from 'lucide-react';

export default function VideoConsultPage() {
  const jitsiContainerRef = useRef(null);
  const [jitsiApi, setJitsiApi] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [fallbackRoomId] = useState(() => Math.random().toString(36).substring(7));
  const roomName = React.useMemo(() => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('room') || `AruviAI-Clinical-${fallbackRoomId}`;
  }, [location.search, fallbackRoomId]);

  const startConference = React.useCallback(() => {
    if (!window.JitsiMeetExternalAPI) return;

    const domain = 'meet.jit.si';
    const options = {
      roomName: roomName,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      configOverwrite: {
        startWithAudioMuted: false,
        disableDeepLinking: true,
        enableWelcomePage: false,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
          'fadedbuttons', 'link', 'raisehand', 'videoquality', 'filmstrip',
          'invite', 'feedback', 'stats', 'shortcuts', 'tileview', 'videobackgroundblur',
          'download', 'help', 'mute-everyone', 'security'
        ],
      },
    };

    const api = new window.JitsiMeetExternalAPI(domain, options);
    
    // Fix: "Unrecognized feature: 'speaker-selection'" warning
    api.addEventListener('videoConferenceJoined', () => {
      const iframe = jitsiContainerRef.current?.querySelector('iframe');
      if (iframe) {
        let allow = iframe.getAttribute('allow');
        if (allow && allow.includes('speaker-selection')) {
          iframe.setAttribute('allow', allow.replace(/speaker-selection;?/g, ''));
        }
      }
      setIsJoined(true);
    });

    api.addEventListeners({
      videoConferenceLeft: () => navigate('/dashboard'),
    });

    setJitsiApi(api);
  }, [roomName, navigate]);

  useEffect(() => {
    // Load Jitsi External API script dynamically if not present
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = () => startConference();
    document.body.appendChild(script);

    return () => {
      if (jitsiApi) jitsiApi.dispose();
      document.body.removeChild(script);
    };
  }, [startConference, jitsiApi]);

  const handleEndCall = () => {
    if (jitsiApi) jitsiApi.executeCommand('hangup');
    else navigate('/dashboard');
  };

  return (
    <div className="flex flex-col h-screen bg-[#060d0a] text-white">
      {/* Clinical Header */}
      <header className="px-8 py-4 bg-black/40 border-b border-white/5 flex items-center justify-between backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#0fd68c] flex items-center justify-center shadow-glow">
            <Video size={20} className="text-[#060d0a]" />
          </div>
          <div>
            <h1 className="font-syne font-black text-lg tracking-tight leading-none">Telemedicine Node</h1>
            <p className="text-[10px] font-bold text-[#0fd68c] uppercase tracking-[0.2em] mt-1">E2EE Encrypted Canal: {roomName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isJoined ? 'bg-[#0fd68c] animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              {isJoined ? 'Active Session' : 'Establishing Secure Link...'}
            </span>
          </div>
          <button 
            onClick={handleEndCall}
            className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Terminal Connection
          </button>
        </div>
      </header>

      {/* Main Stream Area */}
      <div className="flex-1 relative overflow-hidden">
        {!isJoined && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#060d0a]">
            <div className="text-center">
              <div className="w-20 h-20 border-4 border-[#0fd68c] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h2 className="font-syne text-2xl font-bold mb-2">Initializing Clinical Uplink</h2>
              <p className="text-white/40 text-sm">Synchronizing encryption keys for end-to-end privacy...</p>
            </div>
          </div>
        )}
        
        <div ref={jitsiContainerRef} className="w-full h-full" />
      </div>

      {/* Control Overlay (Secondary) */}
      <footer className="px-8 py-6 bg-black/60 border-t border-white/5 flex items-center justify-center gap-6 z-20">
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
           <button className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all group">
              <Mic size={20} className="text-white/60 group-hover:text-white" />
           </button>
           <button className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all group">
              <Monitor size={20} className="text-white/60 group-hover:text-white" />
           </button>
           <button className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all group">
              <MessageSquare size={20} className="text-white/60 group-hover:text-white" />
           </button>
           <button className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all group">
              <Settings size={20} className="text-white/60 group-hover:text-white" />
           </button>
        </div>
      </footer>
    </div>
  );
}
