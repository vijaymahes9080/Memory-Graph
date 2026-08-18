# 🧠 Memory Graph — AI Knowledge Infrastructure

> **Don't store information. Build relationships between it.**  
> An AI-powered operating system for personal knowledge that continuously ingests files, code repositories, notes, and communications, extracts entity graphs, and discovers hidden relationships.

---

<div align="center">

![Memory Graph Header Banner](https://images.openai.com/static-rsc-4/WWqVjFtNaz2_TXNscmqDq0kNF59bxSZd_0-tCVhQwBdRuetWvocexzYYdtCLKfb6aTtdOF4WnzG3oPYgANso1IWDX7Wu5OrwPDY4ba9-CmuNoC3TJUdWdFVwOOxIvvK_IOSpsYR2Kwg6gShT9OC2N74JGJzpVJZSahlXkMh4DjoHv_EhuJ-trsK2mCFQYosq?purpose=fullsize)

![Memory Graph Version](https://img.shields.io/badge/Memory--Graph-v2.4--AI--Core-3b82f6?style=for-the-badge&logo=react&logoColor=white)
![Build Status](https://img.shields.io/badge/Build-Passing-10b981?style=for-the-badge&logo=github-actions&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-8b5cf6?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-06b6d4?style=for-the-badge&logo=typescript&logoColor=white)

</div>

---

## 🌟 Core Concept: Everything Becomes Connected

Traditional apps store information as isolated files. **Memory Graph** continuously extracts entities (People, Topics, Projects, Technologies, Concepts, Datasets, Dates) and connects them into a living memory network.

```mermaid
graph TD
    User([USER]) --> PDF[PDF Document]
    User --> Chat[Chat History]
    User --> Email[Email Threads]
    User --> Code[GitHub Code]
    
    PDF --> Ingest[AI Ingestion & Entity Extractor]
    Chat --> Ingest
    Email --> Ingest
    Code --> Ingest
    
    Ingest --> Entities[Entities: People • Topics • Code • Concepts • Dates]
    Entities --> Graph[Memory Knowledge Graph]
    
    Graph --> RAG[RAG AI Reasoning & Search Engine]
    Graph --> Discovery[Automatic Relationship Discovery]
    Graph --> Timeline[Temporal Knowledge Evolution Timeline]
```

<div align="center">

![Connected Knowledge Architecture](https://images.openai.com/static-rsc-4/FC8LmkyELkqUehF9Jbc_Ey33LT-6yp6VOsFQBFcA56vioEiejsGiRjwk2GqBLhUQgwfBCoaICFtT_d8Q-E5zEZU2CmJFoBX0CM1drFI1Em_-BUPcqXaySuYUCG94KV7ZzwQILxk-TD_7uDOJvozpnECzp4jyCvBDTYkFGLy4tiF29IScVDxahN_StzW94bpu?purpose=fullsize)  
*Figure 1: Multimodal Knowledge Memory Graph connecting PDFs, GitHub code repos, IoT emails, and research papers.*

</div>

---

## 🔥 The Killer Feature: Automatic Relationship Discovery

Memory Graph automatically discovers non-obvious relationships that the user never explicitly created.

<div align="center">

![Automatic Relationship Discovery Matrix](https://images.openai.com/static-rsc-4/eV71Y5PKDAC883DxQw0YeoweS2l8mPZKNN_gDh4tTBbLY8MCdPjPUIOZbLcF7BRs66-LISUAJeFW_IoDHTvxiuGK5UxtYDal32JS80tt-AhLZB2M5kzpAbyaJq-461RGl5k_pzjhXW9tDQw5nARt1_JljTPonLZCcPf42QGeIv08MlbqgrStAgmDLWk94DgP?purpose=fullsize)  
*Figure 2: Automatic link discovery between PDF specification blueprints, PyTorch ML code modules, and research papers.*

</div>

```
                  ┌──────────────────────────────────────────────┐
                  │    AI DISASTER COMMAND CENTER (PDF)          │
                  │    • SAR Radar Flood Detection Spec          │
                  └──────────────────────┬───────────────────────┘
                                         │
                        ⚡ AI Auto-Discovered: IMPLEMENTS
                                         │
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │    FLOOD-PREDICTION-ML (GitHub Repo)         │
                  │    • PyTorch U-Net Model (flood_unet.py)     │
                  │    • GeoTIFF Normalizer (satellite_module.py)│
                  └──────────────────────┬───────────────────────┘
                                         │
                        ⚡ AI Auto-Discovered: EXTENDS
                                         │
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │    AGRICULTURE & CROP HYDROLOGY AI (PDF)     │
                  │    • Soil moisture & crop yield prediction   │
                  └──────────────────────────────────────────────┘
```

### Real-World Discovery Examples
- 📄 **"This research paper is related to your code because it reuses the same Sentinel-1 satellite radar preprocessing script."**
- 📧 **"This email thread contains the Copernicus API data quota required by your PyTorch U-Net model."**
- 💬 **"This team chat decision from 6 months ago explains why PyTorch was chosen over TensorFlow."**

---

## 🎨 Four Complementary Interface Views

| View | Purpose | Visual Highlights |
| :--- | :--- | :--- |
| **🕸️ Graph Explorer** | Interactive 2D/3D Force Graph | Physics repulsion loop, shortest pathfinder tool, node filtering by type, zoom/pan. |
| **🔍 RAG AI Assistant** | Conversational Knowledge Query | Subgraph traversal, evidence node citations, confidence metrics, smart prompt chips. |
| **⏱️ Evolution Timeline** | Temporal Knowledge Scrubbing | Scrub through dates (Sep 2025 – Feb 2026), watch knowledge nodes emerge sequentially. |
| **⚡ Relationship Hub** | AI Discovered Links & Insights | Discovered links feed with AI reasoning, contradiction detector, and knowledge gap advice. |

<div align="center">

![Interactive Physics Graph Explorer](https://images.openai.com/static-rsc-4/TZfpQVP1WPyxHNGJZAay3bDYeaxzTN_b9Vqxs3I-nEYvvyUvZll4IzfUmipzJyEKfWemM6FD8o3t7Il6P1L4u3vv6v88oeHtstql5WOL5tfAu-KtjKCz-LdIc3cfBbpsE9udQQrAaD6n0lusb2oVpo2pDa11zx9MMfWlQN_UiowDm5p2lDEn_CIjrrGjBKiV?purpose=fullsize)  
*Figure 3: Interactive Force-Directed Canvas Graph Explorer with shortest pathfinder.*

</div>

<div align="center">

![RAG AI Assistant & Reality Search Engine](https://images.openai.com/static-rsc-4/9I45Bb0vsWteHYsr3lOa046Jj0s7VSevDbah0Wcjx_XpjTu7m6V7GWItHnSbfn6yQ3Fc_d2MwEvzR8ePnLxATk7Gl2qnf9HHP3KcNqzmlRwATnrhwBahyngWMARfOzcmIL42v8y8-FQ1r1JFZrHJyihLPSq8i5I1dsrc_uu3Hw9z7YIqBtayo1JnPMhKfO5U?purpose=fullsize)  
*Figure 4: RAG Subgraph Traversal Assistant generating connected narrative answers with evidence citations.*

</div>

---

## 🏗️ Architecture & Multimodal Pipeline

```
                               ┌────────────────────────────────┐
                               │     USER INGESTION INTERFACE   │
                               │  PDF • Chat • Email • GitHub   │
                               │  Video • Notes • Web Documents │
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │  MULTIMODAL PARSER & CLEANER  │
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │   AI ENTITY & CONCEPT EXTRACTOR │
                               │  Topics, Tech, Projects, Dates │
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                      ┌────────────────────────┴────────────────────────┐
                      ▼                                                 ▼
        ┌───────────────────────────┐                     ┌───────────────────────────┐
        │   VECTOR EMBEDDING INDEX  │                     │   GRAPH DATABASE STORE    │
        │ TF-IDF / Cosine Similarity│                     │   Nodes & Typed Edges     │
        └─────────────┬─────────────┘                     └─────────────┬─────────────┘
                      │                                                 │
                      └────────────────────────┬────────────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │  AUTO-RELATIONSHIP DISCOVERY   │
                               │   Implicit Link Discovery Engine│
                               └────────────────────────────────┘
```

<div align="center">

![Temporal Knowledge Timeline](https://images.openai.com/static-rsc-4/EooHwKH3t1t5X2LlXCaS3Prbl-IxpCet27s_e5ZXAXLHaaRe1Q4wamrFFU5cdV55dy3XnfYhk6e3XJ7Sge-H_-h0Fk9mlUivCHk8Z3k2Z9H7iOTsxmQw6zX15NQybj66EFw5m9CSjPKL5WKwKjwfxtHvz4txow87yElDdE0HfS1Ezu5haxEVDWNsr9XjSt2Y?purpose=fullsize)  
*Figure 5: Temporal Memory Scrubbing view displaying knowledge evolution over time.*

</div>

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js** (v18.0 or higher)
- **npm** (v9.0 or higher)

### Setup & Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/vijaymahes9080/Memory-Graph.git
cd Memory-Graph

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Build production bundle
npm run build
```

Open `http://localhost:3000` in your browser.

---

## 🧪 Comprehensive Feature Modules

- **Voice Memory Engine**: Speech-to-text transcript processing and audio entity extraction.
- **Taxonomy MindMap View**: Structured domain tree view organizing entities by type.
- **Graph Analytics Dashboard**: Density metrics, automated link ratios, and type distribution charts.
- **Visual Pattern Query Builder**: Construct visual pattern match queries `(Doc) -[IMPLEMENTS]-> (Code)`.
- **Vector Space 2D Projection**: t-SNE / PCA style visual dimensional projection of text embeddings.
- **Multi-Format Exporter**: Export memory graph to JSON, Cypher (Neo4j), and Obsidian Markdown Vault.
- **Graph Time Machine**: Capture, label, and compare historical graph snapshots.

---

## 📄 License

Distributed under the **MIT License** — see [LICENSE](LICENSE) for full details.

---

## 👤 Author & Maintainer

**Vijay Mahes**  
- Email: [Vijaypradhap2004@gmail.com](mailto:Vijaypradhap2004@gmail.com)  
- GitHub: [@vijaymahes9080](https://github.com/vijaymahes9080)
