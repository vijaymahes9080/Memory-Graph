import React, { useRef, useEffect, useState, useMemo } from 'react';
import { 
  GraphNode, 
  GraphEdge, 
  EntityType 
} from '../types/graph';
import { 
  Search, 
  Filter, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Route, 
  X, 
  ChevronRight, 
  Sparkles, 
  FileText, 
  ExternalLink,
  Layers,
  Info
} from 'lucide-react';
import { memoryEngine } from '../services/memoryEngine';

interface GraphExplorerProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onSelectNode: (node: GraphNode) => void;
  selectedNode: GraphNode | null;
}

const COLOR_MAP: Record<EntityType, { bg: string; border: string; glow: string }> = {
  PROJECT: { bg: '#3b82f6', border: '#60a5fa', glow: 'rgba(59, 130, 246, 0.5)' },
  DOCUMENT: { bg: '#8b5cf6', border: '#a78bfa', glow: 'rgba(139, 92, 246, 0.5)' },
  CODE: { bg: '#10b981', border: '#34d399', glow: 'rgba(16, 185, 129, 0.5)' },
  EMAIL: { bg: '#f59e0b', border: '#fbbf24', glow: 'rgba(245, 158, 11, 0.5)' },
  CHAT: { bg: '#ec4899', border: '#f472b6', glow: 'rgba(236, 72, 153, 0.5)' },
  CONCEPT: { bg: '#06b6d4', border: '#22d3ee', glow: 'rgba(6, 182, 212, 0.5)' },
  TECHNOLOGY: { bg: '#6366f1', border: '#818cf8', glow: 'rgba(99, 102, 241, 0.5)' },
  PERSON: { bg: '#e11d48', border: '#fb7185', glow: 'rgba(225, 29, 72, 0.5)' },
  DATASET: { bg: '#14b8a6', border: '#2dd4bf', glow: 'rgba(20, 184, 166, 0.5)' },
  NOTE: { bg: '#a855f7', border: '#c084fc', glow: 'rgba(168, 85, 247, 0.5)' },
  VIDEO: { bg: '#f97316', border: '#fb923c', glow: 'rgba(249, 115, 22, 0.5)' },
};

export const GraphExplorer: React.FC<GraphExplorerProps> = ({
  nodes,
  edges,
  onSelectNode,
  selectedNode
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // State for controls
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  
  // View transform state (Pan & Zoom)
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Pathfinder tool state
  const [isPathfinderOpen, setIsPathfinderOpen] = useState<boolean>(false);
  const [startNodeId, setStartNodeId] = useState<string>('');
  const [endNodeId, setEndNodeId] = useState<string>('');
  const [highlightedPath, setHighlightedPath] = useState<{ nodes: string[]; edges: string[] } | null>(null);

  // Position nodes physics simulation data
  const nodePositions = useRef<Map<string, { x: number; y: number; vx: number; vy: number; radius: number }>>(new Map());
  const draggingNodeId = useRef<string | null>(null);

  // Initialize node positions in a circular / physics cluster layout
  useEffect(() => {
    const width = 1000;
    const height = 650;
    const count = nodes.length;

    nodes.forEach((node, i) => {
      if (!nodePositions.current.has(node.id)) {
        const angle = (i / count) * 2 * Math.PI;
        const radiusDist = 180 + Math.random() * 120;
        const degree = memoryEngine.getNodeDegree(node.id);
        
        nodePositions.current.set(node.id, {
          x: width / 2 + Math.cos(angle) * radiusDist,
          y: height / 2 + Math.sin(angle) * radiusDist,
          vx: 0,
          vy: 0,
          radius: Math.max(16, Math.min(32, 16 + degree * 3))
        });
      }
    });
  }, [nodes]);

  // Filtered nodes & edges
  const filteredNodeIds = useMemo(() => {
    const ids = new Set<string>();
    nodes.forEach(node => {
      const matchesType = filterType === 'ALL' || node.type === filterType;
      const matchesSearch = !searchQuery || 
        node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (node.metadata?.tags && node.metadata.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      if (matchesType && matchesSearch) {
        ids.add(node.id);
      }
    });
    return ids;
  }, [nodes, filterType, searchQuery]);

  // Canvas Physics & Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // 1. Run Force Simulation Iteration
      const width = canvas.width;
      const height = canvas.height;

      const posMap = nodePositions.current;

      // Coulomb Repulsion
      const nodeArray = nodes.filter(n => filteredNodeIds.has(n.id));
      for (let i = 0; i < nodeArray.length; i++) {
        const nodeA = posMap.get(nodeArray[i].id);
        if (!nodeA) continue;

        for (let j = i + 1; j < nodeArray.length; j++) {
          const nodeB = posMap.get(nodeArray[j].id);
          if (!nodeB) continue;

          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const distSq = dx * dx + dy * dy + 0.1;
          const dist = Math.sqrt(distSq);

          if (dist < 350) {
            const force = 3800 / distSq;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (draggingNodeId.current !== nodeArray[i].id) {
              nodeA.vx -= fx;
              nodeA.vy -= fy;
            }
            if (draggingNodeId.current !== nodeArray[j].id) {
              nodeB.vx += fx;
              nodeB.vy += fy;
            }
          }
        }

        // Center Gravity
        const gx = (width / 2 - nodeA.x) * 0.008;
        const gy = (height / 2 - nodeA.y) * 0.008;
        if (draggingNodeId.current !== nodeArray[i].id) {
          nodeA.vx += gx;
          nodeA.vy += gy;
        }
      }

      // Hooke Spring Attraction along Edges
      edges.forEach(edge => {
        if (filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)) {
          const posA = posMap.get(edge.source);
          const posB = posMap.get(edge.target);
          if (posA && posB) {
            const dx = posB.x - posA.x;
            const dy = posB.y - posA.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const desiredDist = 140;
            const force = (dist - desiredDist) * 0.025;

            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (draggingNodeId.current !== edge.source) {
              posA.vx += fx;
              posA.vy += fy;
            }
            if (draggingNodeId.current !== edge.target) {
              posB.vx -= fx;
              posB.vy -= fy;
            }
          }
        }
      });

      // Position update & velocity damping
      nodeArray.forEach(node => {
        const pos = posMap.get(node.id);
        if (pos && draggingNodeId.current !== node.id) {
          pos.x += pos.vx;
          pos.y += pos.vy;
          pos.vx *= 0.82; // damping
          pos.vy *= 0.82;
        }
      });

      // 2. Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Save context for Pan & Zoom transform
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // 3. Draw Background Grid Lines
      ctx.strokeStyle = '#182032';
      ctx.lineWidth = 0.5;
      const gridSize = 40;
      for (let x = -500; x < width + 500; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, -500);
        ctx.lineTo(x, height + 500);
        ctx.stroke();
      }
      for (let y = -500; y < height + 500; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(-500, y);
        ctx.lineTo(width + 500, y);
        ctx.stroke();
      }

      // 4. Draw Edges
      edges.forEach(edge => {
        if (!filteredNodeIds.has(edge.source) || !filteredNodeIds.has(edge.target)) return;

        const posA = posMap.get(edge.source);
        const posB = posMap.get(edge.target);
        if (!posA || !posB) return;

        const isPathEdge = highlightedPath?.edges.includes(edge.id);
        const isHoverConnected = hoveredNodeId && (edge.source === hoveredNodeId || edge.target === hoveredNodeId);
        const isSelectedConnected = selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id);

        ctx.beginPath();
        ctx.moveTo(posA.x, posA.y);
        ctx.lineTo(posB.x, posB.y);

        if (isPathEdge) {
          ctx.strokeStyle = '#ec4899'; // Highlight path pink
          ctx.lineWidth = 4;
          ctx.setLineDash([]);
        } else if (isSelectedConnected || isHoverConnected) {
          ctx.strokeStyle = '#3b82f6'; // Bright blue
          ctx.lineWidth = 2.5;
          ctx.setLineDash([]);
        } else if (edge.autoDiscovered) {
          ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)'; // Auto discovered dashed pink
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 5]);
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = 1;
          ctx.setLineDash([]);
        }

        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Edge Label (if path edge or selected)
        if (isPathEdge || isSelectedConnected || isHoverConnected || zoom > 1.2) {
          const midX = (posA.x + posB.x) / 2;
          const midY = (posA.y + posB.y) / 2;
          
          ctx.fillStyle = '#0f1420';
          ctx.strokeStyle = edge.autoDiscovered ? '#ec4899' : '#3b82f6';
          ctx.lineWidth = 1;
          
          const labelText = edge.label || edge.type;
          ctx.font = '10px "JetBrains Mono", monospace';
          const textWidth = ctx.measureText(labelText).width;
          
          ctx.beginPath();
          ctx.roundRect(midX - textWidth / 2 - 4, midY - 8, textWidth + 8, 16, 4);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = edge.autoDiscovered ? '#f472b6' : '#93c5fd';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(labelText, midX, midY);
        }
      });

      // 5. Draw Nodes
      nodeArray.forEach(node => {
        const pos = posMap.get(node.id);
        if (!pos) return;

        const isHovered = hoveredNodeId === node.id;
        const isSelected = selectedNode?.id === node.id;
        const isPathNode = highlightedPath?.nodes.includes(node.id);
        const style = COLOR_MAP[node.type] || COLOR_MAP.DOCUMENT;

        // Draw Outer Glow for selected / path / hovered
        if (isSelected || isPathNode || isHovered) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, pos.radius + 10, 0, Math.PI * 2);
          ctx.fillStyle = isPathNode ? 'rgba(236, 72, 153, 0.3)' : style.glow;
          ctx.fill();
        }

        // Node Circle Base
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pos.radius, 0, Math.PI * 2);
        ctx.fillStyle = isPathNode ? '#ec4899' : style.bg;
        ctx.fill();

        ctx.lineWidth = isSelected || isHovered || isPathNode ? 3 : 1.5;
        ctx.strokeStyle = isPathNode ? '#f472b6' : (isSelected ? '#ffffff' : style.border);
        ctx.stroke();

        // Node Icon / Short Code Type
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.max(9, pos.radius * 0.5)}px "Inter", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const typeInitial = node.type.slice(0, 2);
        ctx.fillText(typeInitial, pos.x, pos.y);

        // Node Title Label (Below Circle)
        ctx.font = `${isHovered || isSelected ? 'bold' : '500'} 11px "Inter", sans-serif`;
        ctx.fillStyle = isSelected ? '#ffffff' : (isHovered ? '#60a5fa' : '#cbd5e1');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        const truncatedTitle = node.title.length > 24 ? node.title.slice(0, 22) + '...' : node.title;
        ctx.fillText(truncatedTitle, pos.x, pos.y + pos.radius + 6);
      });

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [nodes, edges, filteredNodeIds, pan, zoom, hoveredNodeId, selectedNode, highlightedPath]);

  // Handle Window Resize for Canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = Math.max(580, window.innerHeight - 220);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse Interaction Handlers for Canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - pan.x) / zoom;
    const clickY = (e.clientY - rect.top - pan.y) / zoom;

    // Check if clicked on any node
    let clickedNode: GraphNode | null = null;
    nodes.forEach(node => {
      if (!filteredNodeIds.has(node.id)) return;
      const pos = nodePositions.current.get(node.id);
      if (pos) {
        const dist = Math.sqrt((clickX - pos.x) ** 2 + (clickY - pos.y) ** 2);
        if (dist <= pos.radius) {
          clickedNode = node;
        }
      }
    });

    if (clickedNode) {
      draggingNodeId.current = (clickedNode as GraphNode).id;
      onSelectNode(clickedNode);
    } else {
      setIsPanning(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (draggingNodeId.current) {
      const rect = canvas.getBoundingClientRect();
      const newX = (e.clientX - rect.left - pan.x) / zoom;
      const newY = (e.clientY - rect.top - pan.y) / zoom;
      const pos = nodePositions.current.get(draggingNodeId.current);
      if (pos) {
        pos.x = newX;
        pos.y = newY;
        pos.vx = 0;
        pos.vy = 0;
      }
    } else if (isPanning) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else {
      // Hover detection
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - pan.x) / zoom;
      const mouseY = (e.clientY - rect.top - pan.y) / zoom;

      let hovered: string | null = null;
      nodes.forEach(node => {
        if (!filteredNodeIds.has(node.id)) return;
        const pos = nodePositions.current.get(node.id);
        if (pos) {
          const dist = Math.sqrt((mouseX - pos.x) ** 2 + (mouseY - pos.y) ** 2);
          if (dist <= pos.radius) {
            hovered = node.id;
          }
        }
      });
      setHoveredNodeId(hovered);
    }
  };

  const handleMouseUp = () => {
    draggingNodeId.current = null;
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom(prev => Math.min(2.5, Math.max(0.4, prev * zoomFactor)));
  };

  // Run Pathfinder
  const handleFindPath = () => {
    if (!startNodeId || !endNodeId) return;
    const path = memoryEngine.findShortestPath(startNodeId, endNodeId);
    setHighlightedPath(path);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-dark-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      
      {/* Top Filter & Toolbar Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-dark-800/80 border-b border-slate-800 z-10">
        
        {/* Entity Type Filter Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'ALL' ? 'bg-slate-200 text-dark-900' : 'bg-dark-700/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({nodes.length})
          </button>
          {(['PROJECT', 'DOCUMENT', 'CODE', 'EMAIL', 'CHAT', 'CONCEPT', 'TECHNOLOGY'] as EntityType[]).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                filterType === type 
                  ? 'bg-brand-blue/20 text-brand-blue border border-brand-blue/40 font-semibold' 
                  : 'bg-dark-700/40 text-slate-400 hover:text-slate-200 hover:bg-dark-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLOR_MAP[type].bg }} />
              <span>{type.charAt(0) + type.slice(1).toLowerCase()}s</span>
            </button>
          ))}
        </div>

        {/* Search Input & Pathfinder Toggle */}
        <div className="flex items-center space-x-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search graph..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 w-44 sm:w-56 bg-dark-900 border border-slate-700/70 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Pathfinder Tool Button */}
          <button
            onClick={() => setIsPathfinderOpen(!isPathfinderOpen)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
              isPathfinderOpen || highlightedPath
                ? 'bg-brand-pink/20 text-brand-pink border-brand-pink/50 font-semibold'
                : 'bg-dark-700/50 text-slate-300 border-slate-700 hover:bg-dark-700'
            }`}
          >
            <Route className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pathfinder</span>
          </button>
        </div>

      </div>

      {/* Pathfinder Tool Drawer Overlay */}
      {isPathfinderOpen && (
        <div className="absolute top-14 right-4 z-30 w-80 glass-panel-glow p-4 rounded-2xl shadow-2xl border border-brand-pink/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-brand-pink">
              <Route className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Shortest Path Finder</h4>
            </div>
            <button 
              onClick={() => { setIsPathfinderOpen(false); setHighlightedPath(null); }}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-300">
            Trace how AI discovers connections between any two knowledge entities in your graph.
          </p>

          <div className="space-y-2">
            <div>
              <label className="text-[10px] font-mono text-slate-400">Start Entity (Origin):</label>
              <select
                value={startNodeId}
                onChange={e => setStartNodeId(e.target.value)}
                className="w-full mt-1 p-2 bg-dark-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:border-brand-pink"
              >
                <option value="">-- Select Start Node --</option>
                {nodes.map(n => (
                  <option key={n.id} value={n.id}>[{n.type}] {n.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400">Target Entity (Destination):</label>
              <select
                value={endNodeId}
                onChange={e => setEndNodeId(e.target.value)}
                className="w-full mt-1 p-2 bg-dark-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:border-brand-pink"
              >
                <option value="">-- Select Target Node --</option>
                {nodes.map(n => (
                  <option key={n.id} value={n.id}>[{n.type}] {n.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => { setHighlightedPath(null); setStartNodeId(''); setEndNodeId(''); }}
              className="text-xs text-slate-400 hover:text-white"
            >
              Reset Path
            </button>
            <button
              onClick={handleFindPath}
              disabled={!startNodeId || !endNodeId}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-brand-pink to-brand-purple text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50"
            >
              Trace Connection Path
            </button>
          </div>

          {highlightedPath && (
            <div className="p-2.5 bg-dark-900/90 rounded-xl border border-brand-pink/40 text-xs space-y-1">
              <span className="text-brand-pink font-bold">Path Found! ({highlightedPath.nodes.length - 1} hops)</span>
              <div className="text-[11px] text-slate-300 space-y-1">
                {highlightedPath.nodes.map((nid, index) => {
                  const node = memoryEngine.getNodeById(nid);
                  return (
                    <div key={nid} className="flex items-center space-x-1">
                      <span className="text-slate-500 font-mono">{index + 1}.</span>
                      <span className="font-semibold text-slate-200">{node?.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Interactive Canvas */}
      <div className="relative flex-1 w-full h-full cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          className="w-full h-full block"
        />

        {/* Floating Zoom & Canvas Controls */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center space-x-1 glass-panel p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setZoom(z => Math.min(2.5, z * 1.2))}
            title="Zoom In"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-dark-700/50 rounded-lg"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(0.4, z / 1.2))}
            title="Zoom Out"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-dark-700/50 rounded-lg"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            title="Reset Pan & Zoom"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-dark-700/50 rounded-lg"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Graph Legend Overlay */}
        <div className="absolute bottom-4 right-4 z-20 hidden md:flex items-center space-x-3 glass-panel px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-blue"></span>
            <span>Project</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-purple"></span>
            <span>Doc</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-emerald"></span>
            <span>Code</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-amber"></span>
            <span>Email</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-pink"></span>
            <span>Auto-Link</span>
          </div>
        </div>

      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="w-full glass-panel border-t border-slate-800 p-4 max-h-56 overflow-y-auto space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLOR_MAP[selectedNode.type]?.bg }}
              />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                {selectedNode.type} • {selectedNode.source}
              </span>
              <h3 className="text-sm font-bold text-white">{selectedNode.title}</h3>
            </div>
            <button
              onClick={() => onSelectNode(null as any)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedNode.content}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {selectedNode.metadata?.tags?.map((t, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md bg-dark-700 text-[10px] font-mono text-slate-300">
                #{t}
              </span>
            ))}
            {selectedNode.sourceUri && (
              <a 
                href={selectedNode.sourceUri} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center space-x-1 text-xs text-brand-blue hover:underline"
              >
                <span>Open Source Repository</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
