import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GraphExplorer } from './components/GraphExplorer';
import { AiAssistantView } from './components/AiAssistantView';
import { TimelineView } from './components/TimelineView';
import { ContextInsightsView } from './components/ContextInsightsView';
import { MindMapView } from './components/MindMapView';
import { AnalyticsView } from './components/AnalyticsView';
import { VectorProjectionView } from './components/VectorProjectionView';
import { AdvancedQueryBuilder } from './components/AdvancedQueryBuilder';
import { ActivityLogDrawer } from './components/ActivityLogDrawer';
import { IngestionModal } from './components/IngestionModal';
import { memoryEngine } from './services/memoryEngine';
import { exportImportEngine } from './services/exportImportEngine';
import { snapshotEngine } from './services/snapshotEngine';
import { 
  GraphNode, 
  GraphEdge, 
  DiscoveredRelationship, 
  Contradiction, 
  KnowledgeGap 
} from './types/graph';
import { Sparkles, X, Layers, BarChart2, Cpu, Download, Camera } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'graph' | 'ai' | 'timeline' | 'insights' | 'mindmap' | 'analytics'>('graph');
  
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

  const handleExportJson = () => {
    const jsonStr = exportImportEngine.exportToJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memory-graph-export-${Date.now()}.json`;
    a.click();
  };

  const handleTakeSnapshot = () => {
    const snap = snapshotEngine.createSnapshot(`Snapshot ${Date.now().toString().slice(-4)}`);
    setToastMessage({
      title: `📸 Graph Snapshot Created`,
      detail: `Saved ${snap.nodeCount} nodes and ${snap.edgeCount} edges in historical state.`
    });
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
        activeTab={activeTab as any}
        setActiveTab={setActiveTab as any}
        onOpenIngest={() => setIsIngestOpen(true)}
        stats={{
          totalNodes: nodes.length,
          totalEdges: edges.length,
          discoveredCount: discoveries.length
        }}
      />

      {/* Extra Innovation Controls Bar */}
      <div className="bg-dark-800/60 border-b border-slate-800 px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('mindmap')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeTab === 'mindmap' ? 'bg-brand-emerald text-slate-950 font-bold' : 'text-slate-300 hover:bg-dark-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Taxonomy MindMap</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeTab === 'analytics' ? 'bg-brand-purple text-white font-bold' : 'text-slate-300 hover:bg-dark-700'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Graph Analytics</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleTakeSnapshot}
              className="px-3 py-1 rounded-lg bg-dark-700 text-xs text-slate-200 hover:text-white flex items-center space-x-1 border border-slate-700"
            >
              <Camera className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Take Snapshot</span>
            </button>

            <button
              onClick={handleExportJson}
              className="px-3 py-1 rounded-lg bg-dark-700 text-xs text-slate-200 hover:text-white flex items-center space-x-1 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-brand-purple" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col space-y-6">
        
        {activeTab === 'graph' && (
          <div className="flex-1 flex flex-col space-y-4">
            <GraphExplorer
              nodes={nodes}
              edges={edges}
              onSelectNode={setSelectedNode}
              selectedNode={selectedNode}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AdvancedQueryBuilder onSelectNode={setSelectedNode} />
              <VectorProjectionView nodes={nodes} onSelectNode={setSelectedNode} />
            </div>

            <ActivityLogDrawer />
          </div>
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

        {activeTab === 'mindmap' && (
          <MindMapView
            nodes={nodes}
            onSelectNode={(node) => {
              setSelectedNode(node);
              setActiveTab('graph');
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            nodes={nodes}
            edges={edges}
            discoveries={discoveries}
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
