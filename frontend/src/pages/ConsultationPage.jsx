import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Activity, User, Heart, ChevronRight, Zap, 
  ShieldCheck, ArrowRight, Database, 
  Dna, Brain, Scale
} from 'lucide-react';
import consultationService from '../services/consultationService';
import { AruviAILayout } from '../components/ui/AruviAILayout';
import { ClinicalCard, ClinicalBadge, ClinicalInput, ClinicalTextArea } from '../components/ClinicalComponents';
import { useToast } from '../components/ui/Toast';
import { useBreakpoint } from '../hooks/useBreakpoint';

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const ConsultationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isMobile } = useBreakpoint();
  const role = location.state?.role || 'Patient';

  const [formData, setFormData] = useState({
    patient_name: '',
    medical_record_number: '',
    age: '',
    gender: 'Male',
    height: '',
    weight: '',
    bmi: '',
    blood_pressure: '',
    blood_glucose: '',
    hba1c: '',
    cholesterol: '',
    hdl_cholesterol: '',
    creatinine: '',
    urea: '',
    bilirubin_total: '',
    alt: '',
    ast: '',
    hypertension: false,
    diabetes: false,
    heart_disease: false,
    kidney_disease: false,
    liver_disease: false,
    family_hypertension: false,
    family_diabetes: false,
    family_heart_disease: false,
    medication_list: '',
    smoking_status: 'never',
    chest_pain: false,
    breathlessness: false,
    fatigue: false,
    edema: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const h = parseFloat(formData.height) / 100;
    const w = parseFloat(formData.weight);
    if (h > 0 && w > 0) {
      const newBmi = (w / (h * h)).toFixed(1);
      if (formData.bmi !== newBmi) {
        setFormData(prev => ({ ...prev, bmi: newBmi }));
      }
    } else if (formData.bmi !== '') {
      setFormData(prev => ({ ...prev, bmi: '' }));
    }
  }, [formData.height, formData.weight, formData.bmi]);

  const getBMICategory = (bmi) => {
    if (!bmi) return '';
    const val = parseFloat(bmi);
    if (val < 18.5) return 'Underweight';
    if (val < 25) return 'Optimal';
    if (val < 30) return 'Overweight';
    return 'Obese';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patient_name || !formData.patient_name.trim()) {
      addToast('Identifier Check Failed: Patient Name is required.', 'error');
      return;
    }
    setLoading(true);

    try {
      const requestData = {
        patient_data: {
          name: formData.patient_name.trim(),
          medical_record_number: formData.medical_record_number || `MRN-${Date.now()}`,
          age: parseInt(formData.age),
          gender: formData.gender,
        },
        medical_data: {
          bmi: parseFloat(formData.bmi) || null,
          blood_pressure: parseInt(formData.blood_pressure) || null,
          blood_glucose: parseFloat(formData.blood_glucose) || null,
          hba1c: parseFloat(formData.hba1c) || null,
          cholesterol: parseFloat(formData.cholesterol) || null,
          creatinine: parseFloat(formData.creatinine) || null,
          hdl_cholesterol: parseFloat(formData.hdl_cholesterol) || null,
          urea: parseFloat(formData.urea) || null,
          bilirubin_total: parseFloat(formData.bilirubin_total) || null,
          alt: parseFloat(formData.alt) || null,
          ast: parseFloat(formData.ast) || null,
          hypertension: formData.hypertension,
          diabetes: formData.diabetes,
          heart_disease: formData.heart_disease,
          kidney_disease: formData.kidney_disease,
          liver_disease: formData.liver_disease,
          medication_history: formData.medication_list ? formData.medication_list.split(',').map(s=>s.trim()) : [],
          family_history: {
            hypertension: formData.family_hypertension,
            diabetes: formData.family_diabetes,
            heart_disease: formData.family_heart_disease,
          },
          lifestyle: {
            smoking: formData.smoking_status,
          },
          symptoms: {
            chest_pain: formData.chest_pain,
            breathlessness: formData.breathlessness,
            fatigue: formData.fatigue,
            edema: formData.edema,
          }
        },
        analysis_config: { 
          complexity: 'high', 
          focus: ['stratification', 'risk_assessment'],
          context: role
        }
      };
      const response = await consultationService.analyzeHealth(requestData);
      
      setTimeout(() => {
        setLoading(false);
        navigate('/results', { state: { 
          result: response, 
          patientData: requestData.patient_data,
          medicalData: requestData.medical_data
        } });
      }, 1000);

    } catch (error) {
      console.error(error);
      setLoading(false);
      addToast("Handshake Failed: Neural engine rejected the diagnostic packet.", "error");
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <AruviAILayout activeTab="Diagnostics">
      <div className={`w-full max-w-7xl mx-auto ${isMobile ? 'px-4' : 'px-8'}`}>
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 md:space-y-12 pb-20">
          
          <motion.div variants={item} className="text-center mb-8 md:mb-16">
            <p className="text-[0.68rem] uppercase tracking-[0.12em] text-[#0fd68c] font-bold mb-3 font-syne">
              CLINICAL PROTOCOL V4.2
            </p>
            <h1 className="font-syne font-black text-2xl md:text-[2.6rem] text-[#0a0a0f] tracking-[-0.03em] leading-[1.05] mb-4">
              High-Precision <span className="text-[#0fd68c]">Diagnostic Link.</span>
            </h1>
            <p className="text-[#0a0a0f]/45 text-sm md:text-base max-w-lg mx-auto leading-relaxed font-dm">
              Initialize a secure session. All telemetry is processed through institutional lattices with end-to-end encryption.
            </p>
          </motion.div>


        <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
          
          {/* Demographics */}
          <motion.section variants={item} className="space-y-6 md:space-y-8">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-teal-600">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                <User size={18} className="text-teal-600" />
              </div>
              <h2 className="text-lg md:text-2xl font-bold text-slate-900 font-display">Institutional Identity</h2>
            </div>
            <ClinicalCard>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <ClinicalInput label="Subject Identifier / Full Name" name="patient_name" placeholder="Jane Doe" value={formData.patient_name} onChange={handleChange} required />
                <ClinicalInput label="Medical Record Number" name="medical_record_number" placeholder="Institutional ID" value={formData.medical_record_number} onChange={handleChange} />
                <ClinicalInput label="Subject Age" name="age" type="number" placeholder="45" value={formData.age} onChange={handleChange} required />
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Gender Context</label>
                  <div className="flex gap-2 md:gap-3 mt-1">
                    {['Male', 'Female', 'Other'].map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData(p => ({...p, gender: g}))}
                        className={`flex-1 py-3 md:py-4 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all cursor-pointer border-none ${
                          formData.gender === g
                            ? 'bg-teal-600 text-white shadow-glow'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </ClinicalCard>
          </motion.section>

          {/* Biometrics */}
          <motion.section variants={item} className="space-y-6 md:space-y-8">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-teal-600">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                <Activity size={18} className="text-teal-600" />
              </div>
              <h2 className="text-lg md:text-2xl font-bold text-slate-900 font-display">Biometric Vectors</h2>
            </div>
            <ClinicalCard>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <ClinicalInput label="Height (cm)" name="height" type="number" placeholder="175" value={formData.height} onChange={handleChange} />
                <ClinicalInput label="Weight (kg)" name="weight" type="number" placeholder="70" value={formData.weight} onChange={handleChange} />
                <div className="relative">
                  <ClinicalInput label="Neural BMI" name="bmi" value={formData.bmi} readOnly placeholder="Automated" />
                  {formData.bmi && (
                    <div className="absolute right-3 top-10">
                      <ClinicalBadge variant="primary">{getBMICategory(formData.bmi)}</ClinicalBadge>
                    </div>
                  )}
                </div>
                <ClinicalInput label="Sys. BP (mmHg)" name="blood_pressure" type="number" placeholder="120" value={formData.blood_pressure} onChange={handleChange} />
                <ClinicalInput label="Glucose (mg/dL)" name="blood_glucose" type="number" placeholder="100" value={formData.blood_glucose} onChange={handleChange} />
                <ClinicalInput label="HbA1c (%)" name="hba1c" type="number" step="0.1" placeholder="5.7" value={formData.hba1c} onChange={handleChange} />
              </div>
            </ClinicalCard>
          </motion.section>

          {/* Organ Function */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <motion.section variants={item} className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-3 pb-3 border-b-2 border-teal-600">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                  <Database size={18} className="text-teal-600" />
                </div>
                <h2 className="text-lg md:text-2xl font-bold text-slate-900 font-display">Renal & Liver</h2>
              </div>
              <ClinicalCard>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ClinicalInput label="Creatinine (mg/dL)" name="creatinine" type="number" step="0.01" placeholder="1.0" value={formData.creatinine} onChange={handleChange} />
                  <ClinicalInput label="Urea (mg/dL)" name="urea" type="number" placeholder="30" value={formData.urea} onChange={handleChange} />
                  <ClinicalInput label="ALT (U/L)" name="alt" type="number" placeholder="35" value={formData.alt} onChange={handleChange} />
                  <ClinicalInput label="AST (U/L)" name="ast" type="number" placeholder="30" value={formData.ast} onChange={handleChange} />
                </div>
              </ClinicalCard>
            </motion.section>

            <motion.section variants={item} className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-3 pb-3 border-b-2 border-teal-600">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                  <Heart size={18} className="text-teal-600" />
                </div>
                <h2 className="text-lg md:text-2xl font-bold text-slate-900 font-display">Lipid Profile</h2>
              </div>
              <ClinicalCard>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ClinicalInput label="Total Cholesterol (mg/dL)" name="cholesterol" type="number" placeholder="180" value={formData.cholesterol} onChange={handleChange} />
                  <ClinicalInput label="HDL Cholesterol (mg/dL)" name="hdl_cholesterol" type="number" placeholder="50" value={formData.hdl_cholesterol} onChange={handleChange} />
                </div>
              </ClinicalCard>
            </motion.section>
          </div>

          {/* Pathology Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <motion.section variants={item} className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-3 pb-3 border-b-2 border-teal-600">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                  <Scale size={18} className="text-teal-600" />
                </div>
                <h2 className="text-lg md:text-2xl font-bold text-slate-900 font-display">Pathology Matrix</h2>
              </div>
              <ClinicalCard className="h-full">
                <div className="space-y-3">
                  {[
                    { name: 'hypertension', label: 'Hypertension Detected' },
                    { name: 'diabetes', label: 'Diabetes Indicators' },
                    { name: 'heart_disease', label: 'Cardiac Anomalies' },
                    { name: 'kidney_disease', label: 'Kidney Dysfunction' },
                    { name: 'liver_disease', label: 'Liver Pathology' },
                  ].map(itm => (
                    <label key={itm.name} className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${
                      formData[itm.name] ? 'bg-teal-50 border-teal-200' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-200'
                    }`}>
                      <span className={`text-[13px] md:text-sm font-bold ${formData[itm.name] ? 'text-teal-700' : 'text-slate-500'}`}>{itm.label}</span>
                      <input 
                        type="checkbox" 
                        name={itm.name} 
                        checked={formData[itm.name]} 
                        onChange={handleChange}
                        className="w-5 h-5 accent-teal-600 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </ClinicalCard>
            </motion.section>

            <motion.section variants={item} className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-3 pb-3 border-b-2 border-teal-600">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                  <Dna size={18} className="text-teal-600" />
                </div>
                <h2 className="text-lg md:text-2xl font-bold text-slate-900 font-display">Genetic Lattice</h2>
              </div>
              <ClinicalCard className="h-full">
                <div className="space-y-3">
                  {[
                    { name: 'family_hypertension', label: 'Heritable Hypertension' },
                    { name: 'family_diabetes', label: 'Heritable Diabetes' },
                    { name: 'family_heart_disease', label: 'Heritable Cardiac' },
                  ].map(itm => (
                    <label key={itm.name} className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${
                      formData[itm.name] ? 'bg-teal-50 border-teal-200' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-200'
                    }`}>
                      <span className={`text-[13px] md:text-sm font-bold ${formData[itm.name] ? 'text-teal-700' : 'text-slate-500'}`}>{itm.label}</span>
                      <input 
                        type="checkbox" 
                        name={itm.name} 
                        checked={formData[itm.name]} 
                        onChange={handleChange}
                        className="w-5 h-5 accent-teal-600 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </ClinicalCard>
            </motion.section>
          </div>

          {/* Medications */}
          <motion.section variants={item} className="space-y-6 md:space-y-8">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-teal-600">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                <Brain size={18} className="text-teal-600" />
              </div>
              <h2 className="text-lg md:text-2xl font-bold text-slate-900 font-display">Clinical Context</h2>
            </div>
            <ClinicalCard>
              <ClinicalTextArea 
                label="Active Pharmacopeia (Comma separated)" 
                name="medication_list" 
                placeholder="Aspirin, Metformin, Atorvastatin..." 
                value={formData.medication_list} 
                onChange={handleChange} 
              />
            </ClinicalCard>
          </motion.section>

          {/* Submit */}
          <motion.div variants={item} className="pt-10 md:pt-20 flex flex-col items-center gap-6 md:gap-8 border-t border-slate-100 mb-20">
            <div className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 bg-slate-50 rounded-full border border-slate-100">
              <ShieldCheck size={14} className="text-teal-600" />
              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Subject Telemetry Encryption V2 Active</span>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full max-w-lg h-16 md:h-20 bg-slate-900 group hover:bg-teal-600 transition-all duration-500 rounded-2xl md:rounded-[2rem] flex items-center justify-center gap-4 md:gap-6 shadow-premium disabled:opacity-50 disabled:grayscale cursor-pointer border-none"
            >
              {loading ? (
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 md:w-6 md:h-6 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
                  <span className="text-teal-400 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em]">Stratifying...</span>
                </div>
              ) : (
                <>
                  <span className="text-teal-400 group-hover:text-white font-black text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] transition-colors">Execute Diagnostic Protocol</span>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 group-hover:bg-white group-hover:text-teal-600 transition-all">
                    <Save size={18} />
                  </div>
                </>
              )}
            </button>
            <p className="text-[8px] md:text-[9px] font-bold text-slate-300 uppercase tracking-widest italic text-center px-4">Proceeding confirms institutional consent for AI-augmented screening.</p>
          </motion.div>
        </form>
      </motion.div>
      </div>
    </AruviAILayout>
  );
};

export default ConsultationPage;
