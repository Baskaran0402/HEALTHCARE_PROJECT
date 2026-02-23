import React, { useState, useEffect } from 'react';
import { Calendar, Video, Clock, CreditCard, ChevronRight, Activity, Bell, MoreVertical } from 'lucide-react';
import PrescriptionView from './PrescriptionView';
import SOSButton from '../emergency/SOSButton';

const patientDashboard = ({ user }) => {
    // Mock data for demo
    const appointments = [
        {
            id: 'apt-1',
            doctor_name: 'Arjun Reddy',
            specialization: 'Cardiologist',
            time: 'Today, 2:30 PM',
            type: 'video',
            status: 'ready',
            meeting_link: 'https://meet.jit.si/AIDoc-ArjunReddy',
            fee: 50.00
        },
        {
            id: 'apt-2',
            doctor_name: 'Sarah Williams',
            specialization: 'Neurologist',
            time: 'Tomorrow, 10:00 AM',
            type: 'in-person',
            status: 'scheduled',
            fee: 65.00
        }
    ];

    const [selectedPrescription, setSelectedPrescription] = useState({
        id: 'RX-99281',
        doctor_name: 'Arjun Reddy',
        created_at: new Date().toISOString(),
        medicines: [
            { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily (Night)', duration: '30 Days' },
            { name: 'Aspirin', dosage: '75mg', frequency: 'After breakfast', duration: '90 Days' }
        ],
        notes: 'Patient shows signs of elevated LDL. Monitor cardiovascular activity closely and report any chest tightness immediately.',
        digital_signature: 'sha256:8f4c2e1a9d3b5c7e4f6a8b0d2c4e6f8a'
    });

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-slate-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center text-white font-black">AI</div>
                    <h1 className="text-xl font-black uppercase tracking-tight text-slate-800">CarePortal <span className="text-blue-600">Pro</span></h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                        <Activity size={16} className="text-blue-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Vitals Connected</span>
                    </div>
                    <button className="text-slate-400 hover:text-slate-900 transition-colors">
                        <Bell size={20} />
                    </button>
                    <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold uppercase overflow-hidden ring-4 ring-slate-100">
                        {user?.username?.substring(0,2) || 'JD'}
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Appointments & Stats */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Welcome Section */}
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200 border border-slate-50 flex justify-between items-center overflow-hidden relative">
                        <div className="relative z-10">
                            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">Hello, {user?.username || 'Patient'}</h2>
                            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">You have <span className="text-blue-600 underline">1 video consultation</span> starting soon.</p>
                        </div>
                        <div className="z-10 bg-slate-900 p-6 rounded-3xl text-white text-center shadow-2xl">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Queue ID</p>
                            <p className="text-3xl font-black">#042</p>
                        </div>
                        {/* Abstract Background Element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-20 -mt-20 opacity-50"></div>
                    </div>

                    {/* Active Appointments */}
                    <section className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Upcoming Consultations</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {appointments.map(apt => (
                                <div key={apt.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row justify-between items-center group">
                                    <div className="flex gap-6 items-center">
                                        <div className="bg-slate-50 w-20 h-20 rounded-2xl flex items-center justify-center text-blue-600 ring-4 ring-white shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            {apt.type === 'video' ? <Video size={32} /> : <Calendar size={32} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest">{apt.specialization}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${apt.status === 'ready' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                                    {apt.status}
                                                </span>
                                            </div>
                                            <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">Dr. {apt.doctor_name}</h4>
                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="flex items-center gap-1 text-slate-500 font-bold text-xs">
                                                    <Clock size={12} />
                                                    {apt.time}
                                                </div>
                                                <div className="flex items-center gap-1 text-slate-500 font-bold text-xs uppercase">
                                                    <CreditCard size={12} />
                                                    ${apt.fee} • PAID
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 md:mt-0 flex gap-3">
                                        {apt.status === 'ready' && (
                                            <button 
                                                onClick={() => window.open(apt.meeting_link, '_blank')}
                                                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
                                            >
                                                Enter Private Call
                                            </button>
                                        )}
                                        <button className="bg-slate-50 text-slate-400 p-4 rounded-2xl hover:bg-slate-100 transition-all">
                                            <MoreVertical size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Prescription Section */}
                    {selectedPrescription && (
                        <section className="animate-in fade-in duration-700">
                             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-4">Latest Active Prescription</h3>
                             <PrescriptionView prescription={selectedPrescription} />
                        </section>
                    )}
                </div>

                {/* Right Column: Health Trends & SOS */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Emergency Section */}
                    <div className="bg-gradient-to-br from-red-600 to-red-800 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10 space-y-4">
                            <h3 className="text-2xl font-black uppercase tracking-tight">Panic Response</h3>
                            <p className="text-red-100 text-xs font-medium leading-relaxed opacity-80">Press for immediate rescue, location sharing, and ambulance routing.</p>
                            <div className="flex justify-center pt-4">
                                <SOSButton patientId={user?.id || 'demo-pat'} />
                            </div>
                        </div>
                        {/* Decorative circle */}
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full -mb-24 -mr-24 blur-3xl"></div>
                    </div>

                    {/* Health Assessment Quick Glance */}
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-black uppercase tracking-tight text-lg">Health Status</h3>
                            <span className="bg-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">Stabled</span>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Blood Glucose</p>
                                    <p className="text-3xl font-black">105 <span className="text-xs text-slate-600">mg/dL</span></p>
                                </div>
                                <div className="h-2 w-24 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-[60%] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SpO2 Level</p>
                                    <p className="text-3xl font-black">98 <span className="text-xs text-slate-600">%</span></p>
                                </div>
                                <div className="h-2 w-24 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[98%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-4 bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/5">
                            Full Health Report
                        </button>
                    </div>

                    {/* App Features Tip */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                        <div className="bg-amber-100 w-12 h-12 rounded-2xl flex items-center justify-center text-amber-600">
                             <CreditCard size={24} />
                        </div>
                        <h4 className="font-black text-slate-800 uppercase text-xs tracking-tight leading-4">Clearance Insurance Processing</h4>
                        <p className="text-slate-400 text-[10px] font-bold leading-relaxed">Your policy #SVCE-4482 is currently active for all outpatient services.</p>
                        <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-1 group">
                             Manage Policy <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default patientDashboard;
