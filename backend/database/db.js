/**
 * Simple JSON-based database to avoid native compilation issues (node-gyp)
 * on systems without C++ build tools.
 */
const fs = require('fs');
const path = require('path');
const config = require('../config');

const dbPath = path.resolve(__dirname, 'database.json');

// Initial state
const defaultState = {
  users: [],
  jobs: [],
  applications: [],
  reports: [],
  chatHistory: [],
  laborers: [],
  equipment: [],
  mandiPrices: []
};

let dbCache = null;

function readDB() {
  if (dbCache) return dbCache;
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(defaultState, null, 2));
    dbCache = { ...defaultState };
  } else {
    try {
      dbCache = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (e) {
      console.error("DB read error, resetting to default");
      dbCache = { ...defaultState };
    }
  }
  return dbCache;
}

function writeDB(data) {
  dbCache = data;
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Simple query helpers
const db = {
  read: readDB,
  write: writeDB,
  
  // Table operations
  getAll: (table) => {
    const data = readDB();
    return data[table] || [];
  },
  
  getById: (table, id) => {
    const data = readDB();
    return (data[table] || []).find(item => item.id === id);
  },
  
  find: (table, predicate) => {
    const data = readDB();
    return (data[table] || []).find(predicate);
  },
  
  filter: (table, predicate) => {
    const data = readDB();
    return (data[table] || []).filter(predicate);
  },
  
  insert: (table, item) => {
    const data = readDB();
    if (!data[table]) data[table] = [];
    
    // Generate auto-increment ID
    const maxId = data[table].reduce((max, curr) => Math.max(max, curr.id || 0), 0);
    item.id = maxId + 1;
    item.created_at = new Date().toISOString();
    
    data[table].push(item);
    writeDB(data);
    return item;
  },
  
  update: (table, id, updates) => {
    const data = readDB();
    if (!data[table]) return null;
    
    const index = data[table].findIndex(item => item.id === id);
    if (index === -1) return null;
    
    data[table][index] = { ...data[table][index], ...updates };
    writeDB(data);
    return data[table][index];
  },
  
  delete: (table, id) => {
    const data = readDB();
    if (!data[table]) return false;
    
    const initialLength = data[table].length;
    data[table] = data[table].filter(item => item.id !== id);
    writeDB(data);
    
    return data[table].length !== initialLength;
  }
};

module.exports = db;
