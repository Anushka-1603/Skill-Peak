import React, { useEffect, useState, useContext, useCallback } from 'react';
import API from '../../services/api';
import PerformanceBarChart from './PerformanceBarChart';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [days, setDays] = useState(7);
  const { user } = useContext(AuthContext);

  const [leetcodeChartData, setLeetcodeChartData] = useState(null);
  const [githubChartData, setGithubChartData] = useState(null);

  const prepareChartData = (performers, label, backgroundColor, borderColor, platformName) => {
    if (!performers || performers.length === 0) {
      return null;
    }
    const labels = performers.map(p => `${p.handlername} (${p.handlerid_platform})`);
    const data = performers.map(p => p.score);

    return {
      labels,
      datasets: [
        {
          label: `${platformName} ${label}`,
          data: data,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1,
          hoverBackgroundColor: backgroundColor.replace('0.6', '0.8'),
          hoverBorderColor: borderColor,
        },
      ],
    };
  };

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError('');
    setLeetcodeChartData(null); // Reset chart data
    setGithubChartData(null);   // Reset chart data
    try {
      const response = await API.getTopPerformers(days);
      setDashboardData(response.data);

      if (response.data) {
        setLeetcodeChartData(
          prepareChartData(
            response.data.leetcode,
            'Submissions',
            'rgba(255, 159, 64, 0.6)', // Orange
            'rgba(255, 159, 64, 1)',
            'LeetCode'
          )
        );
        setGithubChartData(
          prepareChartData(
            response.data.github,
            'Contributions',
            'rgba(75, 192, 192, 0.6)', // Teal
            'rgba(75, 192, 192, 1)',
            'GitHub'
          )
        );
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || 'Failed to load dashboard data. External APIs might be slow or unavailable.';
      setError(errorMsg);
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleDaysChange = (event) => {
    const newDays = parseInt(event.target.value, 10);
    if (!isNaN(newDays) && newDays > 0) {
      setDays(newDays);
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Your Performance Dashboard</h1>
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
      
      <p className="text-gray-600 mb-8 text-sm sm:text-base">
        Welcome, {user?.username}! Here's your current stand among your peers. Buckle up to get ahead of them before the week ends!!
      </p>

      {loading && (
        <div className="text-center p-10">
          <div role="status" className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 font-semibold text-gray-600">Loading Your Stats... (This may take a moment)</p>
        </div>
      )}
      
      {error && !loading && (
        <div className="m-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && dashboardData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {leetcodeChartData ? (
            <PerformanceBarChart 
              chartData={leetcodeChartData} 
              title={`Top LeetCode Grinders 👩🏻‍💻 (Last ${dashboardData.days_period} days)`}
              yAxisLabel="Submissions"
            />
          ) : (
            <div className="bg-white shadow-xl rounded-lg p-6 text-center lg:col-span-1">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">LeetCode Performance</h3>
              <p className="text-gray-500">No LeetCode activity to display for this period.</p>
            </div>
          )}

          {githubChartData ? (
            <PerformanceBarChart 
              chartData={githubChartData} 
              title={`Top GitHub Bugsters 🐛 (Last ${dashboardData.days_period} days)`}
              yAxisLabel="Contributions"
            />
          ) : (
             <div className="bg-white shadow-xl rounded-lg p-6 text-center lg:col-span-1">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">GitHub Performance</h3>
              <p className="text-gray-500">No GitHub activity to display for this period.</p>
            </div>
          )}
        </div>
      )}
      {!loading && !error && dashboardData && !leetcodeChartData && !githubChartData && (
         <div className="text-center p-10 bg-white shadow-xl rounded-lg mt-6">
            No activity found for your handlers in the last {dashboardData.days_period} days to display charts.
        </div>
      )}
    </div>
  );
};

export default Dashboard;