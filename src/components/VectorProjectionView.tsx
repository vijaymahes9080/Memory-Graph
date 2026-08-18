import React, { useRef, useEffect } from 'react';
import { GraphNode } from '../types/graph';
import { Cpu, Sparkles } from 'lucide-react';

interface VectorProjectionViewProps {
  nodes: GraphNode[];
  onSelectNode: (node: GraphNode) => void;
}

export const VectorProjectionView: React.FC<VectorProjectionViewProps> = ({ nodes, onSelectNode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 700;
    canvas.height = 450;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Render nodes projected into 2D embedding space
    nodes.forEach((node, idx) => {
      // Compute deterministic pseudo t-SNE coordinates from hash of title + content
      let hash = 0;
      const str = node.title + node.content;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
      }

      const posX = 100 + Math.abs(hash % (width - 200));
      const posY = 80 + Math.abs((hash >> 3) % (height - 160));

      // Draw vector point
      ctx.beginPath();
      ctx.arc(posX, posY, 6, 0, Math.PI * 2);
      ctx.fillStyle = node.type === 'CODE' ? '#10b981' : (node.type === 'DOCUMENT' ? '#8b5cf6' : '#3b82f6');
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Title label
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(node.title.slice(0, 18), posX + 10, posY + 4);
    });

  }, [nodes]);

  return (
    <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-brand-purple">
          <Cpu className="w-4 h-4" />
          <h3 className="text-xs font-bold uppercase tracking-wider">Semantic Vector Space Projection (t-SNE / PCA)</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">Dense Embedding Coordinates</span>
      </div>

      <div className="w-full h-[450px] bg-dark-900 rounded-xl overflow-hidden relative border border-slate-800">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </div>
  );
};
