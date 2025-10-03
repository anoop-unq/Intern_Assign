import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [pricingData, setPricingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(null);
  const [isManualTest, setIsManualTest] = useState(false);

  const fetchPricing = async (customHeader = null, clearCookie = false) => {
    setLoading(true);
    setError(null);
    
    try {
      let config = {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      };

      if (customHeader) {
        config.headers['X-Version'] = customHeader;
        setIsManualTest(true);
        
        // If manually testing with headers, add a flag to ignore cookies
        config.headers['X-Test-Mode'] = 'manual';
      } else {
        setIsManualTest(false);
      }

      if (clearCookie) {
        config.headers['X-Clear-Cookie'] = 'true';
      }

      console.log('🔄 Fetching pricing:', {
        header: customHeader || 'auto',
        clearCookie: clearCookie
      });
      
      const response = await axios.get('https://intern-assign-zjov.onrender.com/api/pricing', config);
      
      console.log('✅ Received:', {
        version: response.data.version,
        strategy: response.data.servedBy
      });
      
      setPricingData(response.data.data);
      setVersion(response.data.version);
      return response.data;
    } catch (err) {
      console.error('❌ API Error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch pricing data';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  // Test functions for manual testing
  const testBlueVersion = () => {
    console.log('🔵 Testing BLUE version (forcing header)');
    fetchPricing('blue', true); // Force blue and clear cookie
  };

  const testGreenVersion = () => {
    console.log('🟢 Testing GREEN version (forcing header)');
    fetchPricing('green', true); // Force green and clear cookie
  };

  const testAutoRouting = () => {
    console.log('🔄 Testing AUTO routing');
    fetchPricing(); // Let backend decide
  };

  useEffect(() => {
    console.log('🎯 Initial pricing load...');
    fetchPricing();
  }, []);

  const value = {
    pricingData,
    loading,
    error,
    version,
    isManualTest,
    testBlueVersion,
    testGreenVersion,
    testAutoRouting,
    clearError
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};