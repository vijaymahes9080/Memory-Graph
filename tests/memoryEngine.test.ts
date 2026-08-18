import { memoryEngine } from '../src/services/memoryEngine';

describe('MemoryEngine Core Algorithms', () => {
  test('Initial Nodes and Edges Loaded', () => {
    const nodes = memoryEngine.getNodes();
    const edges = memoryEngine.getEdges();

    expect(nodes.length).toBeGreaterThan(5);
    expect(edges.length).toBeGreaterThan(5);
  });

  test('BFS Shortest Path Finder between PDF and Code', () => {
    const startNodeId = 'node-pdf-1';
    const endNodeId = 'node-code-1';

    const pathResult = memoryEngine.findShortestPath(startNodeId, endNodeId);

    expect(pathResult).not.toBeNull();
    expect(pathResult?.nodes.length).toBeGreaterThanOrEqual(2);
    expect(pathResult?.nodes[0]).toBe(startNodeId);
  });

  test('Multimodal Document Ingestion & Auto-Discovery', async () => {
    const title = 'Test Flood Drone Inspection Report.pdf';
    const content = 'Aerial drone SAR flood segmentation scan targeting river inundation and LoRaWAN IoT gauge telemetry.';
    const source = 'PDF';

    const initialDiscoveriesCount = memoryEngine.getDiscoveries().length;

    const result = await memoryEngine.ingestDocument(title, content, source);

    expect(result.newNode).toBeDefined();
    expect(result.newNode.title).toBe(title);
    expect(memoryEngine.getNodes()).toContainEqual(result.newNode);
    expect(memoryEngine.getDiscoveries().length).toBeGreaterThanOrEqual(initialDiscoveriesCount);
  });

  test('RAG AI Query Traversal Answer Synthesis', async () => {
    const query = 'Show me everything connected to flood prediction';
    const result = await memoryEngine.queryGraph(query);

    expect(result.query).toBe(query);
    expect(result.answer).toContain('Flood Detection');
    expect(result.subgraphNodes.length).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThan(70);
  });
});
