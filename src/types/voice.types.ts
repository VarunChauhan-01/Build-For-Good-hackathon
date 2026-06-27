/**
 * Voice Assistant Type Definitions
 * Shared types and interfaces for the voice assistant feature.
 */

// ─── Speech Recognition Types ─────────────────────────────────
export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export type SpeechRecognitionErrorCode =
  | 'not-allowed'
  | 'network'
  | 'no-speech'
  | 'audio-capture'
  | 'aborted'
  | 'service-not-allowed'
  | 'language-not-supported'
  | 'unknown';

export interface SpeechRecognitionErrorInfo {
  code: SpeechRecognitionErrorCode;
  message: string;
  isRetryable: boolean;
}

// ─── Microphone Permission Types ───────────────────────────────
export type MicPermissionStatus = 'granted' | 'denied' | 'prompt' | 'checking' | 'error';

export interface MicPermissionResult {
  status: MicPermissionStatus;
  error?: string;
  stream?: MediaStream;
}

// ─── Voice Assistant State ─────────────────────────────────────
export interface VoiceAssistantState {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  interimTranscript: string;
  error: SpeechRecognitionErrorInfo | null;
  permissionStatus: MicPermissionStatus;
  isSupported: boolean;
}

// ─── Chat Message Types ────────────────────────────────────────
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
  isVoice?: boolean;
}

// ─── Voice Context for multi-purpose voice usage ───────────────
export type VoiceContext = 'chat' | 'search' | 'apply' | 'registration' | null;

// ─── Browser Compatibility ─────────────────────────────────────
export interface BrowserSupportInfo {
  speechRecognition: boolean;
  mediaDevices: boolean;
  getUserMedia: boolean;
  browserName: string;
  isFullySupported: boolean;
}
