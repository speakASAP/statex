const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 8053;

// Create database
const dbPath = path.join(__dirname, 'data', 'subdomains.db');
const db = new sqlite3.Database(dbPath);

// Initialize database
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS subdomains (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subdomain TEXT UNIQUE NOT NULL,
    customer_id TEXT NOT NULL,
    prototype_id TEXT,
    target_url TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'statex-dns-service'
  });
});

// Register subdomain
app.post('/api/subdomains', (req, res) => {
  const { subdomain, customerId, prototypeId, targetUrl } = req.body;
  
  if (!subdomain || !customerId) {
    return res.status(400).json({ error: 'subdomain and customerId are required' });
  }

  const sql = `INSERT INTO subdomains (subdomain, customer_id, prototype_id, target_url) 
               VALUES (?, ?, ?, ?)`;
  
  // For subdomains, targetUrl should be the subdomain itself, not a redirect
  const subdomainUrl = `http://${subdomain}.localhost:3000`;
  
  db.run(sql, [subdomain, customerId, prototypeId || null, subdomainUrl], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({
      id: this.lastID,
      subdomain,
      customerId,
      prototypeId,
      targetUrl: subdomainUrl,
      status: 'active',
      createdAt: new Date().toISOString()
    });
  });
});

// Get subdomain
app.get('/api/subdomains/:subdomain', (req, res) => {
  const { subdomain } = req.params;
  
  db.get('SELECT * FROM subdomains WHERE subdomain = ?', [subdomain], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Subdomain not found' });
    }
    
    res.json(row);
  });
});

// List subdomains
app.get('/api/subdomains', (req, res) => {
  db.all('SELECT * FROM subdomains ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json(rows);
  });
});

// Resolve domain
app.get('/api/resolve/:domain', (req, res) => {
  const { domain } = req.params;
  const subdomain = domain.replace('.localhost', '');
  
  db.get('SELECT * FROM subdomains WHERE subdomain = ? AND status = "active"', [subdomain], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Domain not found' });
    }
    
    res.json({
      domain,
      subdomain,
      targetUrl: row.target_url,
      customerId: row.customer_id,
      prototypeId: row.prototype_id,
      status: row.status,
      resolvedAt: new Date().toISOString()
    });
  });
});

app.listen(port, () => {
  console.log(`🚀 DNS Service running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`📝 API docs: http://localhost:${port}/api/subdomains`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down DNS service...');
  db.close();
  process.exit(0);
});
