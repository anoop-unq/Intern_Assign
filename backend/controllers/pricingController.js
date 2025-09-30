import routingService from '../services/routingService.js';
import { logRequest } from '../services/loggerService.js';

export const getPricing = async (req, res) => {
  try {
    console.log('🔍 Pricing request received:', {
      headers: {
        'x-version': req.headers['x-version'],
        'x-test-mode': req.headers['x-test-mode'],
        'x-clear-cookie': req.headers['x-clear-cookie']
      },
      cookies: req.cookies,
      strategy: process.env.ROUTING_STRATEGY
    });

    // Ensure pricing data is loaded
    if (!routingService.bluePricing || !routingService.greenPricing) {
      await routingService.initializePricingData();
    }

    let version;
    const isManualTest = req.headers['x-test-mode'] === 'manual';
    const shouldClearCookie = req.headers['x-clear-cookie'] === 'true';

    if (isManualTest && req.headers['x-version']) {
      // Manual testing - respect the header exactly
      version = req.headers['x-version'];
      console.log('🧪 MANUAL TEST - Forcing version:', version);
    } else {
      // Normal routing logic
      version = routingService.determineVersion(req);
    }

    const pricingData = routingService.getPricingData(version);
    
    console.log('🎯 Final version decision:', {
      manualTest: isManualTest,
      requested: req.headers['x-version'],
      final: version,
      strategy: process.env.ROUTING_STRATEGY
    });

    // Store strategy for logging
    req.routingStrategy = isManualTest ? 'manual-test' : (process.env.ROUTING_STRATEGY || 'percentage');
    
    // Set cookie for sticky sessions (unless manual testing or clear requested)
    if (!isManualTest && !shouldClearCookie && 
        (process.env.ROUTING_STRATEGY === 'percentage' || process.env.ROUTING_STRATEGY === 'cookie')) {
      res.cookie(
        process.env.COOKIE_NAME || 'pricing-version', 
        version, 
        {
          maxAge: parseInt(process.env.COOKIE_MAX_AGE) || 86400000,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        }
      );
      console.log('🍪 Cookie set:', version);
    } else if (shouldClearCookie) {
      // Clear the cookie for manual testing
      res.clearCookie(process.env.COOKIE_NAME || 'pricing-version');
      console.log('🧹 Cookie cleared for manual testing');
    }

    // Log the request
    logRequest(req, version);

    res.json({
      success: true,
      data: pricingData,
      version: version,
      servedBy: req.routingStrategy,
      isManualTest: isManualTest,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in pricing controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};