/**
 * SpeechRecognition Service
 * A class-based wrapper around the Web Speech API SpeechRecognition interface.
 * Provides a clean, event-driven API for starting/stopping/managing recognition sessions.
 */

import type { SpeechRecognitionErrorInfo, SpeechRecognitionErrorCode } from '../types/voice.types';

// ─── Event Callbacks ───────────────────────────────────────────
export interface SpeechServiceCallbacks {
  onStart?: () => void;
  onResult?: (finalTranscript: string, interimTranscript: string) => void;
  onEnd?: () => void;
  onError?: (error: SpeechRecognitionErrorInfo) => void;
}

/**
 * Map raw SpeechRecognition error codes to user-friendly messages.
 */
function mapSpeechError(errorCode: string): SpeechRecognitionErrorInfo {
  const errorMap: Record<string, SpeechRecognitionErrorInfo> = {
    'not-allowed': {
      code: 'not-allowed',
      message: 'Microphone permission denied. Please allow access in your browser settings and try again.',
      isRetryable: true,
    },
    'network': {
      code: 'network',
      message: 'Network error occurred during speech recognition. Please check your internet connection.',
      isRetryable: true,
    },
    'no-speech': {
      code: 'no-speech',
      message: 'No speech was detected. Please try speaking again.',
      isRetryable: true,
    },
    'audio-capture': {
      code: 'audio-capture',
      message: 'No microphone found or microphone was disconnected. Please check your device.',
      isRetryable: true,
    },
    'aborted': {
      code: 'aborted',
      message: 'Speech recognition was aborted.',
      isRetryable: true,
    },
    'service-not-allowed': {
      code: 'service-not-allowed',
      message: 'Speech recognition service is not allowed. This may be a browser restriction.',
      isRetryable: false,
    },
    'language-not-supported': {
      code: 'language-not-supported',
      message: 'The selected language is not supported for speech recognition.',
      isRetryable: false,
    },
  };

  return (
    errorMap[errorCode] || {
      code: 'unknown' as SpeechRecognitionErrorCode,
      message: `An unexpected speech recognition error occurred: ${errorCode}`,
      isRetryable: true,
    }
  );
}

export class SpeechRecognitionService {
  private recognition: any = null;
  private silenceTimeout: ReturnType<typeof setTimeout> | null = null;
  private callbacks: SpeechServiceCallbacks = {};
  private _isListening: boolean = false;
  private _isSupported: boolean = false;
  private silenceDelay: number;

  constructor(lang: string = 'en-US', silenceDelay: number = 3000) {
    this.silenceDelay = silenceDelay;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this._isSupported = false;
      return;
    }

    this._isSupported = true;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = lang;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this._isListening = true;
      this.callbacks.onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      this.callbacks.onResult?.(finalTranscript, interimTranscript);

      // Reset silence timer on every result
      this.resetSilenceTimer();
    };

    this.recognition.onerror = (event: any) => {
      const errorInfo = mapSpeechError(event.error);
      this.callbacks.onError?.(errorInfo);
      this._isListening = false;
    };

    this.recognition.onend = () => {
      this._isListening = false;
      this.clearSilenceTimer();
      this.callbacks.onEnd?.();
    };
  }

  get isSupported(): boolean {
    return this._isSupported;
  }

  get isListening(): boolean {
    return this._isListening;
  }

  /**
   * Set callbacks for speech events.
   */
  setCallbacks(callbacks: SpeechServiceCallbacks): void {
    this.callbacks = callbacks;
  }

  /**
   * Start listening for speech.
   */
  start(): void {
    if (!this.recognition || this._isListening) return;

    try {
      this.recognition.start();
    } catch (e) {
      // InvalidStateError means it's already running; ignore
      if (e instanceof DOMException && e.name === 'InvalidStateError') {
        return;
      }
      this.callbacks.onError?.({
        code: 'unknown',
        message: 'Failed to start speech recognition. Please try again.',
        isRetryable: true,
      });
    }
  }

  /**
   * Stop listening for speech.
   */
  stop(): void {
    if (!this.recognition) return;
    this.clearSilenceTimer();
    try {
      this.recognition.stop();
    } catch {
      // Already stopped
    }
    this._isListening = false;
  }

  /**
   * Abort the current recognition session immediately.
   */
  abort(): void {
    if (!this.recognition) return;
    this.clearSilenceTimer();
    try {
      this.recognition.abort();
    } catch {
      // Already aborted
    }
    this._isListening = false;
  }

  /**
   * Change the recognition language on the fly.
   */
  setLanguage(lang: string): void {
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  /**
   * Cleanup: stop recognition and clear all timeouts.
   */
  destroy(): void {
    this.stop();
    this.recognition = null;
    this.callbacks = {};
  }

  // ─── Private Helpers ───────────────────────────────────────────
  private resetSilenceTimer(): void {
    this.clearSilenceTimer();
    this.silenceTimeout = setTimeout(() => {
      this.stop();
    }, this.silenceDelay);
  }

  private clearSilenceTimer(): void {
    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
      this.silenceTimeout = null;
    }
  }
}
