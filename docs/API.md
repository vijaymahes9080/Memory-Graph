# Memory Graph API Specification

Version: `v2.4-ai`  
Base URL: `http://localhost:3000/api/v1`

---

## 📡 REST API Endpoints

### 1. Ingest Knowledge Document
- **POST** `/api/v1/ingest`
- **Request Body**:
```json
{
  "title": "Satellite Telemetry Blueprint.pdf",
  "content": "Full radar specs...",
  "source": "PDF",
  "author": "Vijay Mahes"
}
```
- **Response**:
```json
{
  "status": "success",
  "newNodeId": "node-pdf-9921",
  "autoDiscoveredLinks": 2
}
```

### 2. Query Memory Graph (RAG Subgraph Traversal)
- **POST** `/api/v1/query`
- **Request Body**:
```json
{
  "query": "Show me everything connected to flood prediction"
}
```
- **Response**:
```json
{
  "confidence": 96,
  "narrative": "Based on your Memory Graph...",
  "subgraphNodes": [],
  "subgraphEdges": []
}
```

### 3. Trace Shortest Connection Path
- **GET** `/api/v1/pathfinder?startNodeId=node-pdf-1&endNodeId=node-code-1`

---

## 🔮 GraphQL Schema Definition

```graphql
type Node {
  id: ID!
  type: EntityType!
  title: String!
  content: String!
  source: SourceType!
  createdAt: String!
  edges: [Edge!]!
}

type Edge {
  id: ID!
  sourceNode: Node!
  targetNode: Node!
  type: RelationType!
  autoDiscovered: Boolean!
  confidenceScore: Float!
}

type Query {
  node(id: ID!): Node
  nodes(type: EntityType): [Node!]!
  shortestPath(startId: ID!, endId: ID!): [Node!]!
  ragQuery(query: String!): QueryResult!
}
```
