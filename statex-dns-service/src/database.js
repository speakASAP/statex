const sqlite3 = require('sqlite3').verbose();
const { logger } = require('./logger');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = process.env.DATABASE_PATH || './data/subdomains.db';
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          logger.error('Failed to connect to database', err);
          reject(err);
        } else {
          logger.info(`Connected to SQLite database: ${this.dbPath}`);
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async createTables() {
    const createSubdomainsTable = `
      CREATE TABLE IF NOT EXISTS subdomains (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subdomain TEXT UNIQUE NOT NULL,
        customer_id TEXT NOT NULL,
        prototype_id TEXT,
        target_url TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME,
        metadata TEXT
      )
    `;

    const createCustomersTable = `
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'active',
        metadata TEXT
      )
    `;

    const createIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_subdomains_customer_id ON subdomains(customer_id)',
      'CREATE INDEX IF NOT EXISTS idx_subdomains_status ON subdomains(status)',
      'CREATE INDEX IF NOT EXISTS idx_subdomains_created_at ON subdomains(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status)'
    ];

    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(createSubdomainsTable, (err) => {
          if (err) {
            logger.error('Failed to create subdomains table', err);
            reject(err);
            return;
          }
        });

        this.db.run(createCustomersTable, (err) => {
          if (err) {
            logger.error('Failed to create customers table', err);
            reject(err);
            return;
          }
        });

        // Create indexes
        let completed = 0;
        const total = createIndexes.length;
        
        createIndexes.forEach((indexSQL) => {
          this.db.run(indexSQL, (err) => {
            if (err) {
              logger.error('Failed to create index', err);
              reject(err);
              return;
            }
            
            completed++;
            if (completed === total) {
              logger.info('Database tables and indexes created successfully');
              resolve();
            }
          });
        });
      });
    });
  }

  async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          logger.error('Database query error', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          logger.error('Database get error', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          logger.error('Database run error', err);
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  async close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            logger.error('Failed to close database', err);
            reject(err);
          } else {
            logger.info('Database connection closed');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  // Transaction support
  async transaction(callback) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run('BEGIN TRANSACTION');
        
        callback(this.db)
          .then((result) => {
            this.db.run('COMMIT', (err) => {
              if (err) {
                logger.error('Failed to commit transaction', err);
                reject(err);
              } else {
                resolve(result);
              }
            });
          })
          .catch((error) => {
            this.db.run('ROLLBACK', (err) => {
              if (err) {
                logger.error('Failed to rollback transaction', err);
              }
              reject(error);
            });
          });
      });
    });
  }
}

module.exports = { Database };
