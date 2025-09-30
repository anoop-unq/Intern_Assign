import morgan from 'morgan';

// Custom token for pricing version
morgan.token('pricing-version', (req) => {
  return req.pricingVersion || 'unknown';
});

// Custom token for client IP
morgan.token('client-ip', (req) => {
  return req.ip || req.connection.remoteAddress || 'unknown';
});

// Custom format
const logFormat = ':method :url :status - :response-time ms - IP: :client-ip - Version: :pricing-version';

export const loggingMiddleware = morgan(logFormat, {
  stream: {
    write: (message) => {
      console.log(message.trim());
    }
  }
});

export const detailedLogging = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      clientIP: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      pricingVersion: req.pricingVersion,
      headers: req.headers
    };
    
    console.log('Pricing Request:', JSON.stringify(logEntry, null, 2));
  });
  
  next();
};