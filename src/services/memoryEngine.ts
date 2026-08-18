import { 
  GraphNode, 
  GraphEdge, 
  DiscoveredRelationship, 
  QueryResult, 
  EntityType, 
  RelationType, 
  SourceType,
  Contradiction,
  KnowledgeGap 
} from '../types/graph';
import { 
  INITIAL_NODES, 
  INITIAL_EDGES, 
  INITIAL_DISCOVERIES, 
  INITIAL_CONTRADICTIONS, 
  INITIAL_GAPS 
} from './mockData';

class MemoryEngine {
  private nodes: GraphNode[] = [];
  private edges: GraphEdge[] = [];
  private discoveries: DiscoveredRelationship[] = [];
  private contradictions: Contradiction[] = [];
  private gaps: KnowledgeGap[] = [];

  constructor() {
    // Initialize with mock data
    this.nodes = [...INITIAL_NODES];
    this.edges = [...INITIAL_EDGES];
    this.discoveries = [...INITIAL_DISCOVERIES];
    this.contradictions = [...INITIAL_CONTRADICTIONS];
    this.gaps = [...INITIAL_GAPS];
  }

  // Getters
  public getNodes(): GraphNode[] {
    return this.nodes;
  }

  public getEdges(): GraphEdge[] {
    return this.edges;
  }

  public getDiscoveries(): DiscoveredRelationship[] {
    return this.discoveries;
  }

  public getContradictions(): Contradiction[] {
    return this.contradictions;
  }

  public getGaps(): KnowledgeGap[] {
    return this.gaps;
  }

  public getNodeById(id: string): GraphNode | undefined {
    return this.nodes.find(n => n.id === id);
  }

  // Calculate Node Degree (# of connected edges)
  public getNodeDegree(nodeId: string): number {
    return this.edges.filter(e => e.source === nodeId || e.target === nodeId).length;
  }

  // Find shortest path between two nodes (BFS)
  public findShortestPath(startNodeId: string, endNodeId: string): { nodes: string[]; edges: string[] } | null {
    if (startNodeId === endNodeId) return { nodes: [startNodeId], edges: [] };

    const queue: { nodeId: string; pathNodes: string[]; pathEdges: string[] }[] = [
      { nodeId: startNodeId, pathNodes: [startNodeId], pathEdges: [] }
    ];
    const visited = new Set<string>([startNodeId]);

    while (queue.length > 0) {
      const { nodeId, pathNodes, pathEdges } = queue.shift()!;

      // Find all connected edges
      const connectedEdges = this.edges.filter(e => e.source === nodeId || e.target === nodeId);
      for (const edge of connectedEdges) {
        const neighborId = edge.source === nodeId ? edge.target : edge.source;

        if (neighborId === endNodeId) {
          return {
            nodes: [...pathNodes, neighborId],
            edges: [...pathEdges, edge.id]
          };
        }

        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          queue.push({
            nodeId: neighborId,
            pathNodes: [...pathNodes, neighborId],
            pathEdges: [...pathEdges, edge.id]
          });
        }
      }
    }

    return null; // No path found
  }

  // Entity Extraction & Ingestion Pipeline
  public async ingestDocument(
    title: string,
    content: string,
    source: SourceType,
    sourceUri?: string,
    author: string = 'Vijay Mahes'
  ): Promise<{ newNode: GraphNode; newEdges: GraphEdge[]; discoveries: DiscoveredRelationship[] }> {
    const timestamp = new Date().toISOString();
    const id = `node-${source.toLowerCase()}-${Date.now().toString().slice(-5)}`;

    // 1. Determine entity type based on content/source
    const entityType = this.classifyEntityType(title, content, source);

    // 2. Extract tags & summary
    const tags = this.extractTags(title + ' ' + content);
    const summary = content.length > 150 ? content.slice(0, 150) + '...' : content;

    const newNode: GraphNode = {
      id,
      type: entityType,
      title,
      content,
      source,
      sourceUri,
      createdAt: timestamp,
      updatedAt: timestamp,
      metadata: {
        author,
        tags,
        summary,
        fileSize: `${(content.length / 1024).toFixed(1)} KB`
      }
    };

    this.nodes.push(newNode);

    // 3. Perform AI Relationship Discovery across existing nodes
    const { newEdges, discoveries } = this.discoverRelationshipsForNode(newNode);

    return { newNode, newEdges, discoveries };
  }

  // Automatic Relationship Discovery Algorithm
  private discoverRelationshipsForNode(newNode: GraphNode): { newEdges: GraphEdge[]; discoveries: DiscoveredRelationship[] } {
    const createdEdges: GraphEdge[] = [];
    const createdDiscoveries: DiscoveredRelationship[] = [];

    const newNodeTokens = this.tokenize(newNode.title + ' ' + newNode.content + ' ' + (newNode.metadata?.tags?.join(' ') || ''));

    for (const existingNode of this.nodes) {
      if (existingNode.id === newNode.id) continue;

      const existingTokens = this.tokenize(existingNode.title + ' ' + existingNode.content + ' ' + (existingNode.metadata?.tags?.join(' ') || ''));
      const sim = this.calculateCosineSimilarity(newNodeTokens, existingTokens);

      // Check tag overlap
      const newTags = new Set(newNode.metadata?.tags || []);
      const existingTags = existingNode.metadata?.tags || [];
      const tagOverlap = existingTags.filter(t => newTags.has(t)).length;

      // Rule-based & semantic connection detection
      if (sim > 0.25 || tagOverlap >= 2) {
        let relationType: RelationType = 'RELATED_TO';
        let label = 'Connected Content';
        let reasoning = '';

        if (newNode.type === 'CODE' && existingNode.type === 'DOCUMENT') {
          relationType = 'IMPLEMENTS';
          label = 'Implements Doc Algorithm';
          reasoning = `AI discovered that code '${newNode.title}' implements the concepts described in '${existingNode.title}' based on shared technical terms (${(sim * 100).toFixed(0)}% semantic match).`;
        } else if (newNode.type === 'DOCUMENT' && existingNode.type === 'DOCUMENT') {
          relationType = 'SAME_TOPIC';
          label = 'Cross-Domain Topic';
          reasoning = `AI correlated '${newNode.title}' with '${existingNode.title}' via shared domain concepts: ${existingTags.slice(0, 3).join(', ')}.`;
        } else if (newNode.type === 'CODE' && existingNode.type === 'CODE') {
          relationType = 'DEPENDS_ON';
          label = 'Code Module Dependency';
          reasoning = `AI identified shared data structures and function calls between ${newNode.title} and ${existingNode.title}.`;
        } else if (newNode.type === 'EMAIL' || newNode.type === 'CHAT') {
          relationType = 'MENTIONS';
          label = 'Discusses Project';
          reasoning = `AI parsed communications in '${newNode.title}' linking requirement discussions to '${existingNode.title}'.`;
        } else {
          relationType = 'RELATED_TO';
          label = 'Semantic Relation';
          reasoning = `AI detected ${((sim + tagOverlap * 0.15) * 100).toFixed(0)}% contextual similarity between '${newNode.title}' and '${existingNode.title}'.`;
        }

        const confidenceScore = Math.min(98, Math.round((sim * 50) + (tagOverlap * 15) + 30));

        const edgeId = `edge-auto-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const newEdge: GraphEdge = {
          id: edgeId,
          source: newNode.id,
          target: existingNode.id,
          type: relationType,
          label,
          weight: confidenceScore / 100,
          autoDiscovered: true,
          reason: reasoning,
          createdAt: new Date().toISOString()
        };

        const discoveryId = `disc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const newDiscovery: DiscoveredRelationship = {
          id: discoveryId,
          sourceNodeId: newNode.id,
          targetNodeId: existingNode.id,
          relationType,
          confidenceScore,
          reasoning,
          discoveredAt: new Date().toISOString(),
          isNew: true
        };

        this.edges.push(newEdge);
        this.discoveries.unshift(newDiscovery);
        createdEdges.push(newEdge);
        createdDiscoveries.push(newDiscovery);
      }
    }

    return { newEdges: createdEdges, discoveries: createdDiscoveries };
  }

  // RAG & Reasoning AI Query Handler
  public async queryGraph(userQuery: string): Promise<QueryResult> {
    const queryTokens = this.tokenize(userQuery);

    // 1. Rank nodes by semantic similarity to query
    const scoredNodes = this.nodes.map(node => {
      const nodeText = `${node.title} ${node.content} ${node.metadata?.tags?.join(' ') || ''}`;
      const nodeTokens = this.tokenize(nodeText);
      const score = this.calculateCosineSimilarity(queryTokens, nodeTokens);
      return { node, score };
    }).sort((a, b) => b.score - a.score);

    // Pick top relevant nodes
    const topScored = scoredNodes.filter(n => n.score > 0.05).slice(0, 5);
    const relevantNodeIds = new Set(topScored.map(s => s.node.id));

    // 2. Traversal: include 1-hop connected neighbors
    const subgraphEdges = this.edges.filter(e => relevantNodeIds.has(e.source) || relevantNodeIds.has(e.target));
    subgraphEdges.forEach(e => {
      relevantNodeIds.add(e.source);
      relevantNodeIds.add(e.target);
    });

    const subgraphNodes = this.nodes.filter(n => relevantNodeIds.has(n.id));

    // 3. Formulate RAG Answer narrative
    let answerNarrative = '';
    const queryLower = userQuery.toLowerCase();

    if (queryLower.includes('flood') || queryLower.includes('disaster') || queryLower.includes('prediction')) {
      answerNarrative = `Based on your Memory Graph, **Flood Detection & Risk Prediction** is supported by a connected network of 6 nodes across research, code, sensors, and telemetry:\n\n` +
        `1. **Specification**: *AI Disaster Command Center.pdf* outlines the core SAR flood segmentation algorithm.\n` +
        `2. **Code Implementation**: *Flood-Prediction-ML Repository* implements this via ` + "`flood_unet.py`" + ` (PyTorch U-Net model) and *satellite_module.py* for GeoTIFF imagery normalization.\n` +
        `3. **Telemetry & Credentials**: ESA Copernicus email thread confirmed the Sentinel-1 satellite stream allocation, while LoRaWAN IoT sensors transmit ground river levels.\n` +
        `4. **Cross-Domain Extension**: *Agriculture & Crop Hydrology AI.pdf* extends this satellite preprocessing pipeline to soil moisture prediction.`;
    } else if (queryLower.includes('code') || queryLower.includes('implement') || queryLower.includes('github')) {
      answerNarrative = `Your Memory Graph shows that **Flood-Prediction-ML Repository** and ` + "`satellite_module.py`" + ` directly implement the algorithms specified in *AI Disaster Command Center.pdf*.\n\n` +
        `- **Technologies**: PyTorch, GeoPandas, Sentinel-1 SAR Radar.\n` +
        `- **Architecture Origin**: Decided during team chat on Oct 25, 2025 due to ONNX runtime optimization advantages.`;
    } else if (queryLower.includes('agriculture') || queryLower.includes('crop') || queryLower.includes('paper')) {
      answerNarrative = `Your research paper *Agriculture & Crop Hydrology AI.pdf* is automatically connected to your *Flood Prediction Project* because both share the same Sentinel-1 SAR satellite preprocessing pipeline written in ` + "`satellite_module.py`" + `.`;
    } else {
      const topTitle = topScored.length > 0 ? topScored[0].node.title : 'your knowledge network';
      answerNarrative = `Querying your Memory Graph identified **${subgraphNodes.length} connected entities** centered around **${topTitle}**.\n\n` +
        `The system extracted relevant relationships between your documents, code repositories, and notes to formulate this response.`;
    }

    const citations = topScored.map(s => ({
      nodeId: s.node.id,
      title: s.node.title,
      type: s.node.type,
      snippet: s.node.metadata?.summary || s.node.content.slice(0, 120) + '...'
    }));

    const insights = [
      `Auto-discovered link: ${subgraphEdges.filter(e => e.autoDiscovered).length} relationships were generated dynamically by AI.`,
      `Temporal span: Knowledge nodes range from Sep 2025 to Feb 2026.`
    ];

    return {
      query: userQuery,
      answer: answerNarrative,
      subgraphNodes,
      subgraphEdges,
      citations,
      confidence: Math.min(99, Math.max(75, Math.round((topScored[0]?.score || 0.5) * 100 + 40))),
      discoveredInsights: insights
    };
  }

  // Utility: Entity classification
  private classifyEntityType(title: string, content: string, source: SourceType): EntityType {
    const text = (title + ' ' + content).toLowerCase();
    if (source === 'GITHUB' || text.includes('repository') || text.includes('.py') || text.includes('.ts')) return 'CODE';
    if (source === 'EMAIL' || text.includes('subject:') || text.includes('from:')) return 'EMAIL';
    if (source === 'CHAT' || text.includes('chat') || text.includes('slack')) return 'CHAT';
    if (text.includes('project') || text.includes('platform')) return 'PROJECT';
    if (text.includes('algorithm') || text.includes('concept') || text.includes('theory')) return 'CONCEPT';
    if (text.includes('framework') || text.includes('api') || text.includes('technology')) return 'TECHNOLOGY';
    if (text.includes('dataset') || text.includes('data')) return 'DATASET';
    return 'DOCUMENT';
  }

  // Utility: Simple tag extractor
  private extractTags(text: string): string[] {
    const keywords = [
      'Flood Detection', 'Satellite', 'GIS', 'IoT', 'PyTorch', 'Python', 
      'Sentinel-1', 'Agriculture', 'Hydrology', 'Evacuation', 'LoRaWAN', 
      'U-Net', 'Radar', 'Copernicus', 'ML Prediction'
    ];
    return keywords.filter(kw => text.toLowerCase().includes(kw.toLowerCase()));
  }

  // Utility: Tokenizer
  private tokenize(text: string): Map<string, number> {
    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);
    const freq = new Map<string, number>();
    for (const w of words) {
      freq.set(w, (freq.get(w) || 0) + 1);
    }
    return freq;
  }

  // Utility: Cosine Similarity
  private calculateCosineSimilarity(vecA: Map<string, number>, vecB: Map<string, number>): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (const val of vecA.values()) normA += val * val;
    for (const val of vecB.values()) normB += val * val;

    if (normA === 0 || normB === 0) return 0;

    for (const [term, freqA] of vecA.entries()) {
      if (vecB.has(term)) {
        dotProduct += freqA * vecB.get(term)!;
      }
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

export const memoryEngine = new MemoryEngine();
