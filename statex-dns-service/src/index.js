const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dns2 = require('dns2');
const { createServer } = require('dns2');
const { Database } = require('./database');
const { SubdomainManager } = require('./subdomain-manager');
const { logger } = require('./logger');
require('dotenv').config();

class DNSMicroservice {
  constructor() {
    this.app = express();
    this.port = process.env.DNS_SERVICE_PORT || 8053;
    this.dnsPort = process.env.DNS_PORT || 5353;
    this.database = new Database();
    this.subdomainManager = new SubdomainManager(this.database);
    this.dnsServer = null;
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupDNSServer();
  }

  setupMiddleware() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // Request logging
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path}`, { 
        ip: req.ip, 
        userAgent: req.get('User-Agent') 
      });
      next();
    });
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'statex-dns-service',
        version: '1.0.0'
      });
    });

    // Register subdomain
    this.app.post('/api/subdomains', async (req, res) => {
      try {
        const { subdomain, customerId, prototypeId, targetUrl } = req.body;
        
        if (!subdomain || !customerId) {
          return res.status(400).json({ 
            error: 'subdomain and customerId are required' 
          });
        }

        const result = await this.subdomainManager.registerSubdomain({
          subdomain,
          customerId,
          prototypeId,
          targetUrl: targetUrl || `http://localhost:3000/prototype-results/${prototypeId}`,
          status: 'active'
        });

        logger.info(`Subdomain registered: ${subdomain}`, { customerId, prototypeId });
        res.json(result);
      } catch (error) {
        logger.error('Failed to register subdomain', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Get subdomain info
    this.app.get('/api/subdomains/:subdomain', async (req, res) => {
      try {
        const { subdomain } = req.params;
        const info = await this.subdomainManager.getSubdomainInfo(subdomain);
        
        if (!info) {
          return res.status(404).json({ error: 'Subdomain not found' });
        }

        res.json(info);
      } catch (error) {
        logger.error('Failed to get subdomain info', error);
        res.status(500).json({ error: error.message });
      }
    });

    // List subdomains
    this.app.get('/api/subdomains', async (req, res) => {
      try {
        const { customerId, status, limit = 100, offset = 0 } = req.query;
        const subdomains = await this.subdomainManager.listSubdomains({
          customerId,
          status,
          limit: parseInt(limit),
          offset: parseInt(offset)
        });

        res.json(subdomains);
      } catch (error) {
        logger.error('Failed to list subdomains', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Update subdomain
    this.app.put('/api/subdomains/:subdomain', async (req, res) => {
      try {
        const { subdomain } = req.params;
        const updates = req.body;
        
        const result = await this.subdomainManager.updateSubdomain(subdomain, updates);
        
        if (!result) {
          return res.status(404).json({ error: 'Subdomain not found' });
        }

        logger.info(`Subdomain updated: ${subdomain}`, updates);
        res.json(result);
      } catch (error) {
        logger.error('Failed to update subdomain', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Delete subdomain
    this.app.delete('/api/subdomains/:subdomain', async (req, res) => {
      try {
        const { subdomain } = req.params;
        const result = await this.subdomainManager.deleteSubdomain(subdomain);
        
        if (!result) {
          return res.status(404).json({ error: 'Subdomain not found' });
        }

        logger.info(`Subdomain deleted: ${subdomain}`);
        res.json({ message: 'Subdomain deleted successfully' });
      } catch (error) {
        logger.error('Failed to delete subdomain', error);
        res.status(500).json({ error: error.message });
      }
    });

    // DNS resolution endpoint
    this.app.get('/api/resolve/:domain', async (req, res) => {
      try {
        const { domain } = req.params;
        const result = await this.subdomainManager.resolveDomain(domain);
        
        if (!result) {
          return res.status(404).json({ error: 'Domain not found' });
        }

        res.json(result);
      } catch (error) {
        logger.error('Failed to resolve domain', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Error handling
    this.app.use((err, req, res, next) => {
      logger.error('Unhandled error', err);
      res.status(500).json({ error: 'Internal server error' });
    });

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({ error: 'Endpoint not found' });
    });
  }

  setupDNSServer() {
    const dnsServer = createServer({
      udp: true,
      tcp: true,
      handle: async (request, send, rinfo) => {
        const { questions } = request;
        const response = dns2.Packet.createResponseFromRequest(request);
        
        for (const question of questions) {
          const { name, type } = question;
          
          try {
            // Handle localhost subdomains
            if (name.endsWith('.localhost')) {
              const subdomain = name.replace('.localhost', '');
              const subdomainInfo = await this.subdomainManager.getSubdomainInfo(subdomain);
              
              if (subdomainInfo && subdomainInfo.status === 'active') {
                // Return A record pointing to localhost
                response.answers.push({
                  name: name,
                  type: dns2.Packet.TYPE.A,
                  class: dns2.Packet.CLASS.IN,
                  ttl: 300,
                  address: '127.0.0.1'
                });
                
                logger.info(`DNS resolved: ${name} -> 127.0.0.1`, { 
                  subdomain, 
                  customerId: subdomainInfo.customerId 
                });
              } else {
                // Return NXDOMAIN for unknown subdomains
                response.header.rcode = dns2.Packet.RCODE.NXDOMAIN;
                logger.info(`DNS NXDOMAIN: ${name}`, { subdomain });
              }
            } else {
              // For other domains, return NXDOMAIN
              response.header.rcode = dns2.Packet.RCODE.NXDOMAIN;
            }
          } catch (error) {
            logger.error('DNS resolution error', error);
            response.header.rcode = dns2.Packet.RCODE.SERVFAIL;
          }
        }
        
        send(response);
      }
    });

    this.dnsServer = dnsServer;
  }

  async start() {
    try {
      // Initialize database
      await this.database.initialize();
      logger.info('Database initialized');

      // Start DNS server
      await this.dnsServer.listen({
        udp: this.dnsPort,
        tcp: this.dnsPort
      });
      logger.info(`DNS server listening on port ${this.dnsPort}`);

      // Start HTTP server
      this.app.listen(this.port, () => {
        logger.info(`DNS microservice listening on port ${this.port}`);
        logger.info(`Health check: http://localhost:${this.port}/health`);
        logger.info(`API docs: http://localhost:${this.port}/api/subdomains`);
      });

    } catch (error) {
      logger.error('Failed to start DNS microservice', error);
      process.exit(1);
    }
  }

  async stop() {
    try {
      if (this.dnsServer) {
        await this.dnsServer.close();
        logger.info('DNS server stopped');
      }
      
      await this.database.close();
      logger.info('Database connection closed');
      
      process.exit(0);
    } catch (error) {
      logger.error('Error stopping DNS microservice', error);
      process.exit(1);
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  if (global.dnsMicroservice) {
    await global.dnsMicroservice.stop();
  }
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  if (global.dnsMicroservice) {
    await global.dnsMicroservice.stop();
  }
});

// Start the service
if (require.main === module) {
  const dnsMicroservice = new DNSMicroservice();
  global.dnsMicroservice = dnsMicroservice;
  dnsMicroservice.start();
}

module.exports = DNSMicroservice;

