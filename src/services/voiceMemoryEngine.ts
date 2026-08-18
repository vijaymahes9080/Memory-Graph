import { SourceType, EntityType } from '../types/graph';
import { memoryEngine } from './memoryEngine';

export interface VoiceNoteTranscript {
  id: string;
  durationSeconds: number;
  spokenText: string;
  detectedEntities: string[];
  detectedActionItems: string[];
  speaker: string;
  timestamp: string;
}

class VoiceMemoryEngine {
  // Simulates processing raw audio voice input, performing speech-to-text, and extracting entities
  public async processVoiceAudio(
    spokenText: string,
    speaker: string = 'Vijay Mahes'
  ): Promise<{ transcript: VoiceNoteTranscript; ingestedNodeId: string }> {
    const timestamp = new Date().toISOString();
    const id = `voice-${Date.now()}`;

    // Extract action items (phrases starting with "need to", "must", "should", "will", "todo")
    const sentences = spokenText.split(/[.!?]+/);
    const actionItems = sentences.filter(s => 
      /need to|must|should|will|todo|fix|build|deploy|analyze/i.test(s)
    ).map(s => s.trim());

    // Extract entities
    const detectedEntities = memoryEngine.getNodes()
      .filter(n => spokenText.toLowerCase().includes(n.title.toLowerCase()) || 
                   (n.metadata?.tags && n.metadata.tags.some(t => spokenText.toLowerCase().includes(t.toLowerCase()))))
      .map(n => n.title);

    const transcript: VoiceNoteTranscript = {
      id,
      durationSeconds: Math.round(spokenText.split(' ').length * 0.45),
      spokenText,
      detectedEntities,
      detectedActionItems: actionItems,
      speaker,
      timestamp
    };

    // Ingest into Memory Graph as a NOTE entity with source AUDIO/NOTE
    const title = `Voice Note: ${spokenText.slice(0, 35)}...`;
    const { newNode } = await memoryEngine.ingestDocument(
      title,
      `[Voice Recording Transcript by ${speaker}]\n\n"${spokenText}"\n\nAction Items:\n${actionItems.map(a => `• ${a}`).join('\n')}`,
      'NOTE',
      undefined,
      speaker
    );

    return { transcript, ingestedNodeId: newNode.id };
  }
}

export const voiceMemoryEngine = new VoiceMemoryEngine();
