import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  // Navigation items
  const navItems = [
    { to: '/', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { to: '/handlers', label: 'My Handlers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { to: '/add-handler', label: 'Add Handler', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
    // { to: '/leaderboard', label: 'Leaderboard', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
    { to: '/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen flex flex-col">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Skill-Peak</h2>
        <nav>
          <ul>
            {navItems.map((item, index) => (
              <li key={index} className="mb-2">
                <NavLink 
                  to={item.to} 
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg transition duration-200 ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`
                  }
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                  </svg>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mt-auto p-4 border-t border-gray-700">
        <div className="flex items-center justify-center">
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Skill-Peak
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;