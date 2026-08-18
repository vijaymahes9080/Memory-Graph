export type EntityType = 
  | 'PROJECT'
  | 'DOCUMENT'
  | 'CODE'
  | 'EMAIL'
  | 'CHAT'
  | 'CONCEPT'
  | 'TECHNOLOGY'
  | 'PERSON'
  | 'DATASET'
  | 'NOTE'
  | 'VIDEO';

export type RelationType = 
  | 'RELATED_TO'
  | 'MENTIONS'
  | 'DERIVED_FROM'
  | 'REFERENCES'
  | 'IMPLEMENTS'
  | 'DEPENDS_ON'
  | 'CREATED_FROM'
  | 'SAME_TOPIC'
  | 'SAME_PROJECT'
  | 'CONTRADICTS'
  | 'EXTENDS';

export type SourceType = 
  | 'PDF'
  | 'DOCX'
  | 'GITHUB'
  | 'EMAIL'
  | 'CHAT'
  | 'VIDEO'
  | 'NOTE'
  | 'WEB';

export interface GraphNode {
  id: string;
  type: EntityType;
  title: string;
  content: string;
  source: SourceType;
  sourceUri?: string;
  createdAt: string; // ISO date string or timestamp
  updatedAt: string;
  metadata?: {
    author?: string;
    fileSize?: string;
    repoName?: string;
    linesOfCode?: number;
    tags?: string[];
    confidence?: number;
    confidenceScore?: number;
    summary?: string;
    [key: string]: any;
  };
  // Canvas physics layout coordinates
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface GraphEdge {
  id: string;
  source: string; // source node ID
  target: string; // target node ID
  type: RelationType;
  label?: string;
  weight?: number; // 0 to 1
  autoDiscovered?: boolean;
  reason?: string;
  createdAt: string;
}

export interface DiscoveredRelationship {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationType: RelationType;
  confidenceScore: number; // 0-100%
  reasoning: string;
  discoveredAt: string;
  isNew?: boolean;
}

export interface QueryResult {
  query: string;
  answer: string;
  subgraphNodes: GraphNode[];
  subgraphEdges: GraphEdge[];
  citations: {
    nodeId: string;
    title: string;
    type: EntityType;
    snippet: string;
  }[];
  confidence: number;
  discoveredInsights?: string[];
}

export interface Contradiction {
  id: string;
  nodeIdA: string;
  nodeIdB: string;
  titleA: string;
  titleB: string;
  summary: string;
  conflictDetail: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface KnowledgeGap {
  id: string;
  topic: string;
  projectContext: string;
  missingElement: string;
  recommendation: string;
}
