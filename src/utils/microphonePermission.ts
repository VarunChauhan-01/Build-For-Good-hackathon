/**
 * Microphone Permission Utility
 * Handles browser microphone permission checking and requesting
 * using navigator.mediaDevices.getUserMedia({ audio: true }).
 */

import type { MicPermissionResult, MicPermissionStatus } from '../types/voice.types';

/**
 * Request microphone access from the browser.
 * Returns a MicPermissionResult with status and optional stream.
 */
export async function requestMicrophonePermission(): Promise<MicPermissionResult> {
  // Check if mediaDevices API exists
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return {
      status: 'error',
      error: 'Your browser does not support microphone access. Please use Chrome, Edge, or Firefox.',
    };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return {
      status: 'granted',
      stream,
    };
  } catch (err: any) {
    if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
      return {
        status: 'denied',
        error: 'Microphone permission denied. Please allow access in your browser settings and try again.',
      };
    }

    if (err.name === 'NotFoundError' || err.name === 'OverconstrainedError') {
      return {
        status: 'error',
        error: 'No microphone found. Please connect a microphone and try again.',
      };
    }

    if (err.name === 'NotReadableError' || err.name === 'AbortError') {
      return {
        status: 'error',
        error: 'Microphone is already in use or disconnected. Please check your device.',
      };
    }

    return {
      status: 'error',
      error: 'An unexpected error occurred while accessing the microphone: ' + (err.message || 'Unknown error'),
    };
  }
}

/**
 * Release a MediaStream by stopping all tracks.
 * Call this after you no longer need direct access to the mic stream.
 */
export function releaseMicrophoneStream(stream: MediaStream | undefined): void {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
}

/**
 * Check the current microphone permission state without prompting the user.
 * Uses the Permissions API where available, falls back to 'prompt'.
 */
export async function checkMicrophonePermissionStatus(): Promise<MicPermissionStatus> {
  try {
    if (navigator.permissions) {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      if (result.state === 'granted') return 'granted';
      if (result.state === 'denied') return 'denied';
      return 'prompt';
    }
  } catch {
    // Permissions API not supported for microphone
  }
  return 'prompt';
}
