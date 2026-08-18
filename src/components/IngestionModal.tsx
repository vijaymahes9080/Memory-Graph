import React, { useState } from 'react';
import { 
  SourceType, 
  GraphNode, 
  GraphEdge, 
  DiscoveredRelationship 
} from '../types/graph';
import { 
  Upload, 
  X, 
  FileText, 
  Code, 
  Mail, 
  MessageSquare, 
  Link, 
  Sparkles, 
  CheckCircle2, 
  Loader2,
  Cpu
} from 'lucide-react';
import { memoryEngine } from '../services/memoryEngine';

interface IngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestSuccess: (result: { newNode: GraphNode; newEdges: GraphEdge[]; discoveries: DiscoveredRelationship[] }) => void;
}

export const IngestionModal: React.FC<IngestionModalProps> = ({
  isOpen,
  onClose,
  onIngestSuccess
}) => {
  const [sourceType, setSourceType] = useState<SourceType>('PDF');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [sourceUri, setSourceUri] = useState<string>('');
  const [author, setAuthor] = useState<string>('Vijay Mahes');

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  if (!isOpen) return null;

  const handlePreloadSample = (sampleType: 'CROP_PDF' | 'HARDWARE_EMBEDDED' | 'GITHUB_AI') => {
    if (sampleType === 'CROP_PDF') {
      setTitle('Autonomous Drone Crop Inundation Scan.pdf');
      setSourceType('PDF');
      setContent('Multispectral aerial drone imagery dataset analyzing crop flooding and soil erosion patterns across 500 hectares using AI segmentation models.');
      setAuthor('Dr. Vijay Mahes');
    } else if (sampleType === 'HARDWARE_EMBEDDED') {
      setTitle('LoRaWAN Water Gauge Firmware v2.py');
      setSourceType('GITHUB');
      setSourceUri('https://github.com/vijaymahes9080/Disaster-IoT-Firmware');
      setContent('Embedded MicroPython telemetry code transmitting river depth sonar pulses over LoRaWAN mesh networks to cloud prediction backend.');
      setAuthor('Vijay Mahes');
    } else if (sampleType === 'GITHUB_AI') {
      setTitle('Satellite-Radar-Pipeline Repository');
      setSourceType('GITHUB');
      setSourceUri('https://github.com/vijaymahes9080/Satellite-Radar-Pipeline');
      setContent('High-throughput C++ / Python pipeline for ingesting Sentinel-1 SAR radar imagery and auto-generating flood hazard maps.');
      setAuthor('Vijay Mahes');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsProcessing(true);
    setCurrentStep(1);

    // Step 1: Text parsing
    setTimeout(async () => {
      setCurrentStep(2); // Entity Extraction
      setTimeout(async () => {
        setCurrentStep(3); // Vector Embeddings
        setTimeout(async () => {
          setCurrentStep(4); // Relationship Discovery

          // Finalize ingestion
          const result = await memoryEngine.ingestDocument(title, content, sourceType, sourceUri, author);

          setTimeout(() => {
            setIsProcessing(false);
            setCurrentStep(0);
            onIngestSuccess(result);
            onClose();
          }, 600);

        }, 500);
      }, 500);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-md">
      <div className="w-full max-w-xl glass-panel-glow rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden space-y-4 p-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white shadow-lg shadow-brand-blue/30">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Ingest Knowledge Source</h2>
            <p className="text-xs text-slate-400">
              Add documents, code repos, emails, or notes to auto-extract entities and discover graph links.
            </p>
          </div>
        </div>

        {/* Preload Samples Chips */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
            Quick Preload Sample Data:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handlePreloadSample('CROP_PDF')}
              className="px-2.5 py-1 rounded-lg bg-dark-800 border border-slate-700 hover:border-brand-purple text-xs text-slate-300 hover:text-white transition-all"
            >
              📄 Drone Crop Scan PDF
            </button>
            <button
              type="button"
              onClick={() => handlePreloadSample('HARDWARE_EMBEDDED')}
              className="px-2.5 py-1 rounded-lg bg-dark-800 border border-slate-700 hover:border-brand-emerald text-xs text-slate-300 hover:text-white transition-all"
            >
              💻 IoT Gauge Firmware
            </button>
            <button
              type="button"
              onClick={() => handlePreloadSample('GITHUB_AI')}
              className="px-2.5 py-1 rounded-lg bg-dark-800 border border-slate-700 hover:border-brand-blue text-xs text-slate-300 hover:text-white transition-all"
            >
              🐙 Satellite Radar Pipeline Repo
            </button>
          </div>
        </div>

        {/* Form Body */}
        {!isProcessing ? (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            
            {/* Source Type Selector Tabs */}
            <div className="grid grid-cols-4 gap-2">
              {(['PDF', 'GITHUB', 'EMAIL', 'NOTE'] as SourceType[]).map(type => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setSourceType(type)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all ${
                    sourceType === type
                      ? 'bg-brand-blue/20 border-brand-blue text-white shadow-lg shadow-brand-blue/20'
                      : 'bg-dark-800/80 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {type === 'PDF' && <FileText className="w-4 h-4 text-brand-purple" />}
                  {type === 'GITHUB' && <Code className="w-4 h-4 text-brand-emerald" />}
                  {type === 'EMAIL' && <Mail className="w-4 h-4 text-brand-amber" />}
                  {type === 'NOTE' && <MessageSquare className="w-4 h-4 text-brand-pink" />}
                  <span>{type}</span>
                </button>
              ))}
            </div>

            {/* Document Title */}
            <div>
              <label className="text-[11px] font-mono text-slate-300">Document / Entity Title:</label>
              <input
                type="text"
                required
                placeholder="e.g. Flood Risk Assessment Model.pdf"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-blue"
              />
            </div>

            {/* Source URI (optional) */}
            <div>
              <label className="text-[11px] font-mono text-slate-300">Source URI / GitHub Link (Optional):</label>
              <input
                type="text"
                placeholder="https://github.com/user/repo"
                value={sourceUri}
                onChange={e => setSourceUri(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-blue"
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label className="text-[11px] font-mono text-slate-300">Content / Document Text / Code Snippet:</label>
              <textarea
                required
                rows={4}
                placeholder="Paste the document text, research abstract, chat transcript, or code description here..."
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-blue resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-dark-800 text-slate-300 text-xs font-semibold hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-white text-xs font-semibold hover:opacity-90 shadow-lg shadow-brand-blue/20"
              >
                Process & Build Memory Graph
              </button>
            </div>

          </form>
        ) : (
          /* Live AI Pipeline Processing Animation */
          <div className="py-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center mx-auto text-brand-purple shadow-xl shadow-brand-purple/30">
              <Cpu className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">AI Multimodal Knowledge Ingestion</h3>
              <p className="text-xs text-slate-400 font-mono">Running entity recognition and relationship discovery matrix...</p>
            </div>

            {/* Stepper Progress */}
            <div className="space-y-3 max-w-sm mx-auto text-left">
              
              <div className={`flex items-center space-x-3 text-xs transition-all ${currentStep >= 1 ? 'text-white' : 'text-slate-600'}`}>
                {currentStep > 1 ? <CheckCircle2 className="w-4 h-4 text-brand-emerald" /> : <Loader2 className="w-4 h-4 text-brand-blue animate-spin" />}
                <span>1. Parsing document text & metadata</span>
              </div>

              <div className={`flex items-center space-x-3 text-xs transition-all ${currentStep >= 2 ? 'text-white' : 'text-slate-600'}`}>
                {currentStep > 2 ? <CheckCircle2 className="w-4 h-4 text-brand-emerald" /> : (currentStep === 2 ? <Loader2 className="w-4 h-4 text-brand-purple animate-spin" /> : <div className="w-4 h-4" />)}
                <span>2. Extracting Entities (People, Topics, Technologies)</span>
              </div>

              <div className={`flex items-center space-x-3 text-xs transition-all ${currentStep >= 3 ? 'text-white' : 'text-slate-600'}`}>
                {currentStep > 3 ? <CheckCircle2 className="w-4 h-4 text-brand-emerald" /> : (currentStep === 3 ? <Loader2 className="w-4 h-4 text-brand-cyan animate-spin" /> : <div className="w-4 h-4" />)}
                <span>3. Computing vector similarity embeddings</span>
              </div>

              <div className={`flex items-center space-x-3 text-xs transition-all ${currentStep >= 4 ? 'text-white' : 'text-slate-600'}`}>
                {currentStep >= 4 ? <CheckCircle2 className="w-4 h-4 text-brand-pink" /> : (currentStep === 4 ? <Loader2 className="w-4 h-4 text-brand-pink animate-spin" /> : <div className="w-4 h-4" />)}
                <span>4. Discovering implicit graph relationships</span>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
