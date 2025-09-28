const { v4: uuidv4 } = require('uuid');
const { logger } = require('./logger');
const { SSLIntegration } = require('./ssl-integration');

class SubdomainManager {
  constructor(database) {
    this.db = database;
    this.sslIntegration = new SSLIntegration();
  }

  async registerSubdomain({ subdomain, customerId, prototypeId, targetUrl, status = 'active', expiresAt, metadata = {} }) {
    try {
      // Validate subdomain format
      if (!this.isValidSubdomain(subdomain)) {
        throw new Error('Invalid subdomain format');
      }

      // Check if subdomain already exists
      const existing = await this.getSubdomainInfo(subdomain);
      if (existing) {
        throw new Error('Subdomain already exists');
      }

      // Ensure customer exists
      await this.ensureCustomerExists(customerId);

      // Insert subdomain
      const sql = `
        INSERT INTO subdomains (subdomain, customer_id, prototype_id, target_url, status, expires_at, metadata)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        subdomain,
        customerId,
        prototypeId || null,
        targetUrl,
        status,
        expiresAt || null,
        JSON.stringify(metadata)
      ];

      const result = await this.db.run(sql, params);
      
      // Generate SSL certificate for the subdomain
      const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
      let sslInfo = null;
      
      try {
        sslInfo = await this.sslIntegration.generateSubdomainCertificate(subdomain, environment);
        logger.info(`SSL certificate generated for ${subdomain}`, { sslInfo });
      } catch (sslError) {
        logger.warn(`Failed to generate SSL certificate for ${subdomain}`, { 
          error: sslError.message,
          subdomain,
          environment 
        });
        // Don't fail the subdomain registration if SSL generation fails
      }
      
      logger.info(`Subdomain registered: ${subdomain}`, { 
        customerId, 
        prototypeId, 
        id: result.id,
        sslGenerated: !!sslInfo
      });

      return {
        id: result.id,
        subdomain,
        customerId,
        prototypeId,
        targetUrl,
        status,
        expiresAt,
        metadata,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to register subdomain', error);
      throw error;
    }
  }

  async getSubdomainInfo(subdomain) {
    try {
      const sql = 'SELECT * FROM subdomains WHERE subdomain = ?';
      const row = await this.db.get(sql, [subdomain]);
      
      if (!row) {
        return null;
      }

      return {
        id: row.id,
        subdomain: row.subdomain,
        customerId: row.customer_id,
        prototypeId: row.prototype_id,
        targetUrl: row.target_url,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        expiresAt: row.expires_at,
        metadata: row.metadata ? JSON.parse(row.metadata) : {}
      };
    } catch (error) {
      logger.error('Failed to get subdomain info', error);
      throw error;
    }
  }

  async listSubdomains({ customerId, status, limit = 100, offset = 0 } = {}) {
    try {
      let sql = 'SELECT * FROM subdomains WHERE 1=1';
      const params = [];

      if (customerId) {
        sql += ' AND customer_id = ?';
        params.push(customerId);
      }

      if (status) {
        sql += ' AND status = ?';
        params.push(status);
      }

      sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const rows = await this.db.query(sql, params);
      
      return rows.map(row => ({
        id: row.id,
        subdomain: row.subdomain,
        customerId: row.customer_id,
        prototypeId: row.prototype_id,
        targetUrl: row.target_url,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        expiresAt: row.expires_at,
        metadata: row.metadata ? JSON.parse(row.metadata) : {}
      }));
    } catch (error) {
      logger.error('Failed to list subdomains', error);
      throw error;
    }
  }

  async updateSubdomain(subdomain, updates) {
    try {
      const allowedFields = ['status', 'target_url', 'expires_at', 'metadata'];
      const updateFields = [];
      const params = [];

      for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
          if (key === 'metadata' && typeof value === 'object') {
            updateFields.push(`${key} = ?`);
            params.push(JSON.stringify(value));
          } else {
            updateFields.push(`${key} = ?`);
            params.push(value);
          }
        }
      }

      if (updateFields.length === 0) {
        throw new Error('No valid fields to update');
      }

      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      params.push(subdomain);

      const sql = `
        UPDATE subdomains 
        SET ${updateFields.join(', ')} 
        WHERE subdomain = ?
      `;

      const result = await this.db.run(sql, params);
      
      if (result.changes === 0) {
        return null;
      }

      logger.info(`Subdomain updated: ${subdomain}`, updates);
      return await this.getSubdomainInfo(subdomain);
    } catch (error) {
      logger.error('Failed to update subdomain', error);
      throw error;
    }
  }

  async deleteSubdomain(subdomain) {
    try {
      const sql = 'DELETE FROM subdomains WHERE subdomain = ?';
      const result = await this.db.run(sql, [subdomain]);
      
      if (result.changes === 0) {
        return null;
      }

      logger.info(`Subdomain deleted: ${subdomain}`);
      return { message: 'Subdomain deleted successfully' };
    } catch (error) {
      logger.error('Failed to delete subdomain', error);
      throw error;
    }
  }

  async resolveDomain(domain) {
    try {
      // Extract subdomain from domain
      if (!domain.endsWith('.localhost')) {
        return null;
      }

      const subdomain = domain.replace('.localhost', '');
      const info = await this.getSubdomainInfo(subdomain);
      
      if (!info || info.status !== 'active') {
        return null;
      }

      // Check if expired
      if (info.expiresAt && new Date(info.expiresAt) < new Date()) {
        logger.info(`Subdomain expired: ${subdomain}`);
        return null;
      }

      return {
        domain,
        subdomain,
        targetUrl: info.targetUrl,
        customerId: info.customerId,
        prototypeId: info.prototypeId,
        status: info.status,
        resolvedAt: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to resolve domain', error);
      throw error;
    }
  }

  async ensureCustomerExists(customerId) {
    try {
      const sql = 'SELECT id FROM customers WHERE id = ?';
      const existing = await this.db.get(sql, [customerId]);
      
      if (!existing) {
        // Create customer with minimal info
        const insertSql = `
          INSERT INTO customers (id, name, status)
          VALUES (?, ?, 'active')
        `;
        await this.db.run(insertSql, [customerId, `Customer ${customerId}`]);
        logger.info(`Customer created: ${customerId}`);
      }
    } catch (error) {
      logger.error('Failed to ensure customer exists', error);
      throw error;
    }
  }

  isValidSubdomain(subdomain) {
    // Basic subdomain validation
    const subdomainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?$/;
    return subdomainRegex.test(subdomain) && subdomain.length <= 63;
  }

  async getStats() {
    try {
      const totalSubdomains = await this.db.get('SELECT COUNT(*) as count FROM subdomains');
      const activeSubdomains = await this.db.get('SELECT COUNT(*) as count FROM subdomains WHERE status = "active"');
      const totalCustomers = await this.db.get('SELECT COUNT(*) as count FROM customers');
      
      return {
        totalSubdomains: totalSubdomains.count,
        activeSubdomains: activeSubdomains.count,
        totalCustomers: totalCustomers.count,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to get stats', error);
      throw error;
    }
  }

  async cleanupExpiredSubdomains() {
    try {
      const sql = `
        UPDATE subdomains 
        SET status = 'expired' 
        WHERE expires_at IS NOT NULL 
        AND expires_at < CURRENT_TIMESTAMP 
        AND status = 'active'
      `;
      
      const result = await this.db.run(sql);
      logger.info(`Cleaned up ${result.changes} expired subdomains`);
      return result.changes;
    } catch (error) {
      logger.error('Failed to cleanup expired subdomains', error);
      throw error;
    }
  }

  // SSL Management Methods

  /**
   * Get SSL certificate information for a subdomain
   * @param {string} subdomain - The subdomain
   * @param {string} environment - 'production' or 'development'
   * @returns {Object|null} SSL certificate information
   */
  async getSSLInfo(subdomain, environment = 'development') {
    try {
      return this.sslIntegration.getCertificateInfo(subdomain, environment);
    } catch (error) {
      logger.error(`Failed to get SSL info for ${subdomain}`, { error: error.message });
      throw error;
    }
  }

  /**
   * Regenerate SSL certificate for a subdomain
   * @param {string} subdomain - The subdomain
   * @param {string} environment - 'production' or 'development'
   * @returns {Object} SSL certificate information
   */
  async regenerateSSL(subdomain, environment = 'development') {
    try {
      // Remove existing certificate
      await this.sslIntegration.removeCertificate(subdomain, environment);
      
      // Generate new certificate
      const sslInfo = await this.sslIntegration.generateSubdomainCertificate(subdomain, environment);
      
      logger.info(`SSL certificate regenerated for ${subdomain}`, { sslInfo });
      return sslInfo;
    } catch (error) {
      logger.error(`Failed to regenerate SSL for ${subdomain}`, { error: error.message });
      throw error;
    }
  }

  /**
   * Remove SSL certificate for a subdomain
   * @param {string} subdomain - The subdomain
   * @param {string} environment - 'production' or 'development'
   * @returns {boolean} Success status
   */
  async removeSSL(subdomain, environment = 'development') {
    try {
      const success = await this.sslIntegration.removeCertificate(subdomain, environment);
      
      if (success) {
        logger.info(`SSL certificate removed for ${subdomain}`);
      }
      
      return success;
    } catch (error) {
      logger.error(`Failed to remove SSL for ${subdomain}`, { error: error.message });
      throw error;
    }
  }

  /**
   * List all SSL certificates
   * @param {string} environment - 'production' or 'development'
   * @returns {Array} List of SSL certificates
   */
  async listSSLCertificates(environment = 'development') {
    try {
      return this.sslIntegration.listCertificates(environment);
    } catch (error) {
      logger.error('Failed to list SSL certificates', { error: error.message });
      throw error;
    }
  }

  /**
   * Check SSL certificate status for a subdomain
   * @param {string} subdomain - The subdomain
   * @param {string} environment - 'production' or 'development'
   * @returns {Object} SSL status information
   */
  async checkSSLStatus(subdomain, environment = 'development') {
    try {
      const exists = this.sslIntegration.certificateExists(subdomain, environment);
      const info = exists ? this.sslIntegration.getCertificateInfo(subdomain, environment) : null;
      
      return {
        subdomain,
        environment,
        exists,
        info,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error(`Failed to check SSL status for ${subdomain}`, { error: error.message });
      throw error;
    }
  }
}

module.exports = { SubdomainManager };

