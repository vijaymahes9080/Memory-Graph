import React, { useState } from 'react';
import { GraphNode, EntityType } from '../types/graph';
import { Network, ChevronRight, ChevronDown, Layers, FileText, Code, Sparkles, Folder, FolderOpen } from 'lucide-react';
import { memoryEngine } from '../services/memoryEngine';

interface MindMapViewProps {
  nodes: GraphNode[];
  onSelectNode: (node: GraphNode) => void;
}

export const MindMapView: React.FC<MindMapViewProps> = ({ nodes, onSelectNode }) => {
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({
    PROJECT: true,
    DOCUMENT: true,
    CODE: true,
    CONCEPT: true,
    EMAIL: false,
    TECHNOLOGY: false
  });

  // Group nodes by EntityType
  const groupedNodes = nodes.reduce((acc, node) => {
    if (!acc[node.type]) acc[node.type] = [];
    acc[node.type].push(node);
    return acc;
  }, {} as Record<EntityType, GraphNode[]>);

  const toggleType = (type: string) => {
    setExpandedTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="w-full h-full flex flex-col bg-dark-900 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-2xl overflow-y-auto">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-emerald/20 border border-brand-emerald/40 flex items-center justify-center text-brand-emerald shadow-lg shadow-brand-emerald/20">
            <Layers className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Hierarchical MindMap & Cluster View</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30">
                Tree Taxonomy
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Structured taxonomy view organizing your Memory Graph by functional entity domains.
            </p>
          </div>
        </div>
      </div>

      {/* Root Node Tree */}
      <div className="space-y-4 max-w-4xl mx-auto w-full">
        
        {/* Central Core Memory Node */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-blue/20 via-brand-purple/20 to-brand-pink/20 border border-brand-blue/40 shadow-xl flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-brand-blue flex items-center justify-center text-white font-bold">
            🧠
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Root Knowledge Ecosystem</h3>
            <p className="text-xs text-slate-300 font-mono">Total {nodes.length} Connected Knowledge Entities</p>
          </div>
        </div>

        {/* Categories Branching */}
        <div className="space-y-3 pl-4 border-l-2 border-slate-800 ml-4">
          
          {(Object.keys(groupedNodes) as EntityType[]).map(type => {
            const typeNodes = groupedNodes[type];
            const isExpanded = expandedTypes[type];

            return (
              <div key={type} className="space-y-2">
                
                {/* Category Header */}
                <div 
                  onClick={() => toggleType(type)}
                  className="flex items-center justify-between p-3 rounded-xl bg-dark-800/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all group"
                >
                  <div className="flex items-center space-x-2">
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-brand-cyan" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    {isExpanded ? <FolderOpen className="w-4 h-4 text-brand-cyan" /> : <Folder className="w-4 h-4 text-slate-400" />}
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{type} Domain</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-dark-700 text-slate-300">
                      {typeNodes.length} items
                    </span>
                  </div>
                </div>

                {/* Sub items */}
                {isExpanded && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6 pt-1">
                    {typeNodes.map(node => {
                      const degree = memoryEngine.getNodeDegree(node.id);
                      return (
                        <div
                          key={node.id}
                          onClick={() => onSelectNode(node)}
                          className="p-3 rounded-xl bg-dark-800/40 border border-slate-800/80 hover:border-brand-cyan cursor-pointer transition-all space-y-1 group"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span className="text-brand-cyan font-bold">{node.source}</span>
                            <span>{degree} connections</span>
                          </div>
                          <h4 className="text-xs font-semibold text-slate-200 group-hover:text-brand-cyan transition-colors">
                            {node.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            {node.content}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
};
