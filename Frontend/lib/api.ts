import axios from 'axios';

// Base API URL - configurable for different environments
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Types for API responses
export interface TokenizationResult {
  tokens: number[];
  decoded: string;
  tokenMappings: Array<{ id: number; text: string }>;
  stats: {
    originalSize: number;
    tokenCount: number;
    compressionRatio: number;
    matches: boolean;
  };
}

export interface HealthCheckResult {
  status: string;
  tokenizer_loaded: boolean;
}

/**
 * Check if the API server is available
 * @returns {Promise<HealthCheckResult>} Health status
 */
export const checkHealth = async (): Promise<HealthCheckResult> => {
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
 * @returns {Promise<TokenizationResult>} Tokenization result
 */
export const tokenize = async (text: string): Promise<TokenizationResult> => {
  try {
    const response = await apiClient.post('/api/tokenize', { text });
    return response.data;
  } catch (error) {
    console.error('Tokenization failed:', error);
    throw error;
  }
}; 