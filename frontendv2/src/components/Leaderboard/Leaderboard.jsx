import React, { useState, useEffect } from 'react';
import { Card } from '../UI/Card';
import { Alert } from '../UI/Alert';
import { fetchLeaderboard } from '../../services/api';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('week'); // 'day', 'week', 'month', 'all'

  useEffect(() => {
    loadLeaderboard();
  }, [timeframe]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await fetchLeaderboard(timeframe);
      setLeaderboard(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getPositionClass = (position) => {
    switch (position) {
      case 1:
        return 'bg-yellow-100 border-yellow-500';
      case 2:
        return 'bg-gray-100 border-gray-400';
      case 3:
        return 'bg-amber-100 border-amber-500';
      default:
        return 'bg-white';
    }
  };

  const getPositionEmoji = (position) => {
    switch (position) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <div className="inline-flex rounded-md">
          <button
            onClick={() => setTimeframe('day')}
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              timeframe === 'day' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-300`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeframe('week')}
            className={`px-4 py-2 text-sm font-medium ${
              timeframe === 'week' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border-t border-b border-gray-300`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-4 py-2 text-sm font-medium ${
              timeframe === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border-t border-b border-gray-300`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeframe('all')}
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${
              timeframe === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-300`}
          >
            All Time
          </button>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      <Card>
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No leaderboard data available for this time period.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Success Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Calls
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Handlers
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((entry, index) => (
                  <tr 
                    key={entry.userId} 
                    className={`${getPositionClass(index + 1)} ${index < 3 ? 'border-l-4' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {index + 1} {getPositionEmoji(index + 1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {entry.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{entry.name}</div>
                          {entry.company && (
                            <div className="text-sm text-gray-500">{entry.company}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.successRate}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 rounded-full h-2" 
                          style={{ width: `${entry.successRate}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.totalCalls.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.handlersCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Leaderboard;