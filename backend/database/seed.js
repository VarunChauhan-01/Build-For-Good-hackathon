const bcrypt = require('bcryptjs');
const { User, Job, Report, Worker, Equipment, MandiPrice } = require('../models');

async function seed() {
  try {
    console.log('Checking MongoDB database seed...');
    const userCount = await User.countDocuments();
    
    if (userCount > 0) {
      console.log('MongoDB Database already seeded.');
      return;
    }
    
    console.log('Seeding MongoDB database with mock data...');
    
    // Hash passwords
    const adminHash = await bcrypt.hash('admin123', 10);
    const userHash = await bcrypt.hash('user123', 10);
    
    // 1. Create Users
    const users = await User.create([
      { name: 'Admin User', email: 'admin@jeevansetu.in', password_hash: adminHash, role: 'admin', is_verified: 1, trust_score: 100, reports_count: 0, strikes: 0, status: 'active' },
      { name: 'Ramesh Pujari', email: 'ramesh@example.com', password_hash: userHash, role: 'user', is_verified: 1, trust_score: 92, reports_count: 0, strikes: 0, status: 'active', aadhaar_masked: 'XXXX-XXXX-1234' },
      { name: 'Suspicious User', email: 'scam@example.com', password_hash: userHash, role: 'user', is_verified: 0, trust_score: 30, reports_count: 5, strikes: 2, status: 'flagged', aadhaar_masked: 'XXXX-XXXX-9999' }
    ]);
    
    // 2. Create Jobs
    await Job.create([
      { title: 'Harvesting Helper', employer: 'Sunil Choudhary', trust_score: 97, pay: '₹450/day', distance: '1.5 km', location: 'Ganaur Village', category: 'Agriculture', verified: 1, postedBy: users[1]._id },
      { title: 'House Painter', employer: 'Rajesh Sharma', trust_score: 92, pay: '₹750/day', distance: '3.2 km', location: 'Model Town', category: 'Painter', verified: 1, postedBy: users[1]._id },
      { title: 'Home Electrician', employer: 'Karan Mehra', trust_score: 89, pay: '₹600/day', distance: '4.8 km', location: 'Narela', category: 'Electrician', verified: 0, postedBy: users[2]._id },
      { title: 'Carpenter Helper', employer: 'Vikas Furniture', trust_score: 95, pay: '₹700/day', distance: '2.0 km', location: 'Industrial Area', category: 'Carpenter', verified: 1, postedBy: users[1]._id }
    ]);
    
    // 3. Create Reports
    await Report.create([
      { reporter: 'Sunil Choudhary', reported_user: 'Suspicious User', type: 'No Show', reason: 'Agreed to work but never arrived', severity: 'Medium', status: 'pending' },
      { reporter: 'Vikas Furniture', reported_user: 'Suspicious User', type: 'Fraud', reason: 'Asked for advance payment then blocked me', severity: 'Critical', status: 'pending' }
    ]);
    
    // 4. Create Workers (Laborers)
    await Worker.create([
      { name: 'Sanjay Kumar', skills: 'Wheat Harvesting, Seeding', rating: 4.8, experience: '8 Yrs', pay: '₹400/day', location: '1.2 km away', status: 'Available' },
      { name: 'Ramesh Pujari', skills: 'Tractor Driver, Irrigation', rating: 4.9, experience: '6 Yrs', pay: '₹450/day', location: '3.0 km away', status: 'Available' },
      { name: 'Jatin Das', skills: 'Pesticide Spray, Planting', rating: 4.6, experience: '4 Yrs', pay: '₹380/day', location: '2.5 km away', status: 'Booked' }
    ]);
    
    // 5. Create Equipment
    await Equipment.create([
      { name: 'Mahindra Arjun Tractor', owner: 'Devender Singh', rate: '₹800/hr', type: 'Tractor', distance: '1.8 km', status: 'Available' },
      { name: 'John Deere Harvester', owner: 'Satish Grewal', rate: '₹2,200/hr', type: 'Harvester', distance: '4.0 km', status: 'Available' },
      { name: 'Rotavator Tiller', owner: 'Jagbir Singh', rate: '₹350/hr', type: 'Tiller', distance: '2.2 km', status: 'Rented' }
    ]);
    
    // 6. Create Mandi Prices
    await MandiPrice.create([
      { crop: 'Wheat (Gehun)', market: 'Sonipat', district: 'Sonipat', state: 'Haryana', price: '₹2,275/qtl', trend: 'up', date: new Date().toLocaleDateString() },
      { crop: 'Paddy (Dhan)', market: 'Narela', district: 'North Delhi', state: 'Delhi', price: '₹4,220/qtl', trend: 'up', date: new Date().toLocaleDateString() },
      { crop: 'Potato (Aloo)', market: 'Rohtak', district: 'Rohtak', state: 'Haryana', price: '₹1,380/qtl', trend: 'down', date: new Date().toLocaleDateString() },
      { crop: 'Mustard (Sarson)', market: 'Sonipat', district: 'Sonipat', state: 'Haryana', price: '₹5,450/qtl', trend: 'down', date: new Date().toLocaleDateString() }
    ]);
    
    console.log('MongoDB Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding MongoDB database:', error);
  }
}

module.exports = seed;
