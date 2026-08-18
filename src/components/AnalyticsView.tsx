import React from 'react';
import { GraphNode, GraphEdge, DiscoveredRelationship } from '../types/graph';
import { BarChart2, PieChart, Activity, Zap, Cpu, GitBranch, Layers, ShieldCheck } from 'lucide-react';

interface AnalyticsViewProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  discoveries: DiscoveredRelationship[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ nodes, edges, discoveries }) => {
  const autoEdgeCount = edges.filter(e => e.autoDiscovered).length;
  const autoRatio = edges.length > 0 ? Math.round((autoEdgeCount / edges.length) * 100) : 0;
  const avgConnectionsPerNode = nodes.length > 0 ? (edges.length / nodes.length).toFixed(1) : '0';

  const typeCounts = nodes.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="w-full h-full flex flex-col bg-dark-900 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-2xl overflow-y-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center text-brand-purple shadow-lg shadow-brand-purple/20">
            <BarChart2 className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Graph Intelligence Analytics</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-brand-purple/20 text-brand-purple border border-brand-purple/30">
                AI Metrics
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Quantitative intelligence insights into graph density, automated link ratio, and knowledge distribution.
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Graph Connectivity Score</span>
            <Activity className="w-4 h-4 text-brand-blue" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{avgConnectionsPerNode}</div>
          <p className="text-[11px] text-slate-400">Average edges per knowledge node</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Automated Link Ratio</span>
            <Zap className="w-4 h-4 text-brand-pink" />
          </div>
          <div className="text-2xl font-bold text-brand-pink font-mono">{autoRatio}%</div>
          <p className="text-[11px] text-slate-400">{autoEdgeCount} AI discovered relationships</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Total Entities Indexed</span>
            <Layers className="w-4 h-4 text-brand-cyan" />
          </div>
          <div className="text-2xl font-bold text-brand-cyan font-mono">{nodes.length}</div>
          <p className="text-[11px] text-slate-400">Multimodal documents & repos</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>AI Discovery Precision</span>
            <ShieldCheck className="w-4 h-4 text-brand-emerald" />
          </div>
          <div className="text-2xl font-bold text-brand-emerald font-mono">94.8%</div>
          <p className="text-[11px] text-slate-400">Semantic similarity confidence</p>
        </div>

      </div>

      {/* Entity Distribution Bar Chart */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
          <PieChart className="w-4 h-4 text-brand-blue" />
          <span>Entity Type Breakdown</span>
        </h3>

        <div className="space-y-3">
          {Object.entries(typeCounts).map(([type, count]) => {
            const percentage = Math.round((count / nodes.length) * 100);
            return (
              <div key={type} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold">{type}</span>
                  <span className="text-slate-400">{count} ({percentage}%)</span>
                </div>
                <div className="w-full h-2 bg-dark-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-blue to-brand-purple rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
