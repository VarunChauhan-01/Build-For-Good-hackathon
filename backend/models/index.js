const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  phone: String,
  role: { type: String, default: 'user' },
  is_verified: { type: Number, default: 0 },
  trust_score: { type: Number, default: 75 },
  reports_count: { type: Number, default: 0 },
  strikes: { type: Number, default: 0 },
  status: { type: String, default: 'active' },
  location: String,
  language: String,
  profession: String,
  experience: String,
  aadhaar_masked: String,
  photo: String,
  address: String,
  skills: [String],
  availability: { type: String, default: 'Available' },
  rating: { type: Number, default: 0 },
  total_earnings: { type: Number, default: 0 },
  completed_jobs: { type: Number, default: 0 },
}, { timestamps: true });

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  employer: { type: String, required: true },
  trust_score: { type: Number, default: 90 },
  pay: String,
  distance: String,
  location: String,
  category: String,
  verified: { type: Number, default: 1 },
  description: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'Active', enum: ['Active', 'Completed', 'Closed'] },
  total_slots: { type: Number, default: 1 },
  filled_slots: { type: Number, default: 0 },
}, { timestamps: true });

const ApplicationSchema = new mongoose.Schema({
  job_id: { type: String, required: true },
  user_id: { type: String, required: true },
  method: { type: String, default: 'manual' },
  voice_transcript: String,
  status: { type: String, default: 'Applied', enum: ['pending', 'Applied', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected', 'Completed', 'Withdrawn'] }
}, { timestamps: true });

const WorkerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  skills: String,
  rating: { type: Number, default: 5.0 },
  experience: String,
  pay: String,
  location: String,
  status: { type: String, default: 'Available' }
}, { timestamps: true });

const EquipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: String,
  rate: String,
  type: String,
  distance: String,
  status: { type: String, default: 'Available' }
}, { timestamps: true });

const BookingSchema = new mongoose.Schema({
  item_id: { type: String, required: true },
  item_type: { type: String, enum: ['worker', 'equipment'], required: true },
  user_id: { type: String, required: true },
  status: { type: String, default: 'Booked' }
}, { timestamps: true });

const ReportSchema = new mongoose.Schema({
  reporter: String,
  reported_user: String,
  type: { type: String, enum: ['Fake Employers', 'Spam', 'Fraud', 'Abuse', 'No Show', 'Other'] },
  reason: String,
  severity: String,
  status: { type: String, default: 'pending', enum: ['pending', 'resolved', 'safe', 'rejected', 'closed'] }
}, { timestamps: true });

const NotificationSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  title: String,
  message: String,
  type: String,
  read: { type: Boolean, default: false }
}, { timestamps: true });

const VerificationSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  aadhaar_masked: String,
  status: { type: String, default: 'verified' }
}, { timestamps: true });

const ReviewSchema = new mongoose.Schema({
  reviewer_id: String,
  target_id: String,
  target_type: { type: String, enum: ['worker', 'employer', 'farmer'] },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String
}, { timestamps: true });

const PaymentSchema = new mongoose.Schema({
  user_id: String,
  amount: Number,
  status: String,
  transaction_id: String
}, { timestamps: true });

const ProfileViewSchema = new mongoose.Schema({
  user_id: String,
  viewer_id: String
}, { timestamps: true });

const SkillSchema = new mongoose.Schema({
  name: String,
  category: String
}, { timestamps: true });

const WeatherCacheSchema = new mongoose.Schema({
  location: String,
  temp: String,
  humidity: String,
  rain: String,
  wind: String,
  forecast: Array
}, { timestamps: true });

const MandiPriceSchema = new mongoose.Schema({
  crop: String,
  market: String,
  district: String,
  state: String,
  price: String,
  trend: String,
  date: String
}, { timestamps: true });

const ChatHistorySchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  text: { type: String, required: true },
  sender: { type: String, enum: ['user', 'ai'], required: true },
  is_voice: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = {
  User: mongoose.models.User || mongoose.model('User', UserSchema),
  Job: mongoose.models.Job || mongoose.model('Job', JobSchema),
  Application: mongoose.models.Application || mongoose.model('Application', ApplicationSchema),
  Worker: mongoose.models.Worker || mongoose.model('Worker', WorkerSchema),
  Equipment: mongoose.models.Equipment || mongoose.model('Equipment', EquipmentSchema),
  Booking: mongoose.models.Booking || mongoose.model('Booking', BookingSchema),
  Report: mongoose.models.Report || mongoose.model('Report', ReportSchema),
  Notification: mongoose.models.Notification || mongoose.model('Notification', NotificationSchema),
  Verification: mongoose.models.Verification || mongoose.model('Verification', VerificationSchema),
  Review: mongoose.models.Review || mongoose.model('Review', ReviewSchema),
  Payment: mongoose.models.Payment || mongoose.model('Payment', PaymentSchema),
  ProfileView: mongoose.models.ProfileView || mongoose.model('ProfileView', ProfileViewSchema),
  Skill: mongoose.models.Skill || mongoose.model('Skill', SkillSchema),
  WeatherCache: mongoose.models.WeatherCache || mongoose.model('WeatherCache', WeatherCacheSchema),
  MandiPrice: mongoose.models.MandiPrice || mongoose.model('MandiPrice', MandiPriceSchema),
  ChatHistory: mongoose.models.ChatHistory || mongoose.model('ChatHistory', ChatHistorySchema),
};
