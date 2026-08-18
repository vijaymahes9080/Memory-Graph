export interface ExtractedCodeSymbol {
  name: string;
  kind: 'FUNCTION' | 'CLASS' | 'IMPORT' | 'VARIABLE';
  lineNumber: number;
  docstring?: string;
}

export class CodeAstEngine {
  // Parse code text to extract functions, imports, and classes
  public extractSymbols(codeText: string): ExtractedCodeSymbol[] {
    const symbols: ExtractedCodeSymbol[] = [];
    const lines = codeText.split('\n');

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Python / JS Function definition
      if (trimmed.startsWith('def ') || trimmed.startsWith('function ') || /const \w+ = \(.*\) =>/.test(trimmed)) {
        const nameMatch = trimmed.match(/(?:def|function)\s+([a-zA-Z0-9_]+)/) || trimmed.match(/const\s+([a-zA-Z0-9_]+)/);
        if (nameMatch) {
          symbols.push({
            name: nameMatch[1],
            kind: 'FUNCTION',
            lineNumber: index + 1
          });
        }
      }

      // Class definition
      if (trimmed.startsWith('class ')) {
        const classMatch = trimmed.match(/class\s+([a-zA-Z0-9_]+)/);
        if (classMatch) {
          symbols.push({
            name: classMatch[1],
            kind: 'CLASS',
            lineNumber: index + 1
          });
        }
      }

      // Imports
      if (trimmed.startsWith('import ') || trimmed.startsWith('from ')) {
        symbols.push({
          name: trimmed.slice(0, 30),
          kind: 'IMPORT',
          lineNumber: index + 1
        });
      }
    });

    return symbols;
  }
}

export const codeAstEngine = new CodeAstEngine();
