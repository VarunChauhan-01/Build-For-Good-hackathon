/**
 * Browser Support Detection Utility
 * Detects browser capabilities for speech recognition and media devices.
 */

import type { BrowserSupportInfo } from '../types/voice.types';

/**
 * Detect the current browser name from the user agent string.
 */
function detectBrowserName(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome/')) return 'Chrome';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Safari/') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Opera') || ua.includes('OPR/')) return 'Opera';
  return 'Unknown';
}

/**
 * Check whether the current browser supports all voice assistant features.
 */
export function checkBrowserSupport(): BrowserSupportInfo {
  const speechRecognition = !!(
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  );

  const mediaDevices = !!navigator.mediaDevices;
  const getUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  const browserName = detectBrowserName();

  return {
    speechRecognition,
    mediaDevices,
    getUserMedia,
    browserName,
    isFullySupported: speechRecognition && mediaDevices && getUserMedia,
  };
}

/**
 * Get a user-friendly message for unsupported browsers.
 */
export function getUnsupportedMessage(support: BrowserSupportInfo): string {
  if (support.isFullySupported) return '';

  if (!support.speechRecognition) {
    return `Speech recognition is not supported in ${support.browserName}. Please use Google Chrome or Microsoft Edge for voice features.`;
  }

  if (!support.getUserMedia) {
    return `Microphone access is not available in ${support.browserName}. Please use a modern browser like Chrome or Edge.`;
  }

  return `Some voice features may not work in ${support.browserName}. For the best experience, please use Google Chrome or Microsoft Edge.`;
}
