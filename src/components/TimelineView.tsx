import React, { useState, useEffect } from 'react';
import { 
  GraphNode, 
  GraphEdge 
} from '../types/graph';
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Calendar, 
  GitBranch, 
  Sparkles, 
  FileText, 
  Code, 
  MessageSquare, 
  Mail,
  ChevronRight
} from 'lucide-react';

interface TimelineViewProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onSelectNode: (node: GraphNode) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  nodes,
  edges,
  onSelectNode
}) => {
  // Sort nodes chronologically
  const sortedNodes = [...nodes].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const [currentIndex, setCurrentIndex] = useState<number>(sortedNodes.length - 1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Auto-play timer loop
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= sortedNodes.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, sortedNodes.length]);

  const currentNodeAtStep = sortedNodes[currentIndex];
  const visibleNodes = sortedNodes.slice(0, currentIndex + 1);
  const visibleNodeIds = new Set(visibleNodes.map(n => n.id));
  const visibleEdges = edges.filter(e => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target));

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'PDF': return <FileText className="w-4 h-4 text-brand-purple" />;
      case 'GITHUB': return <Code className="w-4 h-4 text-brand-emerald" />;
      case 'EMAIL': return <Mail className="w-4 h-4 text-brand-amber" />;
      case 'CHAT': return <MessageSquare className="w-4 h-4 text-brand-pink" />;
      default: return <Sparkles className="w-4 h-4 text-brand-cyan" />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-dark-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      
      {/* Top Header & Time Scrubbing Controls */}
      <div className="p-4 bg-dark-800/80 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan shadow-lg shadow-brand-cyan/20">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Knowledge Evolution Timeline</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
                Temporal Memory Matrix
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Scrub back and forward in time to watch how ideas, documents, and code evolved.
            </p>
          </div>
        </div>

        {/* Playback Controls & Slider */}
        <div className="w-full md:w-auto flex items-center space-x-3 bg-dark-900 p-2 rounded-xl border border-slate-800">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-brand-cyan text-slate-950 font-bold hover:opacity-90 transition-all flex items-center space-x-1 text-xs"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Play Timeline'}</span>
          </button>

          <button
            onClick={() => { setCurrentIndex(0); setIsPlaying(false); }}
            className="p-2 rounded-lg bg-dark-700 text-slate-300 hover:text-white transition-all text-xs"
            title="Reset to Start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Time Scrubber Slider */}
          <div className="flex-1 md:w-64 space-y-1">
            <input
              type="range"
              min={0}
              max={sortedNodes.length - 1}
              value={currentIndex}
              onChange={e => { setCurrentIndex(Number(e.target.value)); setIsPlaying(false); }}
              className="w-full h-1.5 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-brand-cyan"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>Sep 2025</span>
              <span className="text-brand-cyan font-bold">
                Step {currentIndex + 1} of {sortedNodes.length}
              </span>
              <span>Feb 2026</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Timeline Split Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Interactive Timeline Cards (8 cols) */}
        <div className="lg:col-span-8 p-6 overflow-y-auto space-y-6 border-r border-slate-800">
          <div className="relative border-l-2 border-slate-800 ml-4 space-y-8 pl-6">
            
            {sortedNodes.map((node, index) => {
              const isPassed = index <= currentIndex;
              const isCurrent = index === currentIndex;
              const formattedDate = new Date(node.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });

              return (
                <div
                  key={node.id}
                  onClick={() => { setCurrentIndex(index); onSelectNode(node); }}
                  className={`relative transition-all duration-300 cursor-pointer group ${
                    isPassed ? 'opacity-100' : 'opacity-35 grayscale'
                  }`}
                >
                  {/* Timeline Dot Icon */}
                  <div className={`absolute -left-[35px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCurrent
                      ? 'bg-brand-cyan text-slate-950 border-white scale-125 shadow-lg shadow-brand-cyan/50 ring-4 ring-brand-cyan/20'
                      : (isPassed ? 'bg-dark-800 border-brand-cyan text-brand-cyan' : 'bg-dark-900 border-slate-700 text-slate-600')
                  }`}>
                    <Calendar className="w-3 h-3" />
                  </div>

                  {/* Timeline Card */}
                  <div className={`p-4 rounded-2xl transition-all border ${
                    isCurrent
                      ? 'glass-panel-glow border-brand-cyan/50 shadow-xl'
                      : 'bg-dark-800/60 border-slate-800/80 hover:border-slate-700'
                  }`}>
                    
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <div className="flex items-center space-x-2">
                        {getSourceIcon(node.source)}
                        <span className="font-bold text-slate-300 uppercase">{node.source}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-brand-cyan">{node.type}</span>
                      </div>
                      <span className="text-slate-400 font-semibold">{formattedDate}</span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-brand-cyan transition-colors">
                      {node.title}
                    </h3>
                    
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {node.content}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-slate-800/60">
                      {node.metadata?.tags?.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-dark-900/80 text-[10px] font-mono text-slate-400">
                          #{tag}
                        </span>
                      ))}
                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* Right Snapshot Summary Panel (4 cols) */}
        <div className="lg:col-span-4 p-6 bg-dark-900/50 space-y-4 overflow-y-auto">
          
          <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-cyan flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Snapshot at Step {currentIndex + 1}</span>
            </h3>

            {currentNodeAtStep && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-white">Latest Added Node:</div>
                <div className="p-3 rounded-xl bg-dark-800 border border-slate-700 text-xs space-y-1">
                  <div className="text-brand-cyan font-bold">[{currentNodeAtStep.type}] {currentNodeAtStep.title}</div>
                  <p className="text-slate-300 text-[11px]">{currentNodeAtStep.content}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2 text-center font-mono">
              <div className="p-2.5 rounded-xl bg-dark-800 border border-slate-800">
                <div className="text-lg font-bold text-brand-cyan">{visibleNodes.length}</div>
                <div className="text-[10px] text-slate-400">Active Nodes</div>
              </div>
              <div className="p-2.5 rounded-xl bg-dark-800 border border-slate-800">
                <div className="text-lg font-bold text-brand-purple">{visibleEdges.length}</div>
                <div className="text-[10px] text-slate-400">Active Edges</div>
              </div>
            </div>

          </div>

          {/* Active Connections List at this time */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Relationships Emerged so far ({visibleEdges.length}):
            </span>
            <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-none">
              {visibleEdges.map(edge => {
                const src = memoryEngine.getNodeById(edge.source);
                const tgt = memoryEngine.getNodeById(edge.target);
                return (
                  <div key={edge.id} className="p-2.5 rounded-xl bg-dark-800/60 border border-slate-800/80 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-brand-cyan font-bold">{edge.type}</span>
                      {edge.autoDiscovered && (
                        <span className="text-brand-pink font-semibold">⚡ Auto-Discovered</span>
                      )}
                    </div>
                    <div className="text-slate-200 font-medium">
                      {src?.title} <span className="text-slate-500">→</span> {tgt?.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
