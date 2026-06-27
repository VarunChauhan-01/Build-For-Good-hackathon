/**
 * AI Response Service (Server-side)
 * Mirrors the frontend voiceAIService.ts pattern matching.
 */

const RESPONSE_PATTERNS = [
  { keywords: ['hello', 'hi', 'hey', 'namaste', 'namaskar'], response: 'Namaste! 🙏 How can I help you today? I can assist with finding jobs, agriculture support, profile verification, and more.', priority: 1 },
  { keywords: ['job', 'work', 'kaam', 'rozgar', 'employment', 'naukri'], response: 'I can help you find local jobs! We have openings in Agriculture, Carpentry, Electrician, Painting, Plumbing, and Daily Wage categories. Would you like me to search for a specific type of work?', priority: 2 },
  { keywords: ['farm', 'agriculture', 'kheti', 'crop', 'harvest', 'kisan', 'tractor'], response: 'Our Farmer Hub has listings for agricultural jobs, equipment rental, and farm labor. We can connect you with verified farmers in your area. Would you like to visit the Farmer Hub?', priority: 2 },
  { keywords: ['verify', 'aadhaar', 'aadhar', 'verification', 'identity', 'kyc'], response: 'Aadhaar verification boosts your Trust Score and helps employers trust your profile. The process takes just 2 minutes with OTP verification. Would you like to start the verification process?', priority: 2 },
  { keywords: ['salary', 'pay', 'payment', 'paise', 'money', 'wage', 'earning'], response: 'Wages vary by job type and location. Daily wage jobs typically pay ₹400-₹800/day. All payments on JeevanSetu are verified and employers are Trust Score rated to prevent payment fraud.', priority: 2 },
  { keywords: ['location', 'area', 'distance', 'near', 'nearby', 'paas'], response: 'JeevanSetu uses location geofencing to show you jobs within your preferred radius. You can set your search range in the Job Search page.', priority: 2 },
  { keywords: ['help', 'assist', 'madad', 'sahayata', 'support'], response: 'I can help you with:\n• 🔍 Finding nearby jobs\n• 🌾 Agricultural opportunities\n• ✅ Aadhaar verification\n• 📋 Profile creation via voice\n• 💰 Payment & wage info\nJust tell me what you need!', priority: 1 },
  { keywords: ['profile', 'register', 'registration', 'signup', 'account'], response: "You can create your employment profile using our Voice Registration feature – just speak your answers and we'll build your profile automatically. No typing needed!", priority: 2 },
  { keywords: ['scheme', 'government', 'sarkari', 'yojana', 'pm-kisan', 'pension'], response: 'JeevanSetu helps you check eligibility for government schemes like PM-Kisan, PM-Shram Yogi Mandhan, and other welfare programs. Visit the Dashboard to explore.', priority: 2 },
  { keywords: ['thank', 'thanks', 'dhanyavad', 'shukriya'], response: "You're welcome! 🙏 I'm here whenever you need help.", priority: 1 },
];

function generateAIResponse(userMessage) {
  const q = (userMessage || '').toLowerCase().trim();
  if (!q) return "I didn't catch that. Could you please say that again?";

  const matches = RESPONSE_PATTERNS
    .filter(p => p.keywords.some(k => q.includes(k)))
    .sort((a, b) => b.priority - a.priority);

  if (matches.length > 0) return matches[0].response;

  return `I heard: "${userMessage}". I can help you with finding jobs, agriculture support, profile verification, and government schemes. Try asking about any of these topics!`;
}

module.exports = { generateAIResponse };
