import axios from 'axios';

// Use environment variable if available, otherwise use local development server
const API_URL = (process.env.REACT_APP_API_URL || 'https://propertydekho-6tu7.onrender.com') + '/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include credentials for cookies if using sessions
  timeout: 10000 // Increase timeout to 10 seconds
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.status, error.response.data);
      
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      console.error('Unauthorized access - please log in');
    }
    return Promise.reject(error);
  }
);

// Properties API
export const getProperties = () => api.get('/properties');
export const getProperty = (id) => api.get(`/properties/${id}`);
export const createProperty = (propertyData) => api.post('/properties', propertyData);
export const updateProperty = (id, propertyData) => api.patch(`/properties/${id}`, propertyData);
export const deleteProperty = (id) => api.delete(`/properties/${id}`);

// Clients API
export const getClients = () => api.get('/clients');
export const getClient = (id) => api.get(`/clients/${id}`);
export const createClient = (clientData) => api.post('/clients', clientData);
export const updateClient = (id, clientData) => api.put(`/clients/${id}`, clientData);
export const deleteClient = (id) => api.delete(`/clients/${id}`);

// Meetings API
export const getMeetings = () => api.get('/meetings');
export const getMeeting = (id) => api.get(`/meetings/${id}`);
export const createMeeting = (meetingData) => api.post('/meetings', meetingData);
export const updateMeeting = (id, meetingData) => api.put(`/meetings/${id}`, meetingData);
export const deleteMeeting = (id) => api.delete(`/meetings/${id}`);

// Auth API
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);

// Export all API methods as a single object
const apiService = {
  // Properties
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  
  // Clients
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  
  // Meetings
  getMeetings,
  getMeeting,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  
  // Auth
  login,
  register,
};

export default apiService;

// Export the api instance for direct usage when needed
export { api };
