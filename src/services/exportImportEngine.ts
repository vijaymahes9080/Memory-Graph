import { GraphNode, GraphEdge } from '../types/graph';
import { memoryEngine } from './memoryEngine';

export class ExportImportEngine {
  // Export Memory Graph to JSON string
  public exportToJson(): string {
    const data = {
      version: '2.4',
      exportedAt: new Date().toISOString(),
      nodes: memoryEngine.getNodes(),
      edges: memoryEngine.getEdges(),
      discoveries: memoryEngine.getDiscoveries()
    };
    return JSON.stringify(data, null, 2);
  }

  // Export to Neo4j Cypher Script format
  public exportToCypher(): string {
    const nodes = memoryEngine.getNodes();
    const edges = memoryEngine.getEdges();

    let cypher = `// Memory Graph Neo4j Cypher Export\n// Generated at ${new Date().toISOString()}\n\n`;

    // Create Nodes
    nodes.forEach(node => {
      const cleanTitle = node.title.replace(/'/g, "\\'");
      cypher += `CREATE (:${node.type} {id: '${node.id}', title: '${cleanTitle}', source: '${node.source}'});\n`;
    });

    cypher += `\n// Create Edges\n`;
    edges.forEach(edge => {
      cypher += `MATCH (a {id: '${edge.source}'}), (b {id: '${edge.target}'})\n`;
      cypher += `CREATE (a)-[:${edge.type} {weight: ${edge.weight || 1.0}}]->(b);\n`;
    });

    return cypher;
  }

  // Export to Obsidian Markdown Vault format
  public exportToMarkdownVault(): Record<string, string> {
    const files: Record<string, string> = {};
    const nodes = memoryEngine.getNodes();

    nodes.forEach(node => {
      const fileName = `${node.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
      const connectedEdges = memoryEngine.getEdges().filter(e => e.source === node.id || e.target === node.id);
      
      let markdown = `# ${node.title}\n\n`;
      markdown += `**Type**: ${node.type}\n`;
      markdown += `**Source**: ${node.source}\n`;
      markdown += `**Created**: ${node.createdAt}\n\n`;
      markdown += `## Content\n${node.content}\n\n`;
      markdown += `## Connected Entities\n`;

      connectedEdges.forEach(edge => {
        const neighborId = edge.source === node.id ? edge.target : edge.source;
        const neighbor = memoryEngine.getNodeById(neighborId);
        if (neighbor) {
          markdown += `- [[${neighbor.title}]] (${edge.type})\n`;
        }
      });

      files[fileName] = markdown;
    });

    return files;
  }
}

export const exportImportEngine = new ExportImportEngine();
