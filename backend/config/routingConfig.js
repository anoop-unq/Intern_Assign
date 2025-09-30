const routingConfig = {
  strategy: process.env.ROUTING_STRATEGY || 'percentage', // percentage, ip, header, cookie
  percentage: {
    blue: parseInt(process.env.BLUE_PERCENTAGE) || 70,
    green: parseInt(process.env.GREEN_PERCENTAGE) || 30
  },
  ipRanges: {
    blue: process.env.BLUE_IP_RANGES ? process.env.BLUE_IP_RANGES.split(',') : ['192.168.1.1-192.168.1.100'],
    green: process.env.GREEN_IP_RANGES ? process.env.GREEN_IP_RANGES.split(',') : ['192.168.1.101-192.168.1.200']
  },
  headers: {
    versionHeader: process.env.VERSION_HEADER || 'X-Version',
    blueValue: process.env.BLUE_HEADER_VALUE || 'blue',
    greenValue: process.env.GREEN_HEADER_VALUE || 'green'
  },
  cookie: {
    name: process.env.COOKIE_NAME || 'pricing-version',
    maxAge: parseInt(process.env.COOKIE_MAX_AGE) || 24 * 60 * 60 * 1000 // 24 hours
  }
};

export default routingConfig;