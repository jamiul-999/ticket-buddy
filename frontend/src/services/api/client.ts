import axios from 'axios';
const API_BASE_URL = 'http://localhost:8000';


export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Responded with error
      const errorData = error.response.data;
      throw new Error(errorData.message || errorData.detail || 'An error occurred');
    } else if (error.request) {
      // Request is made without response
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error(error.message);
    }
  }
);