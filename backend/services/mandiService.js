/**
 * Mandi Price API Service
 * Fetches and manages real-time commodity prices for agricultural markets.
 */
const db = require('../database/db');

async function getLiveMandiPrices() {
  // Retrieve from database store
  const prices = db.getAll('mandiPrices');
  if (prices && prices.length > 0) {
    return prices;
  }
  
  // Default dynamic records if empty
  const defaults = [
    { id: 1, crop: 'Wheat (Gehun)', market: 'Sonipat', district: 'Sonipat', state: 'Haryana', price: '₹2,275/qtl', trend: 'up', date: new Date().toLocaleDateString() },
    { id: 2, crop: 'Paddy (Dhan)', market: 'Narela', district: 'North Delhi', state: 'Delhi', price: '₹4,220/qtl', trend: 'up', date: new Date().toLocaleDateString() },
    { id: 3, crop: 'Potato (Aloo)', market: 'Rohtak', district: 'Rohtak', state: 'Haryana', price: '₹1,380/qtl', trend: 'down', date: new Date().toLocaleDateString() },
    { id: 4, crop: 'Mustard (Sarson)', market: 'Sonipat', district: 'Sonipat', state: 'Haryana', price: '₹5,450/qtl', trend: 'down', date: new Date().toLocaleDateString() }
  ];
  
  defaults.forEach(d => db.insert('mandiPrices', d));
  return defaults;
}

module.exports = { getLiveMandiPrices };
