import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

export const logRequest = (req, version) => {
  const clientIP = req.ip || 
                  req.headers['x-forwarded-for'] || 
                  req.connection.remoteAddress || 
                  'unknown';
  
  logger.info('Pricing request served', {
    timestamp: new Date().toISOString(),
    clientIP: clientIP,
    userAgent: req.get('User-Agent') || 'unknown',
    version: version,
    strategy: req.routingStrategy || 'percentage',
    endpoint: req.originalUrl
  });
};

export default logger;