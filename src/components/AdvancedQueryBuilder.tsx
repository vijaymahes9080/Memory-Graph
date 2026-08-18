import React, { useState } from 'react';
import { EntityType, RelationType, GraphNode, GraphEdge } from '../types/graph';
import { Route, Play, RefreshCcw, Filter, CheckCircle2 } from 'lucide-react';
import { memoryEngine } from '../services/memoryEngine';

interface AdvancedQueryBuilderProps {
  onSelectNode: (node: GraphNode) => void;
}

export const AdvancedQueryBuilder: React.FC<AdvancedQueryBuilderProps> = ({ onSelectNode }) => {
  const [sourceType, setSourceType] = useState<EntityType>('DOCUMENT');
  const [relationType, setRelationType] = useState<RelationType>('IMPLEMENTS');
  const [targetType, setTargetType] = useState<EntityType>('CODE');
  
  const [matchedEdges, setMatchedEdges] = useState<GraphEdge[]>([]);

  const handleExecutePattern = () => {
    const allNodesMap = new Map(memoryEngine.getNodes().map(n => [n.id, n]));
    const matches = memoryEngine.getEdges().filter(edge => {
      const srcNode = allNodesMap.get(edge.source);
      const tgtNode = allNodesMap.get(edge.target);
      if (!srcNode || !tgtNode) return false;

      const srcMatches = sourceType === 'DOCUMENT' || srcNode.type === sourceType;
      const relMatches = edge.type === relationType;
      const tgtMatches = targetType === 'CODE' || tgtNode.type === targetType;

      return srcMatches && relMatches && tgtMatches;
    });

    setMatchedEdges(matches);
  };

  return (
    <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
      <div className="flex items-center space-x-2 text-brand-cyan">
        <Route className="w-4 h-4" />
        <h3 className="text-xs font-bold uppercase tracking-wider">Visual Pattern Match Builder</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-[10px] font-mono text-slate-400">Source Entity Type:</label>
          <select
            value={sourceType}
            onChange={e => setSourceType(e.target.value as EntityType)}
            className="w-full mt-1 p-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-slate-200"
          >
            <option value="DOCUMENT">DOCUMENT</option>
            <option value="PROJECT">PROJECT</option>
            <option value="CODE">CODE</option>
            <option value="EMAIL">EMAIL</option>
            <option value="CONCEPT">CONCEPT</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-mono text-slate-400">Relationship Type:</label>
          <select
            value={relationType}
            onChange={e => setRelationType(e.target.value as RelationType)}
            className="w-full mt-1 p-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-slate-200"
          >
            <option value="IMPLEMENTS">IMPLEMENTS</option>
            <option value="SAME_TOPIC">SAME_TOPIC</option>
            <option value="DEPENDS_ON">DEPENDS_ON</option>
            <option value="REFERENCES">REFERENCES</option>
            <option value="DERIVED_FROM">DERIVED_FROM</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-mono text-slate-400">Target Entity Type:</label>
          <select
            value={targetType}
            onChange={e => setTargetType(e.target.value as EntityType)}
            className="w-full mt-1 p-2 bg-dark-900 border border-slate-700 rounded-xl text-xs text-slate-200"
          >
            <option value="CODE">CODE</option>
            <option value="TECHNOLOGY">TECHNOLOGY</option>
            <option value="CONCEPT">CONCEPT</option>
            <option value="DATASET">DATASET</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleExecutePattern}
        className="w-full py-2 bg-gradient-to-r from-brand-cyan to-brand-blue rounded-xl text-xs font-semibold text-slate-950 flex items-center justify-center space-x-2 shadow-lg shadow-brand-cyan/20"
      >
        <Play className="w-3.5 h-3.5 fill-current" />
        <span>Execute Pattern Match Query</span>
      </button>

      {matchedEdges.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-[10px] font-mono text-brand-cyan font-bold">
            Matched {matchedEdges.length} Graph Paths:
          </span>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {matchedEdges.map(edge => {
              const src = memoryEngine.getNodeById(edge.source);
              const tgt = memoryEngine.getNodeById(edge.target);
              return (
                <div 
                  key={edge.id}
                  onClick={() => src && onSelectNode(src)}
                  className="p-2 bg-dark-800 rounded-lg border border-slate-800 text-xs flex items-center justify-between cursor-pointer hover:border-brand-cyan"
                >
                  <span className="text-slate-200 font-medium">{src?.title}</span>
                  <span className="text-brand-cyan font-mono text-[10px]">-[{edge.type}]-&gt;</span>
                  <span className="text-slate-200 font-medium">{tgt?.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
