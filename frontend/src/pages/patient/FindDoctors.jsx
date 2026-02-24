import React, { useState, useEffect, useCallback } from 'react';
import { doctorService } from '../../lib/api/doctors';
import { consultationService } from '../../lib/api/consultations';
import LocationSelector from '../../components/patient/LocationSelector';
import SpecialistRecommendations from '../../components/patient/SpecialistRecommendations';
import { Search, MapPin, Star, Filter, Calendar, CheckCircle, Info, Zap, ChevronRight, User } from 'lucide-react';
import './FindDoctors.css';
import Navbar from '../../components/Navbar';

const FindDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);
  const [requestSent, setRequestSent] = useState(false);

  // Mock patient risk for demo purposes
  const patientRisk = 'Heart Disease'; 

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const data = await doctorService.searchDoctors({ specialization });
      setDoctors(data);
    } catch (error) {
      console.error('Failed to fetch doctors', error);
    } finally {
      setLoading(false);
    }
  }, [specialization]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleRequest = async (doctorId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await consultationService.requestConsultation({
        doctor_id: doctorId,
        patient_id: user.id,
        consultation_type: 'chat',
        symptoms: 'Initial health consultation'
      });
      setRequestSent(true);
      setTimeout(() => setRequestSent(false), 3000);
    } catch {
      alert('Failed to send request');
    }
  };

  return (
    <div className="find-doctors-page">
      <Navbar />
      <div className="find-container">
        <header className="page-header">
          <div className="header-text">
            <h1 className="gradient-text">Find Specialists</h1>
            <p>Connect with the top 1% of medical professionals.</p>
          </div>
          
          <div className="search-container">
            <div className="enterprise-search">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Search by specialization (e.g. Cardiologist)..."
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchDoctors()}
              />
              <button onClick={fetchDoctors} className="btn-search">Search</button>
            </div>
          </div>
        </header>

        {requestSent && (
          <div className="success-banner glass">
            <CheckCircle className="text-success" size={20} />
            <span>Consultation Protocol Initiated. Awaiting Practitioner Acceptance.</span>
          </div>
        )}

        <div className="finder-grid">
          <aside className="sidebar-filters">
            <LocationSelector onLocationSelected={(c) => setCoords(c)} />
            
            <div className="smart-match-card">
              <div className="smart-icon-box">
                <Zap size={24} />
              </div>
              <h3>AI Smart Match</h3>
              <p>
                Based on your latest biometrics, our engine recommends a <strong>Cardiologist</strong> for preventive cardiovascular screening.
              </p>
            </div>
          </aside>

          <main className="main-feed-area">
            {coords && (
              <section className="geo-recommendations mb-12">
                <SpecialistRecommendations coords={coords} patientRisk={patientRisk} />
              </section>
            )}

            <div className="feed-header mb-8">
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Available Network</h2>
            </div>

            {loading ? (
              <div className="doctors-feed">
                {[1,2,3,4].map(i => <div key={i} className="doctor-card loading-skeleton"></div>)}
              </div>
            ) : (
              <div className="doctors-feed">
                {doctors.length === 0 ? (
                  <div className="empty-feed glass">
                    <p>No verified practitioners found for this criteria.</p>
                  </div>
                ) : (
                  doctors.map(doctor => (
                    <div key={doctor.id} className="doctor-card">
                      <div className="doc-main-info">
                        {doctor.profile_photo ? (
                          <img src={doctor.profile_photo} alt={doctor.name} className="doc-avatar" />
                        ) : (
                          <div className="doc-avatar"><User size={32} /></div>
                        )}
                        <div className="doc-header-text">
                           <span className="doc-tag">{doctor.specialization}</span>
                           <h3>Dr. {doctor.name}</h3>
                           <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                             <Star size={14} fill="currentColor" /> {doctor.rating || '4.9'}
                           </div>
                        </div>
                      </div>

                      <div className="doc-stats">
                        <div className="doc-stat-item">
                           <MapPin size={16} /> <span>{doctor.hospital_affiliation || 'Clinical Center'}</span>
                        </div>
                        <div className="doc-stat-item">
                           <Calendar size={16} /> <span>{doctor.years_of_experience || 8}+ Years Exp.</span>
                        </div>
                      </div>

                      <div className="doc-price-row">
                        <div className="doc-price-box">
                          <p>Consultation</p>
                          <span className="price">${doctor.consultation_fee || '45.00'}</span>
                        </div>
                        <button onClick={() => handleRequest(doctor.id)} className="btn-book">Book Now</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default FindDoctors;
