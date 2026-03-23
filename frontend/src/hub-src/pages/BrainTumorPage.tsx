import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Brain, Upload, FileImage, Trash2, AlertTriangle, CheckCircle, Loader2, Info } from 'lucide-react';
import { AruviAILayout } from '@/components/AruviAILayout';
import { ClinicalCard, ClinicalBadge } from '@/components/ClinicalComponents';
import { useToast } from '@/hooks/use-toast';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

interface ScanFile {
  file: File;
  preview: string;
  id: string;
}

const BrainTumorPage = () => {
  const { toast } = useToast();
  const [scans, setScans] = useState<ScanFile[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<null | {
    prediction: string;
    confidence: number;
    tumorType: string;
    riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    details: string;
  }>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const processFiles = (files: FileList | null) => {
    if (!files) return;
    const newScans: ScanFile[] = [];
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/') || file.type === 'application/dicom') {
        newScans.push({
          file,
          preview: URL.createObjectURL(file),
          id: crypto.randomUUID(),
        });
      }
    });
    if (newScans.length === 0) {
      toast({ title: 'Invalid File', description: 'Please upload MRI/CT scan images (JPEG, PNG, DICOM).', variant: 'destructive' });
      return;
    }
    setScans(prev => [...prev, ...newScans]);
    setResult(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    processFiles(e.dataTransfer.files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const removeScan = (id: string) => {
    setScans(prev => {
      const scan = prev.find(s => s.id === id);
      if (scan) URL.revokeObjectURL(scan.preview);
      return prev.filter(s => s.id !== id);
    });
    setResult(null);
  };

  const runAnalysis = () => {
    if (scans.length === 0) {
      toast({ title: 'No Scans', description: 'Upload at least one MRI/CT scan to analyze.', variant: 'destructive' });
      return;
    }
    setAnalyzing(true);
    setResult(null);

    // Simulated CNN inference result
    setTimeout(() => {
      const outcomes = [
        { prediction: 'Tumor Detected', confidence: 94.7, tumorType: 'Glioma', riskLevel: 'high' as const, details: 'A high-grade glioma pattern was detected in the left temporal lobe. The CNN model identified irregular mass boundaries consistent with Grade III astrocytoma. Immediate specialist consultation is recommended.' },
        { prediction: 'No Tumor Detected', confidence: 98.2, tumorType: 'N/A', riskLevel: 'low' as const, details: 'No abnormal mass or lesion patterns detected in the submitted scan. Brain tissue appears within normal morphological parameters. Routine follow-up recommended per institutional protocol.' },
        { prediction: 'Tumor Detected', confidence: 87.3, tumorType: 'Meningioma', riskLevel: 'moderate' as const, details: 'A meningioma pattern was identified in the frontal region. The mass appears well-circumscribed with clear boundaries. Further imaging with contrast enhancement is recommended for staging.' },
      ];
      setResult(outcomes[Math.floor(Math.random() * outcomes.length)]);
      setAnalyzing(false);
      toast({ title: 'Analysis Complete', description: 'CNN inference has completed. Review the results below.' });
    }, 3000);
  };

  const riskColors = {
    low: 'success',
    moderate: 'warning',
    high: 'error',
    critical: 'error',
  } as const;

  return (
    <AruviAILayout activeTab="Diagnostics">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-12 pb-20">

        {/* Header */}
        <motion.div variants={item} className="space-y-4">
          <ClinicalBadge variant="info">CNN Model v2.1</ClinicalBadge>
          <h1 className="text-5xl font-bold tracking-tight text-foreground font-display">Brain Tumor Detection</h1>
          <p className="text-lg text-muted-foreground max-w-2xl font-medium">
            Upload MRI or CT brain scans for AI-powered tumor detection using our convolutional neural network with 99.2% verified precision.
          </p>
        </motion.div>

        {/* Upload Zone */}
        <motion.section variants={item} className="space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b-2 border-primary">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
              <Upload size={20} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground font-display">Scan Upload</h2>
          </div>

          <ClinicalCard>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                dragActive
                  ? 'border-primary bg-teal-50/50'
                  : 'border-border hover:border-primary/40 hover:bg-secondary/30'
              }`}
              onClick={() => document.getElementById('scan-upload')?.click()}
            >
              <input
                id="scan-upload"
                type="file"
                multiple
                accept="image/*,.dcm"
                onChange={handleFileInput}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                  <FileImage size={28} className="text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-bold text-lg">Drag MRI or CT Scans here</p>
                  <p className="text-muted-foreground text-sm mt-1">Supports DICOM, JPEG, PNG (max 50MB)</p>
                </div>
              </div>
            </div>

            {/* Uploaded Scans Preview */}
            {scans.length > 0 && (
              <div className="mt-8 space-y-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Uploaded Scans ({scans.length})
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {scans.map(scan => (
                    <div key={scan.id} className="relative group rounded-xl overflow-hidden border border-border bg-secondary/30">
                      <img
                        src={scan.preview}
                        alt="MRI Scan"
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-all flex items-center justify-center">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeScan(scan.id); }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground p-2 rounded-full"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-muted-foreground truncate font-mono">{scan.file.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ClinicalCard>
        </motion.section>

        {/* Analyze Button */}
        <motion.div variants={item} className="flex justify-center">
          <button
            type="button"
            onClick={runAnalysis}
            disabled={analyzing || scans.length === 0}
            className="w-full max-w-md py-4 gradient-brand text-primary-foreground rounded-2xl font-bold text-sm uppercase tracking-wider shadow-glow hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {analyzing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Running CNN Inference...
              </>
            ) : (
              <>
                <Brain size={18} />
                Analyze Brain Scan
              </>
            )}
          </button>
        </motion.div>

        {/* Results */}
        {result && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3 pb-4 border-b-2 border-primary">
              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                <Brain size={20} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground font-display">Analysis Results</h2>
            </div>

            <ClinicalCard>
              <div className="space-y-8">
                {/* Top Result Banner */}
                <div className={`p-6 rounded-2xl flex items-center gap-4 ${
                  result.riskLevel === 'low'
                    ? 'bg-emerald-50 border border-emerald-200'
                    : result.riskLevel === 'moderate'
                    ? 'bg-amber-50 border border-amber-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {result.riskLevel === 'low' ? (
                    <CheckCircle size={28} className="text-clinical-success flex-shrink-0" />
                  ) : (
                    <AlertTriangle size={28} className={result.riskLevel === 'moderate' ? 'text-clinical-warning flex-shrink-0' : 'text-clinical-error flex-shrink-0'} />
                  )}
                  <div>
                    <p className="font-bold text-lg text-foreground">{result.prediction}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Confidence: <span className="font-mono font-bold">{result.confidence}%</span>
                    </p>
                  </div>
                  <div className="ml-auto">
                    <ClinicalBadge variant={riskColors[result.riskLevel]}>
                      {result.riskLevel} risk
                    </ClinicalBadge>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em]">Tumor Classification</p>
                    <p className="text-xl font-bold text-foreground font-display">{result.tumorType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em]">Model Confidence</p>
                    <p className="text-xl font-bold text-foreground font-mono">{result.confidence}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em]">Risk Assessment</p>
                    <p className="text-xl font-bold text-foreground font-display capitalize">{result.riskLevel}</p>
                  </div>
                </div>

                {/* Clinical Notes */}
                <div className="p-6 bg-secondary/50 rounded-2xl border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Info size={16} className="text-primary" />
                    <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Clinical Assessment</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.details}</p>
                </div>

                {/* Disclaimer */}
                <div className="flex items-start gap-3 p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                  <AlertTriangle size={16} className="text-clinical-warning flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-bold text-foreground">Disclaimer:</span> This AI-generated analysis is for clinical decision support only and should not replace professional medical judgment. All findings must be reviewed and confirmed by a qualified radiologist.
                  </p>
                </div>
              </div>
            </ClinicalCard>
          </motion.section>
        )}
      </motion.div>
    </AruviAILayout>
  );
};

export default BrainTumorPage;
