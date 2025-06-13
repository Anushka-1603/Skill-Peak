import React, { useEffect, useState, useContext, useCallback } from 'react';
import API from '../../services/api';
import StatsCard from './StatsCard'; // We can reuse or adapt StatsCard
import { AuthContext } from '../../context/AuthContext';

// A new or adapted StatsCard component for the dashboard specific data
const DashboardStatDisplay = ({ title, data, platform }) => {
    if (!data || data.length === 0) {
      return (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">{title}</h3>
          <p className="text-gray-500">No active {platform.toLowerCase()} handlers found for this period.</p>
        </div>
      );
    }
  
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-3">{title}</h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-2">
          {data.map((item, index) => (
            <li key={item.id || index} className="truncate">
              <span className="font-medium">{item.handlername}</span> ({item.handlerid_platform}):
              <span className="font-bold ml-1">{item.score}</span> {item.metric_name}
            </li>
          ))}
        </ol>
      </div>
    );
  };


const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [days, setDays] = useState(7); // Default to 7 days
  const { user } = useContext(AuthContext);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await API.getTopPerformers(days); // Use new API call
      setDashboardData(response.data);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || 'Failed to load dashboard data. External APIs might be slow or unavailable.';
      setError(errorMsg);
      setDashboardData(null); // Clear previous data on error
    } finally {
      setLoading(false);
    }
  }, [days]); // Re-fetch when 'days' changes

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleDaysChange = (event) => {
    const newDays = parseInt(event.target.value, 10);
    if (!isNaN(newDays) && newDays > 0) {
        setDays(newDays);
    } else if (event.target.value === '') { // Allow clearing input before typing new value
        setDays(7); // Or some other handling for empty input
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Your Dashboard</h1>
        <div className="flex items-center gap-2">
            <label htmlFor="days-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Stats for last:
            </label>
            <input 
                type="number" 
                id="days-filter"
                value={days}
                onChange={handleDaysChange}
                min="1"
                className="w-20 border border-gray-300 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-sm text-gray-700">days</span>
           
        </div>
      </div>
      
      <p className="text-lg text-gray-600 mb-8">
        Welcome, {user?.username}! Here's your current stand among your peers. Buckle up to get ahead of them before the week ends!!
      </p>

      {loading && <div className="text-center p-10 font-semibold text-gray-600">Loading Your Stats... (This may take a moment)</div>}
      
      {error && !loading && (
        <div className="m-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardStatDisplay
            title={"LeetCode Grinders 👨🏻‍💻"}
            data={dashboardData.leetcode}
            platform="LeetCode"
          />
          <DashboardStatDisplay
            title={"GitHub Bugsters 🐛"}
            data={dashboardData.github}
            platform="GitHub"
          />
        </div>
      )}
      {!loading && !error && dashboardData && dashboardData.leetcode?.length === 0 && dashboardData.github?.length === 0 && (
         <div className="text-center p-10 bg-white shadow rounded-lg mt-6">
            No activity found for your handlers in the last {dashboardData.days_period} days.
        </div>
      )}
    </div>
  );
};

export default Dashboard;