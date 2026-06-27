/**
 * useSpeechRecognition Hook
 * React hook that wraps the Web Speech API with explicit microphone permission
 * handling via navigator.mediaDevices.getUserMedia({ audio: true }).
 * Supports dynamic BCP-47 language switching (en-US, hi-IN, mr-IN, etc.).
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  requestMicrophonePermission,
  releaseMicrophoneStream,
} from '../utils/microphonePermission';
import { checkBrowserSupport, getUnsupportedMessage } from '../utils/browserSupport';
import type { MicPermissionStatus } from '../types/voice.types';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const BCP47_MAP: Record<string, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  mr: 'mr-IN',
  pa: 'pa-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  gu: 'gu-IN',
};

export interface UseSpeechRecognitionResult {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  error: string | null;
  startListening: (langCode?: string) => void;
  stopListening: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
  permissionGranted: boolean | null;
  retry: () => void;
}

export const useSpeechRecognition = (currentLang: string = 'en'): UseSpeechRecognitionResult => {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getBcp47 = (code: string) => BCP47_MAP[code] || code || 'en-US';

  // ─── Initialize SpeechRecognition ─────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const support = checkBrowserSupport();

    if (!support.speechRecognition) {
      setIsSupported(false);
      setError(getUnsupportedMessage(support));
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = getBcp47(currentLang);
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let currentInterim = '';
      let finalPart = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalPart += event.results[i][0].transcript;
        } else {
          currentInterim += event.results[i][0].transcript;
        }
      }

      if (finalPart) {
        setTranscript((prev) => (prev ? prev + ' ' + finalPart : finalPart));
      }
      setInterimTranscript(currentInterim);

      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      silenceTimeoutRef.current = setTimeout(() => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch {
            // Already stopped
          }
        }
      }, 3000);
    };

    recognition.onerror = (event: any) => {
      let errorMessage = 'Speech recognition error occurred.';
      switch (event.error) {
        case 'not-allowed':
          errorMessage = 'Microphone permission denied. Please allow access and retry.';
          setPermissionGranted(false);
          break;
        case 'network':
          errorMessage = 'Network warning during speech recognition. Retrying connection...';
          break;
        case 'no-speech':
          errorMessage = 'No speech detected. Please try speaking again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found or microphone disconnected.';
          break;
        case 'aborted':
          errorMessage = 'Speech recognition was stopped.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }
      setError(errorMessage);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  // Sync recognition language when currentLang prop changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = getBcp47(currentLang);
    }
  }, [currentLang]);

  const startListening = useCallback(async (langCode?: string) => {
    setError(null);
    setInterimTranscript('');

    if (!isSupported || !recognitionRef.current) {
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (langCode) {
      recognitionRef.current.lang = getBcp47(langCode);
    } else {
      recognitionRef.current.lang = getBcp47(currentLang);
    }

    const permResult = await requestMicrophonePermission();

    if (permResult.status === 'denied') {
      setPermissionGranted(false);
      setError(permResult.error || 'Microphone permission denied. Please allow access and retry.');
      return;
    }

    if (permResult.status === 'error') {
      setError(permResult.error || 'An error occurred accessing the microphone.');
      return;
    }

    setPermissionGranted(true);
    releaseMicrophoneStream(permResult.stream);

    try {
      recognitionRef.current.start();
    } catch (e) {
      if (e instanceof DOMException && e.name === 'InvalidStateError') {
        // Already listening
      } else {
        setError('Failed to start speech recognition. Please try again.');
      }
    }
  }, [isSupported, currentLang]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  const retry = useCallback(() => {
    setError(null);
    setTranscript('');
    setInterimTranscript('');
    startListening(currentLang);
  }, [startListening, currentLang]);

  return {
    transcript: transcript.trim(),
    interimTranscript: interimTranscript.trim(),
    isListening,
    error,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    permissionGranted,
    retry,
  };
};
