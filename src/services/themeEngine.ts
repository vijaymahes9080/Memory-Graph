export type ThemePreset = 
  | 'CYBERPUNK_DARK' 
  | 'OBSIDIAN_NIGHT' 
  | 'QUANTUM_EMERALD' 
  | 'NEON_VIOLET';

export interface ThemeConfig {
  id: ThemePreset;
  name: string;
  bgColor: string;
  panelColor: string;
  accentColor: string;
  nodeHighlight: string;
}

export class ThemeEngine {
  private themes: Record<ThemePreset, ThemeConfig> = {
    CYBERPUNK_DARK: {
      id: 'CYBERPUNK_DARK',
      name: 'Cyberpunk Dark Neon',
      bgColor: '#07090e',
      panelColor: '#0f1420',
      accentColor: '#3b82f6',
      nodeHighlight: '#ec4899'
    },
    OBSIDIAN_NIGHT: {
      id: 'OBSIDIAN_NIGHT',
      name: 'Obsidian Midnight',
      bgColor: '#0a0a0f',
      panelColor: '#121218',
      accentColor: '#8b5cf6',
      nodeHighlight: '#f59e0b'
    },
    QUANTUM_EMERALD: {
      id: 'QUANTUM_EMERALD',
      name: 'Quantum Emerald Matrix',
      bgColor: '#06130e',
      panelColor: '#0c2018',
      accentColor: '#10b981',
      nodeHighlight: '#06b6d4'
    },
    NEON_VIOLET: {
      id: 'NEON_VIOLET',
      name: 'Neon Cyber Violet',
      bgColor: '#0f0919',
      panelColor: '#1a102b',
      accentColor: '#ec4899',
      nodeHighlight: '#8b5cf6'
    }
  };

  private currentTheme: ThemePreset = 'CYBERPUNK_DARK';

  public getThemes(): ThemeConfig[] {
    return Object.values(this.themes);
  }

  public getCurrentTheme(): ThemeConfig {
    return this.themes[this.currentTheme];
  }

  public setTheme(themeId: ThemePreset): ThemeConfig {
    this.currentTheme = themeId;
    return this.themes[themeId];
  }
}

export const themeEngine = new ThemeEngine();
