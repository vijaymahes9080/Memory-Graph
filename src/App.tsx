import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GraphExplorer } from './components/GraphExplorer';
import { AiAssistantView } from './components/AiAssistantView';
import { TimelineView } from './components/TimelineView';
import { ContextInsightsView } from './components/ContextInsightsView';
import { IngestionModal } from './components/IngestionModal';
import { memoryEngine } from './services/memoryEngine';
import { 
  GraphNode, 
  GraphEdge, 
  DiscoveredRelationship, 
  Contradiction, 
  KnowledgeGap 
} from './types/graph';
import { Sparkles, X, CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'graph' | 'ai' | 'timeline' | 'insights'>('graph');
  
  // Memory Graph State
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [discoveries, setDiscoveries] = useState<DiscoveredRelationship[]>([]);
  const [contradictions, setContradictions] = useState<Contradiction[]>([]);
  const [gaps, setGaps] = useState<KnowledgeGap[]>([]);

  // Selection & Modal State
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [isIngestOpen, setIsIngestOpen] = useState<boolean>(false);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<{ title: string; detail: string } | null>(null);

  // Load initial graph data
  const refreshData = () => {
    setNodes(memoryEngine.getNodes());
    setEdges(memoryEngine.getEdges());
    setDiscoveries(memoryEngine.getDiscoveries());
    setContradictions(memoryEngine.getContradictions());
    setGaps(memoryEngine.getGaps());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Handle successful document ingestion
  const handleIngestSuccess = (result: { newNode: GraphNode; newEdges: GraphEdge[]; discoveries: DiscoveredRelationship[] }) => {
    refreshData();
    setSelectedNode(result.newNode);

    if (result.discoveries.length > 0) {
      setToastMessage({
        title: `⚡ ${result.discoveries.length} New Relationship(s) Discovered!`,
        detail: result.discoveries[0].reasoning
      });
    } else {
      setToastMessage({
        title: `✅ Ingested '${result.newNode.title}'`,
        detail: `Added new ${result.newNode.type} entity to Memory Graph.`
      });
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex flex-col font-sans antialiased">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-2xl glass-panel-glow border border-brand-pink/40 shadow-2xl flex items-start space-x-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-brand-pink shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <h4 className="text-xs font-bold text-white">{toastMessage.title}</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">{toastMessage.detail}</p>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenIngest={() => setIsIngestOpen(true)}
        stats={{
          totalNodes: nodes.length,
          totalEdges: edges.length,
          discoveredCount: discoveries.length
        }}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col">
        {activeTab === 'graph' && (
          <GraphExplorer
            nodes={nodes}
            edges={edges}
            onSelectNode={setSelectedNode}
            selectedNode={selectedNode}
          />
        )}

        {activeTab === 'ai' && (
          <AiAssistantView
            onSelectNode={(node) => {
              setSelectedNode(node);
              setActiveTab('graph');
            }}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineView
            nodes={nodes}
            edges={edges}
            onSelectNode={(node) => {
              setSelectedNode(node);
              setActiveTab('graph');
            }}
          />
        )}

        {activeTab === 'insights' && (
          <ContextInsightsView
            nodes={nodes}
            edges={edges}
            discoveries={discoveries}
            contradictions={contradictions}
            gaps={gaps}
            onSelectNode={(node) => {
              setSelectedNode(node);
              setActiveTab('graph');
            }}
          />
        )}
      </main>

      {/* Multimodal Ingestion Modal */}
      <IngestionModal
        isOpen={isIngestOpen}
        onClose={() => setIsIngestOpen(false)}
        onIngestSuccess={handleIngestSuccess}
      />

    </div>
  );
};
export default App;
