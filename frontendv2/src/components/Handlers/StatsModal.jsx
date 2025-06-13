// src/components/Handlers/StatsModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import API from '../../services/api';

const StatsModal = ({ handler, isOpen, onClose }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [days, setDays] = useState(7);

  const fetchStats = useCallback(async () => {
    if (!handler) return;
    setLoading(true);
    setError('');
    setStats(null);
    try {
      const platformParam = handler.platform === 'LC' ? 'leetcode' : 
                            handler.platform === 'GH' ? 'github' : '';
      if (!platformParam) {
        setError('Invalid platform configuration for this handler.');
        setLoading(false);
        return;
      }
      const response = await API.getIndividualStats(handler.handlerid, platformParam, days);
      setStats(response.data);
    } catch (err) {
      console.error("Failed to load stats:", err);
      setError(err.response?.data?.error || 'Failed to load stats for the selected period.');
    } finally {
      setLoading(false);
    }
  }, [handler, days]);

  useEffect(() => {
    if (isOpen && handler) {
      fetchStats();
    }
  }, [isOpen, handler, fetchStats]); // fetchStats will change if 'days' changes

  if (!isOpen || !handler) return null;

  const platformName = handler.platform === 'LC' ? 'LeetCode' : 
                       handler.platform === 'GH' ? 'GitHub' : 'Unknown';

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full flex justify-center items-center z-50 p-4">
      <div className="relative bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md mx-auto">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
          aria-label="Close modal"
        >
          ×
        </button>
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
          Stats for {handler.handlername} ({platformName})
        </h2>
        
        <div className="mb-5">
          <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-1">
            Show stats for the last:
          </label>
          <select 
            id="days" 
            name="days"
            value={days} 
            onChange={(e) => setDays(Number(e.target.value))}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
          >
            <option value="7">7 days</option>
            <option value="30">30 days</option>
            <option value="90">90 days</option>
            <option value="365">365 days (may take longer)</option>
          </select>
        </div>

        {loading && <p className="text-blue-600 my-4 text-center">Loading stats...</p>}
        {error && <p className="text-red-600 my-4 bg-red-50 p-3 rounded-md">{error}</p>}
        
        {stats && !loading && !error && (
          <div className="bg-gray-50 p-4 rounded-md">
            {platformName === 'LeetCode' && stats['Leetcode submissions'] !== undefined && (
              <p className="text-lg text-gray-700">
                Submissions: <span className="font-bold text-gray-900">{stats['Leetcode submissions']}</span>
              </p>
            )}
            {platformName === 'GitHub' && stats['Github contributions'] !== undefined && (
              <p className="text-lg text-gray-700">
                Contributions: <span className="font-bold text-gray-900">{stats['Github contributions']}</span>
              </p>
            )}
            {/* Case where stats object is empty or doesn't match expected keys */}
            {Object.keys(stats).length === 0 && <p className="text-gray-600">No specific stats found for this period.</p>}
             {stats['Leetcode submissions'] === undefined && stats['Github contributions'] === undefined && Object.keys(stats).length > 0 && (
                <p className="text-gray-600">Stats data received, but format is unexpected.</p>
            )}
          </div>
        )}
        
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;