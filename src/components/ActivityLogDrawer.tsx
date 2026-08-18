import React from 'react';
import { Activity, Clock, Sparkles, FileText, Code, GitBranch } from 'lucide-react';
import { memoryEngine } from '../services/memoryEngine';

export const ActivityLogDrawer: React.FC = () => {
  const discoveries = memoryEngine.getDiscoveries();

  return (
    <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2 text-brand-pink">
          <Activity className="w-4 h-4" />
          <h3 className="text-xs font-bold uppercase tracking-wider">Real-Time Knowledge Event Stream</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">Live Ingestion Bus</span>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {discoveries.map(disc => (
          <div key={disc.id} className="p-2.5 bg-dark-800/70 rounded-xl border border-slate-800 text-xs space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-brand-pink font-bold">EVENT: AUTO_LINK</span>
              <span className="text-slate-400">{new Date(disc.discoveredAt).toLocaleTimeString()}</span>
            </div>
            <p className="text-slate-300 text-[11px] font-sans leading-relaxed">{disc.reasoning}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
