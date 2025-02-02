import api, { unauthorizedApi } from './api';
import { toast } from 'react-toastify';

const authService = {
  login: async (username, password) => {
    try {
      const response = await unauthorizedApi.post('auth/login/', {
        username,
        password
      });
      if (response.data.access) {
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    }
  },

  register: async (username, password, email) => {
    try {
      const response = await unauthorizedApi.post('auth/register/', {
        username,
        email,
        password
      });
      toast.success('Registration successful! Please login.');
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        const errors = error.response.data;
        
        // Handle field-specific errors
        if (typeof errors === 'object') {
          Object.entries(errors).forEach(([field, errorList]) => {
            if (Array.isArray(errorList)) {
              // Show each error for the field
              errorList.forEach(error => {
                toast.error(`${field}: ${error}`, {
                  position: "top-right",
                  autoClose: 5000,
                });
              });
            } else if (typeof errorList === 'string') {
              // Handle single error string
              toast.error(`${field}: ${errorList}`, {
                position: "top-right",
                autoClose: 5000,
              });
            }
          });
        } else {
          // Handle non-object error response
          toast.error(errors.toString());
        }
      } else {
        // Handle network or other errors
        toast.error('Registration failed. Please try again.');
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.refresh) {
        await api.post('auth/logout/', { refresh: user.refresh });
      }
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
    } catch (error) {
      localStorage.removeItem('user');
      toast.error('Error during logout');
    }
  },
};

export default authService;