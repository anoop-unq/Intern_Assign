import routingConfig from '../config/routingConfig.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class RoutingService {
  constructor() {
    this.blueData = null;
    this.greenData = null;
    this.loadPricingData();
  }

  async loadPricingData() {
    try {
      const bluePath = join(__dirname, '../data/pricing-blue.json');
      const greenPath = join(__dirname, '../data/pricing-green.json');
      
      const [blueContent, greenContent] = await Promise.all([
        fs.readFile(bluePath, 'utf8'),
        fs.readFile(greenPath, 'utf8')
      ]);
      
      this.blueData = JSON.parse(blueContent);
      this.greenData = JSON.parse(greenContent);
    } catch (error) {
      console.error('Error loading pricing data:', error);
    }
  }

  // Check if IP is in CIDR range
  isIPInRange(ip, cidr) {
    const [range, bits = '32'] = cidr.split('/');
    const mask = ~((1 << (32 - parseInt(bits))) - 1) >>> 0;
    
    const ipToInt = (ip) => {
      return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
    };
    
    return (ipToInt(ip) & mask) === (ipToInt(range) & mask);
  }

  // Percentage-based routing
  getVersionByPercentage() {
    const random = Math.random() * 100;
    const { blue, green } = routingConfig.percentage;
    
    return random < blue ? 'blue' : 'green';
  }

  // IP-based routing
  getVersionByIP(ip) {
    const { ipRanges } = routingConfig;
    
    for (const range of ipRanges.blue || []) {
      if (this.isIPInRange(ip, range)) return 'blue';
    }
    
    for (const range of ipRanges.green || []) {
      if (this.isIPInRange(ip, range)) return 'green';
    }
    
    return this.getVersionByPercentage(); // Fallback to percentage
  }

  // Header-based routing
  getVersionByHeader(headers) {
    const { headers: headerConfig } = routingConfig;
    
    for (const [headerName, mapping] of Object.entries(headerConfig)) {
      const headerValue = headers[headerName.toLowerCase()];
      if (headerValue && mapping[headerValue]) {
        return mapping[headerValue];
      }
    }
    
    return this.getVersionByPercentage(); // Fallback to percentage
  }

  // Cookie-based routing (sticky sessions)
  getVersionByCookie(cookies) {
    const cookieName = routingConfig.cookie.name;
    return cookies[cookieName] || this.getVersionByPercentage();
  }

  // Main routing logic
  determineVersion(req) {
    const { strategy } = routingConfig;
    const clientIP = req.ip || req.connection.remoteAddress;
    const headers = req.headers;
    const cookies = req.cookies || {};

    switch (strategy) {
      case 'ip':
        return this.getVersionByIP(clientIP);
      case 'header':
        return this.getVersionByHeader(headers);
      case 'cookie':
        return this.getVersionByCookie(cookies);
      case 'percentage':
      default:
        return this.getVersionByPercentage();
    }
  }

  // Get pricing data by version
  getPricingData(version) {
    return version === 'blue' ? this.blueData : this.greenData;
  }
}

const routingService = new RoutingService();

export const routingMiddleware = (req, res, next) => {
  const version = routingService.determineVersion(req);
  const pricingData = routingService.getPricingData(version);
  
  // Set cookie for sticky sessions if using cookie strategy
  if (routingConfig.strategy === 'cookie') {
    res.cookie(
      routingConfig.cookie.name,
      version,
      { 
        maxAge: routingConfig.cookie.maxAge,
        httpOnly: true
      }
    );
  }
  
  req.pricingVersion = version;
  req.pricingData = pricingData;
  
  next();
};

export default routingService;