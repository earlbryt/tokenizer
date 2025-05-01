import axios from 'axios';

// Base API URL - configurable for different environments
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Check if the API server is available
 * @returns {Promise<Object>} Health status
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/api/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

/**
 * Tokenize text using the BPE tokenizer
 * @param {string} text - Text to tokenize
 * @returns {Promise<Object>} Tokenization result
 */
export const tokenize = async (text) => {
  try {
    const response = await apiClient.post('/api/tokenize', { text });
    return response.data;
  } catch (error) {
    console.error('Tokenization failed:', error);
    throw error;
  }
}; 