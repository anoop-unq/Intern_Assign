import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  }
});

export const pricingAPI = {
  getPricing: async () => {
    try {
      const response = await api.get('/pricing');
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Method to test different routing strategies
  getPricingWithHeader: async (version) => {
    try {
      const response = await api.get('/pricing', {
        headers: {
          'X-Version': version
        }
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

export default api;