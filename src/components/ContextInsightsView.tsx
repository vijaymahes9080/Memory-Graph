import React, { useState } from 'react';
import { 
  GraphNode, 
  GraphEdge, 
  DiscoveredRelationship, 
  Contradiction, 
  KnowledgeGap 
} from '../types/graph';
import { 
  Cpu, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  GitBranch, 
  FileText, 
  ArrowRight, 
  ShieldAlert, 
  Lightbulb, 
  ExternalLink,
  ChevronRight,
  Zap,
  Info
} from 'lucide-react';
import { memoryEngine } from '../services/memoryEngine';

interface ContextInsightsViewProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  discoveries: DiscoveredRelationship[];
  contradictions: Contradiction[];
  gaps: KnowledgeGap[];
  onSelectNode: (node: GraphNode) => void;
}

export const ContextInsightsView: React.FC<ContextInsightsViewProps> = ({
  nodes,
  edges,
  discoveries,
  contradictions,
  gaps,
  onSelectNode
}) => {
  const [activeTab, setActiveTab] = useState<'discoveries' | 'contradictions' | 'gaps'>('discoveries');

  return (
    <div className="w-full h-full flex flex-col bg-dark-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      
      {/* Top Bar Header */}
      <div className="p-4 bg-dark-800/80 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-pink/20 border border-brand-pink/40 flex items-center justify-center text-brand-pink shadow-lg shadow-brand-pink/20">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Relationship Discovery & Insights Engine</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-brand-pink/20 text-brand-pink border border-brand-pink/30">
                The Killer Feature
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              AI continuously analyzes entity overlaps, code algorithms, and document concepts to discover implicit links.
            </p>
          </div>
        </div>

        {/* Sub View Toggle Tabs */}
        <div className="flex items-center bg-dark-900 p-1 rounded-xl border border-slate-800 space-x-1">
          <button
            onClick={() => setActiveTab('discoveries')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'discoveries'
                ? 'bg-brand-pink text-white shadow-md shadow-brand-pink/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discovered Links ({discoveries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contradictions')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'contradictions'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Contradictions ({contradictions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gaps')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'gaps'
                ? 'bg-brand-cyan text-slate-950 shadow-md shadow-brand-cyan/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Knowledge Gaps ({gaps.length})</span>
          </button>
        </div>

      </div>

      {/* Main Tab Content */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        
        {/* DISCOVERIES TAB */}
        {activeTab === 'discoveries' && (
          <div className="space-y-4">
            
            <div className="p-4 rounded-2xl glass-panel border border-brand-pink/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Zap className="w-6 h-6 text-brand-pink animate-bounce" />
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Continuous Background Relationship Mining</h3>
                  <p className="text-xs text-slate-300">
                    These connections were never explicitly created by the user — AI automatically correlated source algorithms, credentials, and code modules.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {discoveries.map(disc => {
                const srcNode = memoryEngine.getNodeById(disc.sourceNodeId);
                const tgtNode = memoryEngine.getNodeById(disc.targetNodeId);

                return (
                  <div
                    key={disc.id}
                    className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-brand-pink/50 transition-all space-y-4 shadow-lg group"
                  >
                    {/* Top Tag & Confidence */}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-pink/20 text-brand-pink text-[10px] font-mono font-bold border border-brand-pink/30 flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Discovered • {disc.relationType}</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-brand-emerald bg-brand-emerald/10 px-2 py-0.5 rounded-full border border-brand-emerald/30">
                        {disc.confidenceScore}% Match
                      </span>
                    </div>

                    {/* Nodes Connected Diagram */}
                    <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-dark-800/80 border border-slate-800">
                      
                      {/* Source Node */}
                      <div 
                        onClick={() => srcNode && onSelectNode(srcNode)}
                        className="flex-1 cursor-pointer hover:text-brand-pink transition-colors"
                      >
                        <div className="text-[10px] font-mono text-slate-400 font-bold">[{srcNode?.type}]</div>
                        <div className="text-xs font-bold text-white line-clamp-1">{srcNode?.title}</div>
                      </div>

                      <div className="text-slate-500 font-bold text-sm shrink-0 px-1">➔</div>

                      {/* Target Node */}
                      <div 
                        onClick={() => tgtNode && onSelectNode(tgtNode)}
                        className="flex-1 text-right cursor-pointer hover:text-brand-pink transition-colors"
                      >
                        <div className="text-[10px] font-mono text-slate-400 font-bold">[{tgtNode?.type}]</div>
                        <div className="text-xs font-bold text-white line-clamp-1">{tgtNode?.title}</div>
                      </div>

                    </div>

                    {/* Reasoning Explanation */}
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      <strong className="text-slate-200">AI Reasoning:</strong> {disc.reasoning}
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Discovered: {new Date(disc.discoveredAt).toLocaleDateString()}</span>
                      <button
                        onClick={() => srcNode && onSelectNode(srcNode)}
                        className="text-brand-pink font-semibold group-hover:underline flex items-center space-x-1"
                      >
                        <span>Inspect Connections</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* CONTRADICTIONS TAB */}
        {activeTab === 'contradictions' && (
          <div className="space-y-4">
            
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center space-x-3 text-amber-200">
              <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Contradiction Detection Engine</h3>
                <p className="text-xs text-amber-200/80">
                  AI scans requirements, emails, and codebase parameters to flag conflicting latency metrics or hardware protocol changes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contradictions.map(contra => (
                <div
                  key={contra.id}
                  className="p-5 rounded-2xl glass-panel border border-amber-500/30 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold border border-amber-500/30">
                      Severity: {contra.severity}
                    </span>
                    <span className="text-xs font-bold text-white">{contra.summary}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-dark-800 border border-slate-800 text-xs space-y-1">
                    <div className="text-slate-400 font-mono text-[10px]">Conflict Between:</div>
                    <div className="text-slate-200 font-semibold">• {contra.titleA}</div>
                    <div className="text-slate-200 font-semibold">• {contra.titleB}</div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {contra.conflictDetail}
                  </p>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* GAPS TAB */}
        {activeTab === 'gaps' && (
          <div className="space-y-4">
            
            <div className="p-4 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center space-x-3 text-brand-cyan">
              <Lightbulb className="w-6 h-6 text-brand-cyan shrink-0 animate-pulse" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider">Knowledge Gap Analysis</h3>
                <p className="text-xs text-slate-300">
                  Identifies missing modules or unfulfilled requirements in your project blueprint.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gaps.map(gap => (
                <div
                  key={gap.id}
                  className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-cyan">{gap.topic}</span>
                    <span className="text-[10px] font-mono text-slate-400">{gap.projectContext}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-dark-800 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <strong className="text-slate-200">Missing Component:</strong>
                    <p>{gap.missingElement}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 text-xs text-slate-200 space-y-1">
                    <strong className="text-brand-cyan">AI Recommendation:</strong>
                    <p>{gap.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
