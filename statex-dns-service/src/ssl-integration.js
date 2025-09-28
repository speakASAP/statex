const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { logger } = require('./logger');

/**
 * SSL Integration Service for StateX DNS Service
 * Handles SSL certificate management for dynamically created subdomains
 */
class SSLIntegration {
  constructor() {
    this.sslBaseDir = process.env.SSL_BASE_DIR || '/ssl';
    this.productionDomain = process.env.PRODUCTION_DOMAIN || 'statex.cz';
    this.developmentDomain = process.env.DEVELOPMENT_DOMAIN || 'localhost';
    this.isDevelopment = process.env.NODE_ENV === 'development';
    
    this.ensureSSLDirectories();
  }

  /**
   * Ensure SSL directories exist
   */
  ensureSSLDirectories() {
    const dirs = [
      `${this.sslBaseDir}/dynamic`,
      `${this.sslBaseDir}/dynamic/production`,
      `${this.sslBaseDir}/dynamic/development`,
      `${this.sslBaseDir}/shared`
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
        logger.info(`Created SSL directory: ${dir}`);
      }
    });
  }

  /**
   * Generate SSL certificate for a new subdomain
   * @param {string} subdomain - The subdomain to generate certificate for
   * @param {string} environment - 'production' or 'development'
   * @returns {Promise<Object>} Certificate information
   */
  async generateSubdomainCertificate(subdomain, environment = 'development') {
    try {
      const domain = environment === 'production' ? this.productionDomain : this.developmentDomain;
      const fullDomain = `${subdomain}.${domain}`;
      
      logger.info(`Generating SSL certificate for ${fullDomain}`, { subdomain, environment });

      if (environment === 'development') {
        return await this.generateDevelopmentCertificate(subdomain, fullDomain);
      } else {
        return await this.generateProductionCertificate(subdomain, fullDomain);
      }
    } catch (error) {
      logger.error(`Failed to generate SSL certificate for ${subdomain}`, { error: error.message });
      throw error;
    }
  }

  /**
   * Generate development certificate using mkcert
   * @param {string} subdomain - The subdomain
   * @param {string} fullDomain - The full domain
   * @returns {Promise<Object>} Certificate information
   */
  async generateDevelopmentCertificate(subdomain, fullDomain) {
    return new Promise((resolve, reject) => {
      const certDir = `${this.sslBaseDir}/dynamic/development/${subdomain}`;
      const keyFile = `${certDir}/${subdomain}-key.pem`;
      const certFile = `${certDir}/${subdomain}-cert.pem`;

      // Create subdomain directory
      if (!fs.existsSync(certDir)) {
        fs.mkdirSync(certDir, { recursive: true, mode: 0o700 });
      }

      // Generate certificate using mkcert
      const command = `mkcert -key-file "${keyFile}" -cert-file "${certFile}" "${fullDomain}"`;
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          logger.error(`mkcert failed for ${fullDomain}`, { error: error.message, stderr });
          reject(error);
          return;
        }

        // Set proper permissions
        fs.chmodSync(keyFile, 0o600);
        fs.chmodSync(certFile, 0o644);

        // Copy to shared location for nginx
        const sharedKeyFile = `${this.sslBaseDir}/shared/${subdomain}-key.pem`;
        const sharedCertFile = `${this.sslBaseDir}/shared/${subdomain}-cert.pem`;
        
        fs.copyFileSync(keyFile, sharedKeyFile);
        fs.copyFileSync(certFile, sharedCertFile);
        fs.chmodSync(sharedKeyFile, 0o600);
        fs.chmodSync(sharedCertFile, 0o644);

        logger.info(`Development SSL certificate generated for ${fullDomain}`, {
          keyFile: sharedKeyFile,
          certFile: sharedCertFile
        });

        resolve({
          subdomain,
          fullDomain,
          keyFile: sharedKeyFile,
          certFile: sharedCertFile,
          environment: 'development',
          generated: new Date().toISOString()
        });
      });
    });
  }

  /**
   * Generate production certificate using certbot
   * @param {string} subdomain - The subdomain
   * @param {string} fullDomain - The full domain
   * @returns {Promise<Object>} Certificate information
   */
  async generateProductionCertificate(subdomain, fullDomain) {
    return new Promise((resolve, reject) => {
      const certDir = `${this.sslBaseDir}/dynamic/production/${subdomain}`;
      
      // Create subdomain directory
      if (!fs.existsSync(certDir)) {
        fs.mkdirSync(certDir, { recursive: true, mode: 0o700 });
      }

      // Use certbot with DNS challenge (requires Cloudflare credentials)
      const command = `docker run --rm \
        -v "${this.sslBaseDir}/dynamic/production:/etc/letsencrypt" \
        -v "${this.sslBaseDir}/config/cloudflare.ini:/cloudflare.ini" \
        certbot/certbot certonly \
        --dns-cloudflare \
        --dns-cloudflare-credentials /cloudflare.ini \
        --email admin@${this.productionDomain} \
        --agree-tos \
        --no-eff-email \
        -d "${fullDomain}" \
        --config-dir /etc/letsencrypt \
        --work-dir /etc/letsencrypt \
        --logs-dir /etc/letsencrypt`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          logger.error(`certbot failed for ${fullDomain}`, { error: error.message, stderr });
          reject(error);
          return;
        }

        const keyFile = `${this.sslBaseDir}/dynamic/production/live/${fullDomain}/privkey.pem`;
        const certFile = `${this.sslBaseDir}/dynamic/production/live/${fullDomain}/fullchain.pem`;
        
        if (!fs.existsSync(keyFile) || !fs.existsSync(certFile)) {
          reject(new Error(`Certificate files not found for ${fullDomain}`));
          return;
        }

        // Copy to shared location for nginx
        const sharedKeyFile = `${this.sslBaseDir}/shared/${subdomain}-key.pem`;
        const sharedCertFile = `${this.sslBaseDir}/shared/${subdomain}-cert.pem`;
        
        fs.copyFileSync(keyFile, sharedCertFile);
        fs.copyFileSync(certFile, sharedCertFile);
        fs.chmodSync(sharedKeyFile, 0o600);
        fs.chmodSync(sharedCertFile, 0o644);

        logger.info(`Production SSL certificate generated for ${fullDomain}`, {
          keyFile: sharedKeyFile,
          certFile: sharedCertFile
        });

        resolve({
          subdomain,
          fullDomain,
          keyFile: sharedKeyFile,
          certFile: sharedCertFile,
          environment: 'production',
          generated: new Date().toISOString()
        });
      });
    });
  }

  /**
   * Check if certificate exists for subdomain
   * @param {string} subdomain - The subdomain
   * @param {string} environment - 'production' or 'development'
   * @returns {boolean} Whether certificate exists
   */
  certificateExists(subdomain, environment = 'development') {
    const sharedKeyFile = `${this.sslBaseDir}/shared/${subdomain}-key.pem`;
    const sharedCertFile = `${this.sslBaseDir}/shared/${subdomain}-cert.pem`;
    
    return fs.existsSync(sharedKeyFile) && fs.existsSync(sharedCertFile);
  }

  /**
   * Get certificate information
   * @param {string} subdomain - The subdomain
   * @param {string} environment - 'production' or 'development'
   * @returns {Object|null} Certificate information or null if not found
   */
  getCertificateInfo(subdomain, environment = 'development') {
    if (!this.certificateExists(subdomain, environment)) {
      return null;
    }

    const sharedKeyFile = `${this.sslBaseDir}/shared/${subdomain}-key.pem`;
    const sharedCertFile = `${this.sslBaseDir}/shared/${subdomain}-cert.pem`;
    const domain = environment === 'production' ? this.productionDomain : this.developmentDomain;
    const fullDomain = `${subdomain}.${domain}`;

    try {
      const stats = fs.statSync(sharedCertFile);
      return {
        subdomain,
        fullDomain,
        keyFile: sharedKeyFile,
        certFile: sharedCertFile,
        environment,
        created: stats.birthtime,
        modified: stats.mtime,
        size: stats.size
      };
    } catch (error) {
      logger.error(`Failed to get certificate info for ${subdomain}`, { error: error.message });
      return null;
    }
  }

  /**
   * Remove certificate for subdomain
   * @param {string} subdomain - The subdomain
   * @param {string} environment - 'production' or 'development'
   * @returns {Promise<boolean>} Success status
   */
  async removeCertificate(subdomain, environment = 'development') {
    try {
      const sharedKeyFile = `${this.sslBaseDir}/shared/${subdomain}-key.pem`;
      const sharedCertFile = `${this.sslBaseDir}/shared/${subdomain}-cert.pem`;
      
      if (fs.existsSync(sharedKeyFile)) {
        fs.unlinkSync(sharedKeyFile);
      }
      
      if (fs.existsSync(sharedCertFile)) {
        fs.unlinkSync(sharedCertFile);
      }

      logger.info(`SSL certificate removed for ${subdomain}`, { subdomain, environment });
      return true;
    } catch (error) {
      logger.error(`Failed to remove certificate for ${subdomain}`, { error: error.message });
      return false;
    }
  }

  /**
   * List all certificates
   * @param {string} environment - 'production' or 'development'
   * @returns {Array} List of certificate information
   */
  listCertificates(environment = 'development') {
    const sharedDir = `${this.sslBaseDir}/shared`;
    const certificates = [];

    try {
      const files = fs.readdirSync(sharedDir);
      const certFiles = files.filter(file => file.endsWith('-cert.pem'));

      certFiles.forEach(certFile => {
        const subdomain = certFile.replace('-cert.pem', '');
        const info = this.getCertificateInfo(subdomain, environment);
        if (info) {
          certificates.push(info);
        }
      });

      return certificates;
    } catch (error) {
      logger.error('Failed to list certificates', { error: error.message });
      return [];
    }
  }
}

module.exports = { SSLIntegration };
