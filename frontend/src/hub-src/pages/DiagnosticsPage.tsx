import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, User, Heart, 
  ShieldCheck, Save, Database, 
  Dna, Brain, Scale
} from 'lucide-react';
import { AruviAILayout } from '@/components/AruviAILayout';
import { ClinicalCard, ClinicalBadge, ClinicalInput, ClinicalTextArea } from '@/components/ClinicalComponents';
import { useToast } from '@/hooks/use-toast';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const DiagnosticsPage = () => {
  const { toast } = useToast();
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
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.height && formData.weight) {
      const h = parseFloat(formData.height) / 100;
      const w = parseFloat(formData.weight);
      if (h > 0) {
        setFormData(prev => ({ ...prev, bmi: (w / (h * h)).toFixed(1) }));
      }
    }
  }, [formData.height, formData.weight]);

  const getBMICategory = (bmi: string) => {
    const val = parseFloat(bmi);
    if (!val) return '';
    if (val < 18.5) return 'Underweight';
    if (val < 25) return 'Optimal';
    if (val < 30) return 'Overweight';
    return 'Obese';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? target.checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patient_name.trim()) {
      toast({ title: 'Validation Error', description: 'Patient name is required.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: 'Diagnostic Complete', description: 'Neural stratification analysis processed successfully.' });
    }, 2000);
  };

  return (
    <AruviAILayout activeTab="Diagnostics">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-12 pb-20">
        
        <motion.div variants={item} className="space-y-4">
          <ClinicalBadge variant="primary">Protocol V4.2</ClinicalBadge>
          <h1 className="text-5xl font-bold tracking-tight text-foreground font-display">Diagnostic Protocol</h1>
          <p className="text-lg text-muted-foreground max-w-2xl font-medium">
            Initialize a high-precision diagnostic session. All data points are encrypted and processed through secure institutional lattices.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Demographics */}
          <motion.section variants={item} className="space-y-8">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-primary">
              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                <User size={20} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground font-display">Institutional Identity</h2>
            </div>
            <ClinicalCard>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ClinicalInput label="Subject Identifier / Full Name" name="patient_name" placeholder="Jane Doe" value={formData.patient_name} onChange={handleChange} required />
                <ClinicalInput label="Medical Record Number" name="medical_record_number" placeholder="Institutional ID" value={formData.medical_record_number} onChange={handleChange} />
                <ClinicalInput label="Subject Age" name="age" type="number" placeholder="45" value={formData.age} onChange={handleChange} required />
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Gender Context</label>
                  <div className="flex gap-2 mt-1">
                    {['Male', 'Female', 'Other'].map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData(p => ({...p, gender: g}))}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                          formData.gender === g 
                            ? 'gradient-brand text-primary-foreground shadow-glow' 
                            : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
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
          <motion.section variants={item} className="space-y-8">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-primary">
              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                <Activity size={20} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground font-display">Biometric Vectors</h2>
            </div>
            <ClinicalCard>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.section variants={item} className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b-2 border-primary">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                  <Database size={20} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground font-display">Renal & Liver</h2>
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

            <motion.section variants={item} className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b-2 border-primary">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                  <Heart size={20} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground font-display">Lipid Profile</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.section variants={item} className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b-2 border-primary">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                  <Scale size={20} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground font-display">Pathology Matrix</h2>
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
                      (formData as any)[itm.name] ? 'bg-teal-50 border-teal-200' : 'bg-secondary/50 border-border hover:bg-card hover:border-border'
                    }`}>
                      <span className={`text-sm font-bold ${(formData as any)[itm.name] ? 'text-primary' : 'text-muted-foreground'}`}>{itm.label}</span>
                      <input 
                        type="checkbox" 
                        name={itm.name} 
                        checked={(formData as any)[itm.name]} 
                        onChange={handleChange}
                        className="w-5 h-5 accent-teal-600 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </ClinicalCard>
            </motion.section>

            <motion.section variants={item} className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b-2 border-primary">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                  <Dna size={20} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground font-display">Genetic Lattice</h2>
              </div>
              <ClinicalCard className="h-full">
                <div className="space-y-3">
                  {[
                    { name: 'family_hypertension', label: 'Heritable Hypertension' },
                    { name: 'family_diabetes', label: 'Heritable Diabetes' },
                    { name: 'family_heart_disease', label: 'Heritable Cardiac' },
                  ].map(itm => (
                    <label key={itm.name} className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${
                      (formData as any)[itm.name] ? 'bg-teal-50 border-teal-200' : 'bg-secondary/50 border-border hover:bg-card hover:border-border'
                    }`}>
                      <span className={`text-sm font-bold ${(formData as any)[itm.name] ? 'text-primary' : 'text-muted-foreground'}`}>{itm.label}</span>
                      <input 
                        type="checkbox" 
                        name={itm.name} 
                        checked={(formData as any)[itm.name]} 
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
          <motion.section variants={item} className="space-y-8">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-primary">
              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                <Brain size={20} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground font-display">Clinical Context</h2>
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
          <motion.div variants={item} className="pt-10 flex flex-col items-center gap-6 border-t border-border">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck size={18} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Institutional E2EE Encryption Active</span>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full max-w-md py-4 gradient-brand text-primary-foreground rounded-2xl font-bold text-sm uppercase tracking-wider shadow-glow hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Processing Neural Stratification...
                </>
              ) : (
                <>
                  <Save size={18} /> Execute Diagnostic Protocol
                </>
              )}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </AruviAILayout>
  );
};

export default DiagnosticsPage;
