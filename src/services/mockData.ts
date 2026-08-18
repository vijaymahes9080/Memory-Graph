import { GraphNode, GraphEdge, DiscoveredRelationship, Contradiction, KnowledgeGap } from '../types/graph';

export const INITIAL_NODES: GraphNode[] = [
  {
    id: 'node-pdf-1',
    type: 'DOCUMENT',
    title: 'AI Disaster Command Center.pdf',
    content: 'Comprehensive blueprint detailing AI-driven disaster response, flood detection models, risk prediction matrix, and emergency evacuation protocols leveraging satellite imagery and IoT sensors.',
    source: 'PDF',
    createdAt: '2025-09-15T10:00:00Z',
    updatedAt: '2025-09-15T10:00:00Z',
    metadata: {
      author: 'Dr. Vijay Mahes',
      fileSize: '4.2 MB',
      tags: ['Flood Detection', 'GIS', 'Satellite', 'IoT', 'Evacuation'],
      summary: 'Outlines AI command infrastructure for flood detection and evacuation.'
    }
  },
  {
    id: 'node-project-1',
    type: 'PROJECT',
    title: 'Disaster Management Platform',
    content: 'Full-stack platform integrating real-time satellite telemetry, IoT river gauges, and machine learning inference for early flood detection and automated emergency notifications.',
    source: 'NOTE',
    createdAt: '2025-10-01T14:30:00Z',
    updatedAt: '2026-01-20T09:15:00Z',
    metadata: {
      author: 'Vijay Mahes',
      tags: ['Platform', 'Emergency Response', 'Flood Prediction'],
      summary: 'Main project organizing code, sensors, and research documents.'
    }
  },
  {
    id: 'node-concept-1',
    type: 'CONCEPT',
    title: 'Flood Detection & Risk Prediction',
    content: 'Core algorithmic methodology combining Synthetic Aperture Radar (SAR) satellite backscatter change detection with rainfall run-off neural predictions.',
    source: 'NOTE',
    createdAt: '2025-09-18T11:20:00Z',
    updatedAt: '2025-11-12T16:00:00Z',
    metadata: {
      tags: ['Algorithm', 'Flood Detection', 'SAR Imagery', 'Machine Learning']
    }
  },
  {
    id: 'node-tech-1',
    type: 'TECHNOLOGY',
    title: 'GIS & Satellite Telemetry (Sentinel-1)',
    content: 'Geographic Information System integration receiving European Space Agency Sentinel-1 C-band SAR imagery at 10m resolution for ground inundation mapping.',
    source: 'WEB',
    createdAt: '2025-09-20T08:00:00Z',
    updatedAt: '2025-09-20T08:00:00Z',
    metadata: {
      tags: ['GIS', 'Sentinel-1', 'Satellite', 'Remote Sensing']
    }
  },
  {
    id: 'node-tech-2',
    type: 'TECHNOLOGY',
    title: 'IoT Sensor Mesh & Telemetry',
    content: 'Low-power LoRaWAN water-level gauge mesh deployed along river basins transmitting real-time water flow rates every 60 seconds.',
    source: 'NOTE',
    createdAt: '2025-10-05T12:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
    metadata: {
      tags: ['IoT', 'LoRaWAN', 'Sensors', 'Telemetry']
    }
  },
  {
    id: 'node-code-1',
    type: 'CODE',
    title: 'Flood-Prediction-ML Repository',
    content: 'GitHub repo containing PyTorch U-Net model (`flood_unet.py`) for segmenting satellite water bodies and `sentinel_downloader.py` for automated SAR data retrieval.',
    source: 'GITHUB',
    sourceUri: 'https://github.com/vijaymahes9080/Flood-Prediction-ML',
    createdAt: '2025-11-04T15:45:00Z',
    updatedAt: '2026-02-10T18:22:00Z',
    metadata: {
      repoName: 'vijaymahes9080/Flood-Prediction-ML',
      linesOfCode: 14200,
      tags: ['PyTorch', 'Python', 'U-Net', 'Satellite Module', 'ML Prediction']
    }
  },
  {
    id: 'node-code-2',
    type: 'CODE',
    title: 'satellite_module.py',
    content: 'Python module implementing GeoTIFF clipping, Sentinel-1 VV/VH polarization normalization, and land mask filtering for input into the ML model.',
    source: 'GITHUB',
    createdAt: '2025-11-10T09:12:00Z',
    updatedAt: '2026-01-14T11:00:00Z',
    metadata: {
      repoName: 'vijaymahes9080/Flood-Prediction-ML',
      linesOfCode: 850,
      tags: ['Python', 'GeoPandas', 'Rasterio', 'Satellite']
    }
  },
  {
    id: 'node-email-1',
    type: 'EMAIL',
    title: 'Email: Satellite Imagery API Credentials & Quotas',
    content: 'Email exchange with ESA Copernicus Data Hub support confirming 50GB/day high-priority stream allocation for the Flood Prediction project.',
    source: 'EMAIL',
    createdAt: '2025-10-12T16:30:00Z',
    updatedAt: '2025-10-12T16:30:00Z',
    metadata: {
      author: 'copernicus-support@esa.int',
      tags: ['Email', 'API Quotas', 'Copernicus', 'Satellite']
    }
  },
  {
    id: 'node-chat-1',
    type: 'CHAT',
    title: 'Chat: Architecture Decision on Vector DB & Model Choice',
    content: 'Team chat transcript detailing the decision to use PyTorch over TensorFlow for SAR image segmentation due to native ONNX runtime optimization.',
    source: 'CHAT',
    createdAt: '2025-10-25T11:00:00Z',
    updatedAt: '2025-10-25T11:00:00Z',
    metadata: {
      author: 'Vijay Mahes & Dev Team',
      tags: ['Chat', 'Architecture', 'PyTorch', 'ONNX']
    }
  },
  {
    id: 'node-pdf-2',
    type: 'DOCUMENT',
    title: 'Agriculture & Crop Hydrology AI.pdf',
    content: 'Research paper analyzing river catchment inundation effects on agricultural yield using combined satellite radar and soil moisture sensors.',
    source: 'PDF',
    createdAt: '2026-01-15T14:00:00Z',
    updatedAt: '2026-01-15T14:00:00Z',
    metadata: {
      author: 'Dr. A. Sharma & Vijay Mahes',
      fileSize: '6.8 MB',
      tags: ['Agriculture', 'Hydrology', 'Soil Moisture', 'Radar']
    }
  },
  {
    id: 'node-person-1',
    type: 'PERSON',
    title: 'Dr. Vijay Mahes',
    content: 'Lead AI Researcher & Systems Architect specializing in Knowledge Graphs, Remote Sensing, and Multimodal Memory Engines.',
    source: 'NOTE',
    createdAt: '2025-09-01T00:00:00Z',
    updatedAt: '2026-02-18T00:00:00Z',
    metadata: {
      tags: ['Lead Architect', 'Author', 'AI Engineer']
    }
  }
];

export const INITIAL_EDGES: GraphEdge[] = [
  {
    id: 'edge-1',
    source: 'node-pdf-1',
    target: 'node-concept-1',
    type: 'MENTIONS',
    label: 'Outlines Algorithm',
    weight: 0.9,
    createdAt: '2025-09-15T10:05:00Z'
  },
  {
    id: 'edge-2',
    source: 'node-pdf-1',
    target: 'node-tech-1',
    type: 'REFERENCES',
    label: 'Uses GIS & Sentinel',
    weight: 0.85,
    createdAt: '2025-09-15T10:05:00Z'
  },
  {
    id: 'edge-3',
    source: 'node-pdf-1',
    target: 'node-tech-2',
    type: 'REFERENCES',
    label: 'Integrates Sensors',
    weight: 0.8,
    createdAt: '2025-09-15T10:05:00Z'
  },
  {
    id: 'edge-4',
    source: 'node-project-1',
    target: 'node-pdf-1',
    type: 'DERIVED_FROM',
    label: 'Based on Blueprint',
    weight: 0.95,
    createdAt: '2025-10-01T14:35:00Z'
  },
  {
    id: 'edge-5',
    source: 'node-code-1',
    target: 'node-concept-1',
    type: 'IMPLEMENTS',
    label: 'Implements Flood Model',
    autoDiscovered: true,
    reason: 'AI matched PyTorch U-Net code to algorithm described in PDF concept.',
    weight: 0.96,
    createdAt: '2025-11-04T16:00:00Z'
  },
  {
    id: 'edge-6',
    source: 'node-code-1',
    target: 'node-code-2',
    type: 'DEPENDS_ON',
    label: 'Imports Module',
    weight: 0.9,
    createdAt: '2025-11-10T09:15:00Z'
  },
  {
    id: 'edge-7',
    source: 'node-code-2',
    target: 'node-tech-1',
    type: 'IMPLEMENTS',
    label: 'Parses Sentinel SAR',
    autoDiscovered: true,
    reason: 'AI detected Sentinel-1 GeoTIFF preprocessing in satellite_module.py.',
    weight: 0.94,
    createdAt: '2025-11-10T09:20:00Z'
  },
  {
    id: 'edge-8',
    source: 'node-email-1',
    target: 'node-project-1',
    type: 'RELATED_TO',
    label: 'Confirms Data Quota',
    weight: 0.75,
    createdAt: '2025-10-12T16:32:00Z'
  },
  {
    id: 'edge-9',
    source: 'node-chat-1',
    target: 'node-code-1',
    type: 'CREATED_FROM',
    label: 'Decided PyTorch',
    weight: 0.88,
    createdAt: '2025-10-25T11:15:00Z'
  },
  {
    id: 'edge-10',
    source: 'node-pdf-2',
    target: 'node-concept-1',
    type: 'SAME_TOPIC',
    label: 'Cross-Domain Application',
    autoDiscovered: true,
    reason: 'AI correlated Agriculture hydrology model with Flood detection SAR imagery.',
    weight: 0.89,
    createdAt: '2026-01-15T14:10:00Z'
  },
  {
    id: 'edge-11',
    source: 'node-person-1',
    target: 'node-project-1',
    type: 'SAME_PROJECT',
    label: 'Lead Architect',
    weight: 0.99,
    createdAt: '2025-09-01T00:00:00Z'
  }
];

export const INITIAL_DISCOVERIES: DiscoveredRelationship[] = [
  {
    id: 'disc-1',
    sourceNodeId: 'node-code-1',
    targetNodeId: 'node-pdf-1',
    relationType: 'IMPLEMENTS',
    confidenceScore: 96,
    reasoning: 'The GitHub repo `Flood-Prediction-ML` contains PyTorch U-Net neural network code that directly implements the SAR backscatter flood segmentation math proposed in `AI Disaster Command Center.pdf`.',
    discoveredAt: '2026-02-15T10:00:00Z',
    isNew: true
  },
  {
    id: 'disc-2',
    sourceNodeId: 'node-pdf-2',
    targetNodeId: 'node-code-2',
    relationType: 'EXTENDS',
    confidenceScore: 89,
    reasoning: '`Agriculture & Crop Hydrology AI.pdf` reuses the exact Sentinel-1 preprocessing algorithm written in `satellite_module.py` for soil moisture indexing.',
    discoveredAt: '2026-02-16T14:30:00Z',
    isNew: true
  },
  {
    id: 'disc-3',
    sourceNodeId: 'node-chat-1',
    targetNodeId: 'node-email-1',
    relationType: 'DEPENDS_ON',
    confidenceScore: 84,
    reasoning: 'The technical decision in team chat regarding 10m Sentinel-1 image resolution required the ESA Copernicus high-priority stream credentials requested in Email #1042.',
    discoveredAt: '2026-02-17T09:12:00Z'
  }
];

export const INITIAL_CONTRADICTIONS: Contradiction[] = [
  {
    id: 'contra-1',
    nodeIdA: 'node-pdf-1',
    nodeIdB: 'node-code-1',
    titleA: 'AI Disaster Command Center PDF',
    titleB: 'Flood-Prediction-ML Repository',
    summary: 'Resolution Mismatch in Real-time Processing',
    conflictDetail: 'The PDF specification requires 1-minute real-time alert generation, whereas the GitHub PyTorch model implementation currently takes 14 seconds per batch with a 15-minute Sentinel update loop.',
    severity: 'MEDIUM'
  },
  {
    id: 'contra-2',
    nodeIdA: 'node-tech-2',
    nodeIdB: 'node-chat-1',
    titleA: 'IoT Sensor Mesh & Telemetry',
    titleB: 'Chat: Architecture Decision',
    summary: 'Communication Protocol Divergence',
    conflictDetail: 'The initial IoT hardware notes specified MQTT over Cellular 4G, but the later chat decision switched to LoRaWAN without updating battery lifespan requirements in the system architecture.',
    severity: 'LOW'
  }
];

export const INITIAL_GAPS: KnowledgeGap[] = [
  {
    id: 'gap-1',
    topic: 'Evacuation Route Graph Data',
    projectContext: 'Disaster Management Platform',
    missingElement: 'OpenStreetMap road network data ingestion module is missing for dynamic evacuation pathfinding.',
    recommendation: 'Ingest local transport GIS data or connect OpenStreetMap Routing API to complete the PDF requirement.'
  },
  {
    id: 'gap-2',
    topic: 'Ground Truth Water Gauge Calibration',
    projectContext: 'Flood Detection Model',
    missingElement: 'Lack of historical gauge calibration data during 2024 monsoon events.',
    recommendation: 'Upload historical sensor CSV logs for 2024 to improve U-Net segmentation accuracy.'
  }
];
