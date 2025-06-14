import React, { useState } from 'react';
import API from '../../services/api';

const HandlerCard = ({ handler, onDeleted, onViewStats }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${handler.handlername} (${handler.platform})?`)) {
      return;
    }
    setIsDeleting(true);
    setError('');
    try {
      await API.deleteUserHandler({ 
        handlerid: handler.handlerid,
        platform: handler.platform 
      });
      onDeleted(handler.id); // Use the database PK for local state update
    } catch (err) {
      console.error("Failed to delete handler:", err);
      setError(err.response?.data?.detail || err.response?.data?.error || 'Failed to delete handler.');
    } finally {
      setIsDeleting(false);
    }
  };

  const platformName = handler.platform === 'LC' ? 'LeetCode' : 
                       handler.platform === 'GH' ? 'GitHub' : handler.platform;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 transition-shadow hover:shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="mb-3 sm:mb-0">
          <h3 className="text-lg font-semibold text-gray-800">{handler.handlername}</h3>
          <p className="text-sm text-gray-500">
            Platform: <span className="font-medium text-blue-600">{platformName}</span>
          </p>
          <p className="text-sm text-gray-500">
            ID: <span className="font-mono text-gray-700">{handler.handlerid}</span>
          </p>
        </div>
        <div className="flex space-x-2 shrink-0">
          <button
            onClick={() => onViewStats(handler)}
            className="bg-sky-500 hover:bg-sky-600 text-white text-xs sm:text-sm font-semibold py-1.5 px-3 rounded transition duration-200"
          >
            View Stats
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-semibold py-1.5 px-3 rounded transition duration-200 ${
              isDeleting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
};

export default HandlerCard;