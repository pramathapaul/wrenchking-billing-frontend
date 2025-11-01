import axios from 'axios';

// In your frontend api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://wrenchking-billing-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for adding auth token if needed
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    // Ensure response data exists
    return {
      ...response,
      data: response.data || null
    };
  },
  (error) => {
    console.error('API Error:', error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with error status
      errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      // Request made but no response received
      errorMessage = 'No response from server. Please check your connection.';
      console.error('No response received:', error.request);
    } else {
      // Something else happened
      errorMessage = error.message;
      console.error('Error:', error.message);
    }
    
    // Enhanced error object
    const enhancedError = {
      ...error,
      userMessage: errorMessage,
      timestamp: new Date().toISOString()
    };
    
    return Promise.reject(enhancedError);
  }
);

// Invoice API calls with enhanced error handling
export const invoiceAPI = {
  // Get all invoices with data validation
  getAll: async () => {
    try {
      const response = await api.get('/invoices');
      return {
        ...response,
        data: Array.isArray(response.data) ? response.data : []
      };
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },
  
  // Get single invoice with data validation
  get: async (id) => {
    try {
      const response = await api.get(`/invoices/${id}`);
      return {
        ...response,
        data: response.data || null
      };
    } catch (error) {
      console.error(`Error fetching invoice ${id}:`, error);
      throw error;
    }
  },
  
  // Create new invoice
  create: async (invoiceData) => {
    try {
      const response = await api.post('/invoices', invoiceData);
      return response;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },
  
  // Update invoice
  update: async (id, invoiceData) => {
    try {
      const response = await api.put(`/invoices/${id}`, invoiceData);
      return response;
    } catch (error) {
      console.error(`Error updating invoice ${id}:`, error);
      throw error;
    }
  },
  
  // Delete invoice
  delete: async (id) => {
    try {
      const response = await api.delete(`/invoices/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting invoice ${id}:`, error);
      throw error;
    }
  },
  
  // Mark as paid
  markAsPaid: async (id) => {
    try {
      const response = await api.patch(`/invoices/${id}/paid`);
      return response;
    } catch (error) {
      console.error(`Error marking invoice ${id} as paid:`, error);
      throw error;
    }
  },
};


export default api;

