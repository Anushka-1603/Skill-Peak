// // // import axios from '../utils/axiosConfig';

// // // const API = {
// // //   // User Handlers
// // //   getUserHandlers: async () => {
// // //     return await axios.get('/api/userhandlers/');
// // //   },
  
// // //   createUserHandler: async (handlerData) => {
// // //     return await axios.post('/api/userhandlers/', handlerData);
// // //   },
  
// // //   getUserHandler: async (handlerid, platform) => {
// // //     return await axios.get('/api/userhandler/', { data: { handlerid, platform } });
// // //   },

// // //   deleteUserHandler: async (handlerid, platform) => {
// // //     return await axios.delete('/api/userhandler/', { data: { handlerid, platform } });
// // //   },
  
// // //   // Individual Stats
// // //   getIndividualStats: async (handlerid, platform, days = 7) => {
// // //     return await axios.get(`/api/userhandlers/viewhandler/?handlerid=${handlerid}&platform=${platform}&days=${days}`);
// // //   },
  
// // //   // Leaderboard and Stats
// // //   getTopPerformers: async () => {
// // //     return await axios.get('/api/userhandlers/update-stats/');
// // //   },
  
// // //   // User Profiles (Admin Only)
// // //   getUserProfiles: async () => {
// // //     return await axios.get('/api/');
// // //   },
  
// // //   getUserProfile: async (id) => {
// // //     return await axios.get(`/api/${id}/`);
// // //   },
  
// // //   // Authentication
// // //   login: async (credentials) => {
// // //     return await axios.post('/api/auth/login/', credentials);
// // //   },
  
// // //   register: async (userData) => {
// // //     return await axios.post('/api/auth/register/', userData);
// // //   },
  
// // //   logout: async () => {
// // //     return await axios.post('/api/auth/logout/');
// // //   },
  
// // //   refreshToken: async (refreshToken) => {
// // //     return await axios.post('/api/auth/token/refresh/', { refresh: refreshToken });
// // //   }
// // // };

// // // export default API;
// // import axios from '../utils/axiosConfig';

// // // Generic API service functions that don't fit into specific services

// // /**
// //  * Fetch leaderboard data
// //  * @param {string} timeframe - 'day', 'week', 'month', or 'all'
// //  * @returns {Promise<Array>} - List of leaderboard entries
// //  */
// // export const fetchLeaderboard = async (timeframe = 'week') => {
// //   const response = await axios.get(`/leaderboard`, {
// //     params: { timeframe }
// //   });
// //   return response.data;
// // };

// // /**
// //  * Fetch system stats
// //  * @returns {Promise<Object>} - System statistics
// //  */
// // export const fetchSystemStats = async () => {
// //   const response = await axios.get('/stats/system');
// //   return response.data;
// // };

// // /**
// //  * Fetch user dashboard stats
// //  * @returns {Promise<Object>} - User dashboard statistics
// //  */
// // export const fetchDashboardStats = async () => {
// //   const response = await axios.get('/stats/dashboard');
// //   return response.data;
// // };

// // /**
// //  * Send feedback to the system
// //  * @param {Object} feedbackData - Feedback data
// //  * @returns {Promise<Object>} - Response
// //  */
// // export const sendFeedback = async (feedbackData) => {
// //   const response = await axios.post('/feedback', feedbackData);
// //   return response.data;
// // };

// // /**
// //  * Fetch notifications for the current user
// //  * @returns {Promise<Array>} - List of notifications
// //  */
// // export const fetchNotifications = async () => {
// //   const response = await axios.get('/notifications');
// //   return response.data;
// // };

// // /**
// //  * Mark notification as read
// //  * @param {string} notificationId - ID of the notification
// //  * @returns {Promise<Object>} - Response
// //  */
// // export const markNotificationAsRead = async (notificationId) => {
// //   const response = await axios.put(`/notifications/${notificationId}/read`);
// //   return response.data;
// // };

// // /**
// //  * Fetch documentation
// //  * @param {string} topic - Documentation topic
// //  * @returns {Promise<Object>} - Documentation content
// //  */
// // export const fetchDocumentation = async (topic) => {
// //   const response = await axios.get(`/documentation/${topic}`);
// //   return response.data;
// // };

// // /**
// //  * Fetch user activity log
// //  * @param {Object} params - Filter parameters
// //  * @returns {Promise<Array>} - Activity log entries
// //  */
// // export const fetchActivityLog = async (params = {}) => {
// //   const response = await axios.get('/user/activity-log', { params });
// //   return response.data;
// // };

// // export default {
// //   fetchLeaderboard,
// //   fetchSystemStats,
// //   fetchDashboardStats,
// //   sendFeedback,
// //   fetchNotifications,
// //   markNotificationAsRead,
// //   fetchDocumentation,
// //   fetchActivityLog
// // };

// // src/services/api.jsx


// import axios from 'axios';

// // Create an axios instance with default configurations
// const instance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor for adding the auth token
// instance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for token refresh
// instance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
    
//     // If the error is 401 and hasn't been retried yet
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       try {
//         // Try to refresh the token
//         const refreshToken = localStorage.getItem('refreshToken');
//         if (!refreshToken) {
//           // No refresh token available, logout
//           localStorage.removeItem('accessToken');
//           localStorage.removeItem('refreshToken');
//           return Promise.reject(error);
//         }
        
//         const response = await axios.post(
//           `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'}auth/token/refresh/`,
//           { refresh: refreshToken }
//         );
        
//         if (response.data.access) {
//           localStorage.setItem('accessToken', response.data.access);
          
//           // Update the original request with the new token
//           originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
//           return instance(originalRequest);
//         }
//       } catch (refreshError) {
//         // If refresh token fails, log out the user
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('refreshToken');
//         return Promise.reject(refreshError);
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

// const API = {
//   // Authentication endpoints
//   register: (userData) => {
//     return instance.post('auth/register/', userData);
//   },
  
//   login: (credentials) => {
//     return instance.post('auth/login/', credentials);
//   },
  
//   logout: () => {
//     return instance.post('auth/logout/');
//   },
  
//   // User handlers endpoints
//   getUserHandlers: () => {
//     return instance.get('userhandlers/');
//   },
  
//   createUserHandler: (handlerData) => {
//     return instance.post('userhandlers/', handlerData);
//   },
  
//   getUserHandler: (handlerData) => {
//     return instance.get('userhandler/', { data: handlerData });
//   },
  
//   deleteUserHandler: (handlerData) => {
//     return instance.delete('userhandler/', { data: handlerData });
//   },
  
//   // Stats endpoints
//   getTopPerformers: () => {
//     return instance.get('userhandlers/update-stats/');
//   },
  
//   getIndividualStats: (handlerid, platform, days = 7) => {
//     return instance.get(`userhandlers/viewhandler/?handlerid=${handlerid}&platform=${platform}&days=${days}`);
//   },
  
//   // User profile endpoints (admin only)
//   getAllUsers: () => {
//     return instance.get('');
//   },
  
//   getUserProfile: (userId) => {
//     return instance.get(`${userId}/`);
//   },
  
//   // Admin only endpoint
//   getAllUserHandlers: () => {
//     return instance.get('userhandlers/all/');
//   }
// };

// export default API;
// src/services/api.jsx
import axios from 'axios';

// Create an axios instance with default configurations
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the auth token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and hasn't been retried yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          // Optionally redirect to login or let AuthContext handle it
          // window.location.href = '/login'; 
          return Promise.reject(error);
        }
        
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'}auth/token/refresh/`,
          { refresh: refreshToken }
        );
        
        if (refreshResponse.data.access) {
          localStorage.setItem('accessToken', refreshResponse.data.access);
          originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.data.access}`;
          return instance(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        // Optionally redirect to login
        // window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

const API = {
  // Authentication endpoints
  register: (userData) => {
    return instance.post('auth/register/', userData);
  },
  
  login: (credentials) => {
    return instance.post('auth/login/', credentials);
  },
  
  logout: (refreshTokenData) => { // Expects { refresh: "token_string" }
    return instance.post('auth/logout/', refreshTokenData);
  },
  
  // User handlers endpoints
  getUserHandlers: () => {
    return instance.get('userhandlers/');
  },
  
  createUserHandler: (handlerData) => {
    return instance.post('userhandlers/', handlerData);
  },
  
  // getUserHandler: (handlerData) => { // This was problematic, removing as not directly used by current core features
  //   return instance.get('userhandler/', { data: handlerData });
  // },
  
  deleteUserHandler: (handlerData) => { // handlerData should be { handlerid: '...', platform: '...' }
    return instance.delete('userhandler/', { data: handlerData });
  },
  
  // Stats endpoints
  getTopPerformers: (days=7) => { // This is the new 'update-stats' endpoint
    return instance.get(`dashboard-stats/?days=${days}`);
  },

  getWeeklyLeaderboard: () => {
    return instance.get('weekly-leaderboard/');
  },
  
  getIndividualStats: (handlerid, platform, days = 7) => {
    return instance.get(`userhandlers/viewhandler/?handlerid=${handlerid}&platform=${platform}&days=${days}`);
  },
  
  // User profile endpoints (admin only by default in your views.py, but used by AuthContext)
  // These might require IsAuthenticated rather than IsAdminUser if regular users need to see their own.
  // Your UserProfileDetailAPIView uses IsAdminUser. This means regular users can't fetch their profile via /api/<pk>/.
  // The login endpoint already returns user data, which AuthContext will use.
  
  // Admin only endpoint (example)
  // getAllUserHandlers: () => {
  //   return instance.get('userhandlers/all/');
  // }
};

export default API;