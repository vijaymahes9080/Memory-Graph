import { GraphNode, GraphEdge } from '../types/graph';
import { memoryEngine } from './memoryEngine';

export interface MemorySnapshot {
  id: string;
  name: string;
  timestamp: string;
  nodeCount: number;
  edgeCount: number;
  nodesSnapshot: GraphNode[];
  edgesSnapshot: GraphEdge[];
}

class SnapshotEngine {
  private snapshots: MemorySnapshot[] = [];

  public createSnapshot(name: string): MemorySnapshot {
    const nodes = memoryEngine.getNodes();
    const edges = memoryEngine.getEdges();

    const snapshot: MemorySnapshot = {
      id: `snap-${Date.now()}`,
      name,
      timestamp: new Date().toISOString(),
      nodeCount: nodes.length,
      edgeCount: edges.length,
      nodesSnapshot: JSON.parse(JSON.stringify(nodes)),
      edgesSnapshot: JSON.parse(JSON.stringify(edges))
    };

    this.snapshots.unshift(snapshot);
    return snapshot;
  }

  public getSnapshots(): MemorySnapshot[] {
    return this.snapshots;
  }
}

export const snapshotEngine = new SnapshotEngine();
