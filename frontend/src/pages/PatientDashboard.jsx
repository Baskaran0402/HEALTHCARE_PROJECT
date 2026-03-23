import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import patientService from '../services/patientService'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Home, FileText, Activity, AlertCircle, ChevronRight, User, Calendar, ShieldCheck, Mail, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AruviAILayout } from '../components/ui/AruviAILayout'
import { 
  ClinicalCard, 
  ClinicalBadge, 
  SectionHeader, 
  StatCard 
} from '../components/ClinicalComponents'

const PatientDashboard = () => {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [patient, setPatient] = useState(null)
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientData, assessmentsData] = await Promise.all([
          patientService.getPatient(patientId),
          patientService.getPatientAssessments(patientId)
        ])
        setPatient(patientData)
        setAssessments(assessmentsData || [])
      } catch (error) {
        console.error("Failed to load dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    if (patientId) {
      fetchData()
    }
  }, [patientId])

  if (loading) return (
     <div className="min-h-screen bg-white flex flex-col items-center justify-center p-24 space-y-6">
        <div className="w-14 h-14 border-4 border-teal-500/10 border-t-teal-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Initializing Subject Analysis...</p>
     </div>
  );
  
  if (!patient) return (
    <AruviAILayout>
      <div className="dashboard-container py-32 text-center">
        <div className="w-24 h-24 rounded-[2.5rem] bg-red-50 flex items-center justify-center mx-auto mb-10 text-red-500 shadow-sm border border-red-100">
           <AlertCircle size={44} />
        </div>
        <h2 className="font-syne font-black text-4xl text-slate-800 mb-6 tracking-tight">Record Not Found.</h2>
        <p className="text-slate-400 text-sm mb-12 max-w-sm mx-auto font-medium leading-relaxed uppercase tracking-widest">The requested clinical transcript could not be located across authorized institutional nodes.</p>
        <button className="h-14 px-10 bg-slate-900 text-teal-400 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-teal-600 hover:text-white transition-all shadow-premium" onClick={() => navigate('/')}>Return to Hub</button>
      </div>
    </AruviAILayout>
  );

  const chartData = assessments.map(a => ({
      date: new Date(a.assessed_at).toLocaleDateString(),
      risk: a.overall_risk_score,
      level: a.overall_risk_level
  })).reverse()

  return (
    <AruviAILayout>
      <div className="dashboard-container">
        <div className="space-y-12 pb-24">
          
          <SectionHeader 
            badge="Subject Profile Analysis"
            title={<>{patient.name}<span className="text-teal-600">.</span></>}
            subtitle={`Institutional ID: ${patient.id} • Clinical Grade: A1-SECURED`}
            actions={
              <div className="flex gap-4">
                <button onClick={() => navigate(`/records/${patientId}`)} className="px-6 py-3.5 bg-white border border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-3 shadow-subtle">
                   Secure Vault <FileText size={16} />
                </button>
                <button onClick={() => navigate('/consultation')} className="px-8 py-3.5 bg-teal-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-teal-700 transition-all flex items-center gap-3 shadow-glow">
                   Perform Assessment <ChevronRight size={16} />
                </button>
              </div>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <ClinicalCard className="flex items-center gap-5 p-8 border-none bg-white shadow-subtle group">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform shadow-sm">
                   <User size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Index Details</p>
                   <p className="text-sm font-black text-slate-800">{patient.age}Y • {patient.gender}</p>
                </div>
             </ClinicalCard>
             <ClinicalCard className="flex items-center gap-5 p-8 border-none bg-white shadow-subtle group">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform shadow-sm">
                   <ShieldCheck size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Clinical MRN</p>
                   <p className="text-sm font-black text-slate-800 tracking-tight">{patient.medical_record_number || 'N/A'}</p>
                </div>
             </ClinicalCard>
             <ClinicalCard className="flex items-center gap-5 p-8 border-none bg-white shadow-subtle group">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform shadow-sm">
                   <Activity size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Recent Risk</p>
                   <p className="text-sm font-black text-slate-800">{assessments[0]?.overall_risk_score || '0'}% Index</p>
                </div>
             </ClinicalCard>
             <ClinicalCard className="flex items-center gap-5 p-8 border-none bg-white shadow-subtle group">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform shadow-sm">
                   <MapPin size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Node Assign</p>
                   <p className="text-sm font-black text-slate-800 tracking-tight">Main Central Hub</p>
                </div>
             </ClinicalCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <ClinicalCard className="p-10">
                  <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                           <Activity size={20} />
                        </div>
                        <h3 className="font-black text-lg text-slate-800 uppercase tracking-tight">Systemic Risk Trend</h3>
                      </div>
                  </div>
                  <div className="h-[300px] w-full min-h-[300px]">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                          <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                              <XAxis dataKey="date" stroke="#94a3b8" tick={{fontSize: 9, fontWeight: 900, textTransform: 'uppercase'}} axisLine={false} tickLine={false} dy={15} />
                              <YAxis stroke="#94a3b8" tick={{fontSize: 9, fontWeight: 900}} domain={[0, 100]} axisLine={false} tickLine={false} />
                              <Tooltip 
                                contentStyle={{ 
                                  borderRadius: '20px', 
                                  border: '1px solid #f1f5f9',
                                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                  backdropFilter: 'blur(8px)',
                                  boxShadow: '0 20px 50px rgba(0,0,0,0.1)', 
                                  fontSize: '10px', 
                                  fontWeight: 900, 
                                  textTransform: 'uppercase', 
                                  letterSpacing: '0.1em' 
                                }}
                              />
                              <Line type="monotone" dataKey="risk" stroke="#0d9488" strokeWidth={5} dot={{ r: 5, fill: '#0d9488', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} name="Risk Velocity" />
                          </LineChart>
                      </ResponsiveContainer>
                  </div>
              </ClinicalCard>

              <ClinicalCard className="p-10">
                  <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                           <FileText size={20} />
                        </div>
                        <h3 className="font-black text-lg text-slate-800 uppercase tracking-tight">Diagnostic Archive</h3>
                      </div>
                      <ClinicalBadge variant="neutral">{assessments.length} Records</ClinicalBadge>
                  </div>
                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                      {assessments.map(a => (
                          <div key={a.id} className="p-6 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] group hover:bg-white hover:border-teal-200 hover:shadow-subtle transition-all duration-300">
                              <div className="flex justify-between items-start mb-4">
                                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                      {new Date(a.assessed_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                  </div>
                                  <ClinicalBadge variant={a.overall_risk_level?.toLowerCase() === 'high' ? 'critical' : 'success'}>
                                      {a.overall_risk_level} • {a.overall_risk_score}%
                                  </ClinicalBadge>
                              </div>
                              <div className="text-[11px] font-bold text-slate-500 leading-relaxed italic pr-10">
                                  "{a.primary_concerns.length > 0 ? a.primary_concerns.join(", ") : "Optimal physiological markers detected."}"
                              </div>
                          </div>
                      ))}
                      {assessments.length === 0 && (
                        <div className="py-20 text-center">
                           <FileText size={40} className="mx-auto text-slate-200 mb-6" />
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] italic">No archival diagnostic data located.</p>
                        </div>
                      )}
                  </div>
              </ClinicalCard>
          </div>

        </div>
      </div>
    </AruviAILayout>
  )
}

export default PatientDashboard;
