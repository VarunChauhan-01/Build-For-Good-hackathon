/**
 * Voice AI Response Service
 * Handles AI response generation for the voice assistant chat.
 * In production, this would call a real backend API.
 * Currently provides intelligent keyword-based responses for the hackathon demo.
 */

import type { ChatMessage } from '../types/voice.types';

// ─── Response patterns for keyword matching ────────────────────
const RESPONSE_PATTERNS: Array<{
  keywords: string[];
  response: string;
  priority: number;
}> = [
  {
    keywords: ['hello', 'hi', 'hey', 'namaste', 'namaskar'],
    response: 'Namaste! 🙏 How can I help you today? I can assist with finding jobs, agriculture support, profile verification, and more.',
    priority: 1,
  },
  {
    keywords: ['job', 'work', 'kaam', 'rozgar', 'employment', 'naukri'],
    response: 'I can help you find local jobs! We have openings in Agriculture, Carpentry, Electrician, Painting, Plumbing, and Daily Wage categories. Would you like me to search for a specific type of work?',
    priority: 2,
  },
  {
    keywords: ['farm', 'agriculture', 'kheti', 'crop', 'harvest', 'kisan', 'tractor'],
    response: 'Our Farmer Hub has listings for agricultural jobs, equipment rental, and farm labor. We can connect you with verified farmers in your area. Would you like to visit the Farmer Hub?',
    priority: 2,
  },
  {
    keywords: ['verify', 'aadhaar', 'aadhar', 'verification', 'identity', 'kyc'],
    response: 'Aadhaar verification boosts your Trust Score and helps employers trust your profile. The process takes just 2 minutes with OTP verification. Would you like to start the verification process?',
    priority: 2,
  },
  {
    keywords: ['salary', 'pay', 'payment', 'paise', 'money', 'wage', 'earning'],
    response: 'Wages vary by job type and location. Daily wage jobs typically pay ₹400-₹800/day. All payments on JeevanSetu are verified and employers are Trust Score rated to prevent payment fraud.',
    priority: 2,
  },
  {
    keywords: ['location', 'area', 'distance', 'near', 'nearby', 'paas'],
    response: 'JeevanSetu uses location geofencing to show you jobs within your preferred radius. You can set your search range in the Job Search page. Currently showing results near Sonipat, Haryana.',
    priority: 2,
  },
  {
    keywords: ['help', 'assist', 'madad', 'sahayata', 'support'],
    response: 'I can help you with:\n• 🔍 Finding nearby jobs\n• 🌾 Agricultural opportunities\n• ✅ Aadhaar verification\n• 📋 Profile creation via voice\n• 💰 Payment & wage info\nJust tell me what you need!',
    priority: 1,
  },
  {
    keywords: ['profile', 'register', 'registration', 'signup', 'account'],
    response: 'You can create your employment profile using our Voice Registration feature – just speak your answers and we\'ll build your profile automatically. No typing needed! Would you like to start?',
    priority: 2,
  },
  {
    keywords: ['scheme', 'government', 'sarkari', 'yojana', 'pm-kisan', 'pension'],
    response: 'JeevanSetu helps you check eligibility for government schemes like PM-Kisan, PM-Shram Yogi Mandhan, and other welfare programs. Visit the Dashboard to explore available schemes.',
    priority: 2,
  },
  {
    keywords: ['thank', 'thanks', 'dhanyavad', 'shukriya'],
    response: 'You\'re welcome! 🙏 I\'m here whenever you need help. Feel free to ask me anything about jobs, farming, or verification.',
    priority: 1,
  },
];

/**
 * Generate an AI response based on the user's message.
 * Uses keyword matching with priority scoring.
 */
export function generateAIResponse(userMessage: string): string {
  const q = userMessage.toLowerCase().trim();

  if (!q) {
    return 'I didn\'t catch that. Could you please say that again?';
  }

  // Find matching patterns sorted by priority
  const matches = RESPONSE_PATTERNS.filter((pattern) =>
    pattern.keywords.some((keyword) => q.includes(keyword))
  ).sort((a, b) => b.priority - a.priority);

  if (matches.length > 0) {
    return matches[0].response;
  }

  // Default response
  return `I heard: "${userMessage}". I'm currently in sandbox mode for the hackathon demo. I can help you with finding jobs, agriculture support, profile verification, and government schemes. Try asking about any of these topics!`;
}

/**
 * Create a ChatMessage object from a text string.
 */
export function createChatMessage(
  text: string,
  sender: 'user' | 'ai' | 'system',
  isVoice: boolean = false
): ChatMessage {
  return {
    id: `${sender}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    text,
    sender,
    timestamp: new Date(),
    isVoice,
  };
}

/**
 * Simulate an async AI response with a realistic delay.
 * In production, replace this with an actual API call.
 */
export async function getAIResponseAsync(userMessage: string): Promise<string> {
  // Simulate network latency (300-800ms)
  const delay = 300 + Math.random() * 500;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateAIResponse(userMessage));
    }, delay);
  });
}
