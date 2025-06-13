// import React from 'react';
// import { Link } from 'react-router-dom';

// const StatsCard = ({ title, value, icon, linkTo, linkText }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-medium text-gray-900">{title}</h3>
//         {icon}
//       </div>
//       <p className="text-3xl font-bold text-gray-900 mb-4">{value}</p>
//       {linkTo && linkText && (
//         <Link to={linkTo} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
//           {linkText} →
//         </Link>
//       )}
//     </div>
//   );
// };

// export default StatsCard;
// src/components/Dashboard/StatsCard.jsx
import React from 'react';

const StatsCard = ({ title, data, platform }) => {
  // Ensure data and handlerid are present
  const MappedData = ({ item }) => {
    let handlerName = 'Unknown Handler';
    let value = 0;

    if (item && item.handlerid && item.handlerid.handlername) {
      handlerName = item.handlerid.handlername;
    }
    
    if (platform === 'LeetCode' && typeof item.submissions === 'number') {
      value = item.submissions;
    } else if (platform === 'GitHub' && typeof item.contributions === 'number') {
      value = item.contributions;
    }
    
    return (
      <li className="truncate">
        <span className="font-medium">{handlerName}</span>:
        {platform === 'LeetCode' && ` ${value} submissions`}
        {platform === 'GitHub' && ` ${value} contributions`}
      </li>
    );
  };
  
  if (!data || data.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-3">{title}</h3>
        <p className="text-gray-500">No data available for {platform}.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-700 mb-3">{title}</h3>
      <ol className="list-decimal list-inside text-gray-600 space-y-2">
        {data.map((item, index) => (
          // The backend returns IndividualStats which has a handlerid foreign key.
          // The serializer for IndividualStats includes the nested UserHandler object.
          // So item.handlerid should be an object {handlername: "...", ...}
          <MappedData item={item} key={item.id || index} />
        ))}
      </ol>
    </div>
  );
};

export default StatsCard;