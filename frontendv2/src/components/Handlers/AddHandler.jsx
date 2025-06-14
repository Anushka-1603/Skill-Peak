import React, { useState } from 'react';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';

const AddHandler = () => {
  const [formData, setFormData] = useState({
    handlername: '',
    handlerid: '',
    platform: 'LC', // Default: LeetCode
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!formData.handlername.trim() || !formData.handlerid.trim() || !formData.platform) {
        setError('All fields are required.');
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    try {
      await API.createUserHandler(formData);
      setSuccessMessage(`Handler "${formData.handlername}" added successfully! Redirecting...`);
      setFormData({ handlername: '', handlerid: '', platform: 'LC' }); 
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/handlers');
      }, 2500);
    } catch (err) {
      console.error("Failed to add handler:", err.response);
      const apiErrors = err.response?.data;
      if (apiErrors && typeof apiErrors === 'object') {
        let errorMessages = [];
        for (const key in apiErrors) {
          const messages = Array.isArray(apiErrors[key]) ? apiErrors[key].join(', ') : apiErrors[key];
          errorMessages.push(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${messages}`);
        }
        setError(errorMessages.join('; '));
      } else if (typeof apiErrors === 'string') {
        setError(apiErrors);
      }
      else {
        setError('Failed to add handler. The ID might already exist for this platform or is invalid.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">Add New Handler</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success: </strong>
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg px-6 sm:px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="handlername" className="block text-gray-700 text-sm font-bold mb-2">
            Display Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="handlername"
            id="handlername"
            value={formData.handlername}
            onChange={handleChange}
            required
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., My LeetCode, John's GitHub"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="platform" className="block text-gray-700 text-sm font-bold mb-2">
            Platform <span className="text-red-500">*</span>
          </label>
          <select
            name="platform"
            id="platform"
            value={formData.platform}
            onChange={handleChange}
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="LC">LeetCode</option>
            <option value="GH">GitHub</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label htmlFor="handlerid" className="block text-gray-700 text-sm font-bold mb-2">
            Platform User ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="handlerid"
            id="handlerid"
            value={formData.handlerid}
            onChange={handleChange}
            required
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={formData.platform === 'LC' ? "Your LeetCode Username" : "Your GitHub Username"}
          />
           <p className="text-xs text-gray-500 mt-1">This is your actual username on {formData.platform === 'LC' ? "LeetCode" : "GitHub"}.</p>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Adding...' : 'Add Handler'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHandler;