// import React, { useState, useEffect, useContext } from 'react';
// import { Link } from 'react-router-dom';
// import API from '../../services/api';
// import { AuthContext } from '../../context/AuthContext';
// import StatsCard from './StatsCard';

// const Dashboard = () => {
//   const [topPerformers, setTopPerformers] = useState({ leetcode: [], github: [] });
//   const [userHandlers, setUserHandlers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   const { user } = useContext(AuthContext);
  
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
        
//         // Fetch top performers
//         const topResponse = await API.getTopPerformers();
//         setTopPerformers({
//           leetcode: topResponse.data.leetcode || [],
//           github: topResponse.data.github || []
//         });
        
//         // Fetch user's handlers
//         const handlersResponse = await API.getUserHandlers();
//         setUserHandlers(handlersResponse.data);
        
//       } catch (err) {
//         console.error('Dashboard data fetch error:', err);
//         setError('Failed to load dashboard data. Please try again.');
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);
  
//   const getPlatformIcon = (platform) => {
//     if (platform === 'github') {
//       return (
//         <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//           <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
//         </svg>
//       );
//     } else if (platform === 'leetcode') {
//       return (
//         <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//           <path fill="currentColor" d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.514 1.357.514 1.871 0 .514-.513.514-1.356 0-1.87l-2.8-2.8c-1.356-1.356-3.192-2.059-4.964-2.059-1.772 0-3.608.703-4.965 2.059L1.47 9.057C.097 10.43-.623 12.25.431 14.156c.29.506.724.918 1.025 1.219l4.332 4.363c1.357 1.356 3.193 2.059 4.965 2.059 1.772 0 3.608-.703 4.964-2.06l2.697-2.605c.514-.514.514-1.357 0-1.87-.514-.514-1.357-.514-1.871 0zm-7.036-7.758l1.444 1.444c.513.513 1.356.513 1.87 0 .514-.513.514-1.357 0-1.87L10.94 8.31c-.513-.514-1.356-.514-1.87 0-.514.513-.514 1.356 0 1.87zm5.723 5.724l1.444 1.444c.513.513 1.356.513 1.87 0 .513-.513.513-1.357 0-1.87l-1.445-1.444c-.513-.513-1.356-.513-1.87 0-.513.513-.513 1.356 0 1.87" />
//         </svg>
//       );
//     }
//     return null;
//   };
  
//   return (
//     <div className="container mx-auto px-4">
//       <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
//       {isLoading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="loader"></div>
//         </div>
//       ) : error ? (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//           <span className="block sm:inline">{error}</span>
//         </div>
//       ) : (
//         <>
//           {/* Welcome Section */}
//           <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//             <h2 className="text-xl font-semibold mb-2">Welcome, {user?.username || 'Coder'}!</h2>
//             <p className="text-gray-600">
//               Track your coding progress and stay motivated with weekly insights of top performers.
//             </p>
//           </div>
          
//           {/* Quick Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//             <StatsCard 
//               title="My Handlers" 
//               value={userHandlers.length} 
//               icon={<svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
//               </svg>}
//               linkTo="/handlers"
//               linkText="View All"
//             />
//             <StatsCard 
//               title="GitHub Handlers" 
//               value={userHandlers.filter(h => h.platform === 'github').length} 
//               icon={getPlatformIcon('github')}
//               linkTo="/handlers"
//               linkText="View All"
//             />
//             <StatsCard 
//               title="LeetCode Handlers" 
//               value={userHandlers.filter(h => h.platform === 'leetcode').length} 
//               icon={getPlatformIcon('leetcode')}
//               linkTo="/handlers"
//               linkText="View All"
//             />
//             <StatsCard 
//               title="Top Performers" 
//               value={topPerformers.github.length + topPerformers.leetcode.length} 
//               icon={<svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
//               </svg>}
//               linkTo="/leaderboard"
//               linkText="View Leaderboard"
//             />
//           </div>
          
//           {/* Platform Sections */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* LeetCode Section */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <div className="flex items-center mb-4">
//                 {getPlatformIcon('leetcode')}
//                 <h2 className="text-xl font-semibold ml-2">LeetCode Top Performers</h2>
//               </div>
              
//               {topPerformers.leetcode.length > 0 ? (
//                 <div className="space-y-4">
//                   {topPerformers.leetcode.slice(0, 3).map((performer, index) => (
//                     <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
//                       <div className="flex items-center">
//                         <div className="bg-yellow-100 text-yellow-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">
//                           {index + 1}
//                         </div>
//                         <div>
//                           <p className="font-medium">{performer.handlerid.handlername}</p>
//                           <p className="text-sm text-gray-500">Submissions: {performer.submissions}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-500">No LeetCode data available yet.</p>
//               )}
              
//               <div className="mt-4">
//                 <Link to="/leaderboard" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
//                   View Full Leaderboard →
//                 </Link>
//               </div>
//             </div>
            
//             {/* GitHub Section */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <div className="flex items-center mb-4">
//                 {getPlatformIcon('github')}
//                 <h2 className="text-xl font-semibold ml-2">GitHub Top Contributors</h2>
//               </div>
              
//               {topPerformers.github.length > 0 ? (
//                 <div className="space-y-4">
//                   {topPerformers.github.slice(0, 3).map((performer, index) => (
//                     <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
//                       <div className="flex items-center">
//                         <div className="bg-green-100 text-green-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">
//                           {index + 1}
//                         </div>
//                         <div>
//                           <p className="font-medium">{performer.handlerid.handlername}</p>
//                           <p className="text-sm text-gray-500">Contributions: {performer.contributions}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-500">No GitHub data available yet.</p>
//               )}
              
//               <div className="mt-4">
//                 <Link to="/leaderboard" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
//                   View Full Leaderboard →
//                 </Link>
//               </div>
//             </div>
//           </div>
          
//           {/* Quick Actions */}
//           <div className="bg-white rounded-lg shadow-md p-6 mt-6">
//             <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <Link 
//                 to="/add-handler" 
//                 className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition duration-200"
//               >
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
//                 </svg>
//                 Add New Handler
//               </Link>
//               <Link 
//                 to="/handlers" 
//                 className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg flex items-center justify-center transition duration-200"
//               >
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
//                 </svg>
//                 View My Handlers
//               </Link>
//               <Link 
//                 to="/leaderboard" 
//                 className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg flex items-center justify-center transition duration-200"
//               >
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
//                 </svg>
//                 View Leaderboard
//               </Link>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
// src/components/Dashboard/Dashboard.jsx
import React, { useEffect, useState, useContext } from 'react';
import API from '../../services/api';
import StatsCard from './StatsCard';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        // API.getTopPerformers() calls '/api/userhandlers/update-stats/'
        // This endpoint updates stats and returns top 3 overall.
        const response = await API.getTopPerformers();
        setLeaderboardData(response.data);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError('Failed to load dashboard data. Please try again or check back later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center p-10 font-semibold text-gray-600">Loading Dashboard...</div>;
  }

  // This handles the error from the screenshot
  if (error) {
    return (
      <div className="m-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!leaderboardData || (!leaderboardData.leetcode?.length && !leaderboardData.github?.length)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome, {user?.username}!
        </p>
        <div className="text-center p-10 bg-white shadow rounded-lg">
            No leaderboard data available at the moment.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <p className="text-lg text-gray-600 mb-8">
        Welcome, {user?.username}! Here's a look at the top performers this week.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {leaderboardData.leetcode && leaderboardData.leetcode.length > 0 && (
          <StatsCard 
            title="Top LeetCode Performers (Weekly)" 
            data={leaderboardData.leetcode}
            platform="LeetCode" 
          />
        )}
         {leaderboardData.github && leaderboardData.github.length > 0 && (
          <StatsCard 
            title="Top GitHub Performers (Weekly)" 
            data={leaderboardData.github}
            platform="GitHub"
          />
        )}
      </div>
       {(!leaderboardData.leetcode || leaderboardData.leetcode.length === 0) &&
         (!leaderboardData.github || leaderboardData.github.length === 0) && (
        <div className="text-center p-10 bg-white shadow rounded-lg mt-6">
            No top performer data found for this week.
        </div>
      )}
    </div>
  );
};

export default Dashboard;