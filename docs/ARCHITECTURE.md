# Memory Graph System Architecture & Technical Specification

Memory Graph is an AI-powered Knowledge Infrastructure platform that continuously transforms scattered unstructured files, emails, chat transcripts, code repositories, and research papers into an interconnected semantic memory graph.

---

## 🏗️ Core Architectural Layers

```
┌────────────────────────────────────────────────────────────────────────┐
│                        UNIFIED INGESTION LAYER                         │
│   PDF • DOCX • GitHub Repos • Emails • Chat Transcripts • Audio Notes   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       AI UNDERSTANDING ENGINE                          │
│   Entity Recognizer • Multimodal Tokenizer • Vector Embedding Generator │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────┴─────────────────────────────────────┐
│                       KNOWLEDGE MEMORY MATRIX                          │
│   Graph Store (Nodes & Typed Edges) + Vector Cosine Distance Index    │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────┴─────────────────────────────────────┐
│                     AUTOMATED DISCOVERY PIPELINE                       │
│   Semantic Matching • Cross-Modal Linker • Contradiction Detector     │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────┴─────────────────────────────────────┐
│                          PRESENTATION VIEWS                            │
│   Physics Graph Explorer • RAG Assistant • Timeline • Insights Hub    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🔬 Mathematical Formulas

### 1. Vector Cosine Similarity
$$\text{Similarity}(A, B) = \frac{A \cdot B}{\|A\| \|B\|} = \frac{\sum_{i=1}^{n} A_i B_i}{\sqrt{\sum_{i=1}^{n} A_i^2} \sqrt{\sum_{i=1}^{n} B_i^2}}$$

### 2. Graph Physics Coulomb Repulsion Force
$$F_{\text{repulsion}} = \frac{k_{\text{repel}}}{d^2}$$

### 3. Hooke Spring Attraction along Edges
$$F_{\text{attraction}} = k_{\text{spring}} \cdot (d - d_{\text{desired}})$$

---

## ⚡ Key Graph Relationship Types

- `IMPLEMENTS`: Links source code repositories directly to mathematical document specifications.
- `SAME_TOPIC`: Connects cross-domain research papers sharing identical technical concepts.
- `REFERENCES`: Links project documentation to underlying GIS telemetry streams.
- `DEPENDS_ON`: Tracks code module dependencies and API quota approvals.
