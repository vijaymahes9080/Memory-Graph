export interface MemoryWorkspace {
  id: string;
  name: string;
  description: string;
  owner: string;
  collaborators: string[];
  nodeCount: number;
  isShared: boolean;
  createdAt: string;
}

export interface NodeAnnotation {
  id: string;
  nodeId: string;
  author: string;
  comment: string;
  createdAt: string;
}
