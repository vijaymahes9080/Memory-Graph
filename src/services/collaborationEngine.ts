import { MemoryWorkspace, NodeAnnotation } from '../types/collaboration';

class CollaborationEngine {
  private workspaces: MemoryWorkspace[] = [
    {
      id: 'ws-main',
      name: 'Disaster & Remote Sensing Graph',
      description: 'Primary memory graph for Flood Detection, Satellite IoT, and ML research.',
      owner: 'Vijay Mahes',
      collaborators: ['Dr. A. Sharma', 'Copernicus Team'],
      nodeCount: 11,
      isShared: true,
      createdAt: '2025-09-01T00:00:00Z'
    }
  ];

  private annotations: NodeAnnotation[] = [
    {
      id: 'anno-1',
      nodeId: 'node-code-1',
      author: 'Vijay Mahes',
      comment: 'PyTorch U-Net segmentation verified with 94.2% mIoU accuracy.',
      createdAt: '2026-01-10T12:00:00Z'
    }
  ];

  public getWorkspaces(): MemoryWorkspace[] {
    return this.workspaces;
  }

  public getAnnotationsForNode(nodeId: string): NodeAnnotation[] {
    return this.annotations.filter(a => a.nodeId === nodeId);
  }

  public addAnnotation(nodeId: string, comment: string, author: string = 'Vijay Mahes'): NodeAnnotation {
    const newAnno: NodeAnnotation = {
      id: `anno-${Date.now()}`,
      nodeId,
      author,
      comment,
      createdAt: new Date().toISOString()
    };
    this.annotations.push(newAnno);
    return newAnno;
  }
}

export const collaborationEngine = new CollaborationEngine();
