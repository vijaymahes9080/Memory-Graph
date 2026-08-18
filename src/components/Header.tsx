import React from 'react';
import { 
  Network, 
  Search, 
  Clock, 
  Sparkles, 
  PlusCircle, 
  RefreshCw, 
  Cpu, 
  GitBranch, 
  FileText 
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'graph' | 'ai' | 'timeline' | 'insights';
  setActiveTab: (tab: 'graph' | 'ai' | 'timeline' | 'insights') => void;
  onOpenIngest: () => void;
  stats: {
    totalNodes: number;
    totalEdges: number;
    discoveredCount: number;
  };
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenIngest,
  stats
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 bg-dark-900/90 backdrop-blur-md px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue via-brand-purple to-brand-cyan p-0.5 shadow-lg shadow-brand-blue/20">
            <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
              <Network className="w-5 h-5 text-brand-cyan animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Memory Graph
              </h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-purple/20 text-brand-purple border border-brand-purple/30">
                v2.4 AI Core
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden sm:block">
              AI Knowledge Infrastructure • Connected Memory Engine
            </p>
          </div>
        </div>

        {/* View Navigation Tabs */}
        <nav className="flex items-center bg-dark-800/80 p-1 rounded-xl border border-slate-800/80 space-x-1">
          <button
            onClick={() => setActiveTab('graph')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'graph'
                ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-dark-700/50'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Graph Explorer</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'ai'
                ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-dark-700/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>RAG AI Assistant</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'timeline'
                ? 'bg-brand-cyan text-slate-950 font-semibold shadow-md shadow-brand-cyan/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-dark-700/50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Evolution Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative ${
              activeTab === 'insights'
                ? 'bg-brand-pink text-white shadow-md shadow-brand-pink/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-dark-700/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Relationship Discovery</span>
            {stats.discoveredCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-brand-pink animate-ping absolute -top-0.5 -right-0.5"></span>
            )}
          </button>
        </nav>

        {/* Stats & Actions */}
        <div className="flex items-center space-x-3">
          {/* Quick Metrics */}
          <div className="hidden lg:flex items-center space-x-3 px-3 py-1.5 bg-dark-800/60 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
            <div className="flex items-center space-x-1" title="Total Knowledge Nodes">
              <FileText className="w-3 h-3 text-brand-blue" />
              <span>{stats.totalNodes} Nodes</span>
            </div>
            <span className="text-slate-700">•</span>
            <div className="flex items-center space-x-1" title="Connected Edges">
              <GitBranch className="w-3 h-3 text-brand-purple" />
              <span>{stats.totalEdges} Edges</span>
            </div>
            <span className="text-slate-700">•</span>
            <div className="flex items-center space-x-1" title="AI Discovered Links">
              <Sparkles className="w-3 h-3 text-brand-pink" />
              <span className="text-brand-pink font-semibold">{stats.discoveredCount} Auto-Links</span>
            </div>
          </div>

          {/* Ingest Action Button */}
          <button
            onClick={onOpenIngest}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-white text-xs font-semibold hover:opacity-90 transition-all shadow-lg shadow-brand-blue/20 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ingest Knowledge</span>
          </button>
        </div>

      </div>
    </header>
  );
};
