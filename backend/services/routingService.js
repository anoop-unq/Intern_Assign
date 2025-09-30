import routingConfig from '../config/routingConfig.js';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class RoutingService {
  constructor() {
    this.bluePricing = null;
    this.greenPricing = null;
    this.loadPricingData();
  }

  async loadPricingData() {
    try {
      const blueData = await readFile(
        path.join(__dirname, '../data/blue-pricing.json'), 
        'utf8'
      );
      const greenData = await readFile(
        path.join(__dirname, '../data/green-pricing.json'), 
        'utf8'
      );
      
      this.bluePricing = JSON.parse(blueData);
      this.greenPricing = JSON.parse(greenData);
      console.log('Pricing data loaded successfully');
    } catch (error) {
      console.error('Error loading pricing data:', error);
      // Fallback data
      this.bluePricing = this.getFallbackData('blue');
      this.greenPricing = this.getFallbackData('green');
    }
  }

  getFallbackData(version) {
    return {
      version: version,
      plans: [
        {
          name: `${version.toUpperCase()} Basic`,
          price: "$9.99",
          features: ["Fallback Plan", "Basic Features"],
          popular: false
        }
      ]
    };
  }

  getVersionByPercentage() {
    const random = Math.random() * 100;
    return random < routingConfig.percentage.blue ? 'blue' : 'green';
  }

  getVersionByIP(ip) {
    // Extract IP from headers (behind proxy) or use direct connection
    const clientIP = ip || '127.0.0.1';
    const blueRanges = routingConfig.ipRanges.blue;
    
    for (const range of blueRanges) {
      if (this.isIPInRange(clientIP, range)) {
        return 'blue';
      }
    }
    
    return 'green';
  }

  isIPInRange(ip, range) {
    // Simple IP range check implementation
    // For production, use a proper IP address validation library
    const [start, end] = range.split('-');
    
    // Convert IP to number for simple comparison
    const ipToNum = this.ipToNumber(ip);
    const startNum = this.ipToNumber(start);
    const endNum = this.ipToNumber(end);
    
    return ipToNum >= startNum && ipToNum <= endNum;
  }

  ipToNumber(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
  }

getVersionByHeader(headers) {
  const versionHeader = routingConfig.headers.versionHeader;
  
  // Check header in different cases
  const headerValue = headers[versionHeader.toLowerCase()] || 
                     headers[versionHeader] ||
                     headers[versionHeader.toUpperCase()];

  console.log('📨 Header detection:', {
    lookingFor: versionHeader,
    receivedValue: headerValue,
    availableHeaders: Object.keys(headers)
  });

  if (headerValue === routingConfig.headers.blueValue) {
    console.log('🎯 Header explicitly routing to: BLUE');
    return 'blue';
  }
  if (headerValue === routingConfig.headers.greenValue) {
    console.log('🎯 Header explicitly routing to: GREEN');
    return 'green';
  }
  
  console.log('🔄 No valid header found, using fallback routing');
  return this.getVersionByPercentage();
}

  getVersionByCookie(cookies) {
    const cookieName = routingConfig.cookie.name;
    const cookieValue = cookies && cookies[cookieName];
    
    if (cookieValue === 'blue' || cookieValue === 'green') {
      return cookieValue;
    }
    
    const newVersion = this.getVersionByPercentage();
    return newVersion;
  }

  determineVersion(req) {
    const strategy = routingConfig.strategy;
    const clientIP = req.headers['x-forwarded-for'] || 
                    req.connection.remoteAddress || 
                    req.socket.remoteAddress;

    switch (strategy) {
      case 'ip':
        return this.getVersionByIP(clientIP);
      
      case 'header':
        return this.getVersionByHeader(req.headers);
      
      case 'cookie':
        return this.getVersionByCookie(req.cookies);
      
      case 'percentage':
      default:
        return this.getVersionByPercentage();
    }
  }

  getPricingData(version) {
    return version === 'blue' ? this.bluePricing : this.greenPricing;
  }
}

export default new RoutingService();