import axios from 'axios';
import { toast } from 'react-toastify';

const backendURL = 'http://localhost:8000';

// Create API client instance
const api = axios.create({
    baseURL: `${backendURL}/api`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Create unauthorized instance for auth endpoints
export const unauthorizedApi = axios.create({
    baseURL: `${backendURL}/api`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add authorization header
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.access) {
            config.headers.Authorization = `Bearer ${user.access}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling token refresh and errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors and token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user?.refresh) {
                    throw new Error('No refresh token available');
                }

                const response = await unauthorizedApi.post('auth/token/refresh/', {
                    refresh: user.refresh
                });

                if (response.data.access) {
                    // Update the access token in localStorage
                    localStorage.setItem('user', JSON.stringify({
                        ...user,
                        access: response.data.access
                    }));

                    // Retry the original request with new token
                    originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                    return axios(originalRequest);
                }
            } catch (refreshError) {
                // Clear user data and redirect to login
                localStorage.removeItem('user');
                toast.error('Session expired. Please login again.', {
                    toastId: 'session-expired',
                });
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle other errors
        if (error.response?.data?.error) {
            toast.error(error.response.data.error);
        } else if (error.response?.status === 403) {
            toast.error('Access denied. Please login again.');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;