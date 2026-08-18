import React, { useState } from 'react';
import { Mic, MicOff, Sparkles } from 'lucide-react';

interface VoiceQueryButtonProps {
  onVoiceTranscript: (transcript: string) => void;
}

export const VoiceQueryButton: React.FC<VoiceQueryButtonProps> = ({ onVoiceTranscript }) => {
  const [isListening, setIsListening] = useState<boolean>(false);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // Simulate speech recognition transcript callback
      setTimeout(() => {
        setIsListening(false);
        onVoiceTranscript("Show me everything connected to my flood prediction project.");
      }, 2500);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`p-2.5 rounded-xl border transition-all flex items-center space-x-1.5 text-xs font-semibold ${
        isListening
          ? 'bg-brand-pink text-white border-brand-pink animate-pulse shadow-lg shadow-brand-pink/40'
          : 'bg-dark-800 text-slate-300 border-slate-700 hover:border-brand-purple hover:text-white'
      }`}
      title={isListening ? "Listening to your voice query..." : "Speak Hands-Free Query"}
    >
      {isListening ? (
        <>
          <Mic className="w-4 h-4 text-white animate-bounce" />
          <span className="font-mono">Listening...</span>
        </>
      ) : (
        <>
          <MicOff className="w-4 h-4 text-slate-400" />
          <span className="hidden sm:inline">Voice Query</span>
        </>
      )}
    </button>
  );
};
