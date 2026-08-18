import React, { useState } from 'react';
import { 
  QueryResult, 
  GraphNode 
} from '../types/graph';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  FileText, 
  GitBranch, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight, 
  ExternalLink,
  Zap,
  Layers,
  ArrowRight
} from 'lucide-react';
import { memoryEngine } from '../services/memoryEngine';

interface AiAssistantViewProps {
  onSelectNode: (node: GraphNode) => void;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ onSelectNode }) => {
  const [queryInput, setQueryInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<QueryResult | null>(null);
  
  // History of queries
  const [queryHistory, setQueryHistory] = useState<QueryResult[]>([]);

  // Preset Prompts
  const PRESET_PROMPTS = [
    "Show me everything connected to my flood prediction project.",
    "Which code implements concepts discussed in these documents?",
    "What are all my projects related to agriculture?",
    "Find conflicting information across my documents.",
    "How did this architecture decision evolve?"
  ];

  const handleRunQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);

    // Simulate RAG vector retrieval & graph traversal delay
    setTimeout(async () => {
      const result = await memoryEngine.queryGraph(queryText);
      setCurrentResult(result);
      setQueryHistory(prev => [result, ...prev]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-4">
      
      {/* Left Chat & Query Input Panel */}
      <div className="flex-1 flex flex-col bg-dark-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 bg-dark-800/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center text-brand-purple">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>RAG AI Memory Assistant</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-brand-purple/20 text-brand-purple border border-brand-purple/30">
                  Sub-Graph Traversal Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Ask questions across connected papers, code repos, emails, and chats.
              </p>
            </div>
          </div>
        </div>

        {/* Conversation Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-6">
          
          {/* Default Welcome Card if no query run */}
          {!currentResult && !loading && (
            <div className="p-6 rounded-2xl glass-panel border border-brand-purple/20 space-y-4 max-w-2xl mx-auto text-center my-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center mx-auto text-brand-purple shadow-lg shadow-brand-purple/20">
                <Sparkles className="w-6 h-6 animate-spin-slow" />
              </div>
              <h3 className="text-base font-bold text-white">Reality Search Engine for your Knowledge Graph</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
                Instead of returning a flat list of matching files, Memory Graph traverses implicit entity links, code dependencies, and document concepts to reconstruct connected knowledge networks.
              </p>
              
              <div className="pt-2 text-left">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Try asking one of these questions:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRESET_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setQueryInput(prompt); handleRunQuery(prompt); }}
                      className="p-2.5 rounded-xl bg-dark-800/80 border border-slate-700/70 hover:border-brand-purple text-left text-xs text-slate-200 hover:text-white transition-all flex items-center justify-between group"
                    >
                      <span>{prompt}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-brand-purple opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-dark-800/50 border border-brand-purple/30 animate-pulse">
              <Sparkles className="w-5 h-5 text-brand-purple animate-spin" />
              <div className="space-y-1">
                <div className="text-xs font-semibold text-brand-purple">Traversing Knowledge Graph...</div>
                <div className="text-[11px] font-mono text-slate-400">Computing vector similarities & 2-hop entity paths</div>
              </div>
            </div>
          )}

          {/* Current Query Result */}
          {currentResult && !loading && (
            <div className="space-y-4">
              
              {/* User Prompt Bubble */}
              <div className="flex items-start space-x-3 justify-end">
                <div className="p-3.5 rounded-2xl bg-brand-purple text-white text-xs font-medium max-w-lg shadow-lg shadow-brand-purple/20">
                  {currentResult.query}
                </div>
                <div className="w-8 h-8 rounded-xl bg-slate-700 flex items-center justify-center text-slate-300">
                  <User className="w-4 h-4" />
                </div>
              </div>

              {/* AI Answer Bubble */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-xl bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center text-brand-purple shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-4">
                  
                  {/* Narrative Card */}
                  <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-3">
                    
                    {/* Top Confidence Badge */}
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
                        <span className="text-xs font-semibold text-slate-200">Connected Synthesis Answer</span>
                      </div>
                      <div className="flex items-center space-x-1.5 font-mono text-[11px] text-brand-emerald bg-brand-emerald/10 px-2 py-0.5 rounded-full border border-brand-emerald/30">
                        <span>{currentResult.confidence}% RAG Confidence</span>
                      </div>
                    </div>

                    {/* Formatted Answer Narrative */}
                    <div className="text-xs leading-relaxed text-slate-200 whitespace-pre-line font-sans">
                      {currentResult.answer}
                    </div>

                    {/* Discovered Insights Box */}
                    {currentResult.discoveredInsights && (
                      <div className="p-3 rounded-xl bg-brand-purple/10 border border-brand-purple/30 space-y-1">
                        <div className="text-[10px] font-mono font-bold text-brand-purple uppercase tracking-wider flex items-center space-x-1">
                          <Zap className="w-3 h-3" />
                          <span>Graph Traversal Insights</span>
                        </div>
                        {currentResult.discoveredInsights.map((ins, i) => (
                          <div key={i} className="text-[11px] text-slate-300">
                            • {ins}
                          </div>
                        ))}
                      </div>
                    )}

                  </div>

                  {/* Citation Node Cards */}
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Evidence Source Nodes ({currentResult.citations.length}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentResult.citations.map((cit, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            const node = memoryEngine.getNodeById(cit.nodeId);
                            if (node) onSelectNode(node);
                          }}
                          className="p-3 rounded-xl bg-dark-800 border border-slate-800 hover:border-brand-blue cursor-pointer transition-all space-y-1 group"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span className="font-bold text-brand-blue">{cit.type}</span>
                            <span className="group-hover:text-white flex items-center">
                              Inspect Node <ChevronRight className="w-3 h-3 ml-0.5" />
                            </span>
                          </div>
                          <h4 className="text-xs font-semibold text-white group-hover:text-brand-blue transition-colors">
                            {cit.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2">
                            {cit.snippet}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>

        {/* Quick Preset Chips & Query Input Bar */}
        <div className="p-3 bg-dark-800/90 border-t border-slate-800 space-y-2">
          
          {/* Horizontal Preset Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1">
            {PRESET_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => { setQueryInput(prompt); handleRunQuery(prompt); }}
                className="px-2.5 py-1 rounded-lg bg-dark-700/60 border border-slate-700 text-[11px] text-slate-300 hover:text-white hover:border-brand-purple whitespace-nowrap transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Form Input */}
          <form 
            onSubmit={e => { e.preventDefault(); handleRunQuery(queryInput); }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask anything about your connected knowledge base..."
              value={queryInput}
              onChange={e => setQueryInput(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-dark-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
            />
            <button
              type="submit"
              disabled={loading || !queryInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-brand-purple text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center space-x-1.5 shadow-lg shadow-brand-purple/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Query</span>
            </button>
          </form>

        </div>

      </div>

      {/* Right Sub-Graph Evidence Panel */}
      {currentResult && (
        <div className="w-full lg:w-80 bg-dark-900 rounded-2xl border border-slate-800 p-4 space-y-4 flex flex-col shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-brand-purple">
              <Layers className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Connected Subgraph</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {currentResult.subgraphNodes.length} Nodes • {currentResult.subgraphEdges.length} Edges
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {currentResult.subgraphNodes.map(node => (
              <div
                key={node.id}
                onClick={() => onSelectNode(node)}
                className="p-3 rounded-xl bg-dark-800/60 border border-slate-800 hover:border-brand-purple cursor-pointer transition-all space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-dark-700 text-slate-300 font-bold">
                    {node.type}
                  </span>
                  <span className="text-slate-500">{node.source}</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-200">{node.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">{node.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
