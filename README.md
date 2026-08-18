# 🧠 Memory Graph — AI Knowledge Infrastructure

> **Don't store information. Build relationships between it.**
> An AI-powered operating system for personal knowledge that continuously ingests files, code repositories, notes, and communications, extracts entity graphs, and discovers hidden relationships.

---

![Memory Graph Header Banner](https://img.shields.io/badge/Memory--Graph-v2.4--AI--Core-3b82f6?style=for-the-badge&logo=react&logoColor=white)
![Build Status](https://img.shields.io/badge/Build-Passing-10b981?style=for-the-badge&logo=github-actions&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-8b5cf6?style=for-the-badge)

---

## 🌟 Vision & Core Concept

Traditional note-taking and cloud storage apps keep your information in isolated silos (PDFs in one folder, GitHub code in another, emails in your inbox).

**Memory Graph** changes this fundamental paradigm:

```
                    ┌──────────────┐
                    │     USER     │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        ↓                  ↓                  ↓
      PDF                CHAT               EMAIL
        │                  │                  │
        └──────────────┬───┴──────────────────┘
                       ↓
                ┌───────────────┐
                │   AI INGESTION │
                │   + EXTRACTION │
                └───────┬───────┘
                        ↓
             ┌─────────────────────┐
             │  ENTITY EXTRACTION  │
             │ People • Topics     │
             │ Projects • Places   │
             │ Concepts • Dates    │
             └──────────┬──────────┘
                        ↓
              ┌──────────────────┐
              │   MEMORY GRAPH   │
              │                  │
              │ A ─── B ─── C    │
              │ │     │     │    │
              │ D ─── E ─── F    │
              └────────┬─────────┘
                       ↓
              ┌──────────────────┐
              │ AI REASONING     │
              │ Search • RAG     │
              │ Insights • Links │
              │ Predictions      │
              └──────────────────┘
```

---

## 🔥 The Killer Feature: Continuous Relationship Discovery

Memory Graph doesn't rely solely on links manually created by the user. Its **AI Relationship Discovery Pipeline** continuously scans term frequencies, TF-IDF vector embeddings, and entity overlaps to discover implicit cross-source links:

- 📄 **PDF Blueprint** ➔ 💻 **GitHub Code**: Discovers that `satellite_module.py` implements the exact Sentinel-1 radar backscatter algorithm described in `AI Disaster Command Center.pdf`.
- 📧 **Email Credentials** ➔ 🚀 **Project**: Links ESA Copernicus API stream approval to your Flood Detection platform requirements.
- 🔬 **Research Paper** ➔ 🌾 **Agriculture Model**: Connects soil hydrology research papers to your satellite radar preprocessing code.

---

## 🖥️ Four Complementary Interface Views

1. **🕸️ Interactive Canvas Graph Explorer**: Physics-based graph rendering (Coulomb repulsion & Hooke spring attraction) with node filtering by entity type, shortest pathfinder tool, and detail inspector drawer.
2. **🔍 Subgraph RAG AI Assistant**: Conversational query engine that answers questions across connected papers and code repos with citation badges and inline evidence graphs.
3. **⏱️ Knowledge Evolution Timeline**: Interactive time scrubber (Sep 2025 – Feb 2026) allowing users to watch how knowledge evolved over time.
4. **⚡ Relationship Discovery & Insights Hub**: Live feed of AI-discovered links, contradiction detector cards, and project knowledge gap recommendations.

---

## 🚀 Quickstart & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Setup Commands

```bash
# 1. Clone Repository
git clone https://github.com/vijaymahes9080/Memory-Graph.git
cd Memory-Graph

# 2. Install Dependencies
npm install

# 3. Launch Development Server
npm run dev
```

Open your browser at `http://localhost:3000`.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, Vite 6, TailwindCSS, Lucide Icons, Canvas Physics Engine.
- **AI & Vector Core**: TF-IDF Embeddings Engine, Cosine Distance Matrix, BFS Shortest Pathfinder.
- **Graph Store**: In-Memory Graph Store with JSON, Neo4j Cypher, and Obsidian Markdown export modules.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author & Maintainer

**Vijay Mahes**  
- Email: [Vijaypradhap2004@gmail.com](mailto:Vijaypradhap2004@gmail.com)  
- GitHub: [@vijaymahes9080](https://github.com/vijaymahes9080)
