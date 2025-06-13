// import React from 'react';
// import { Card } from '../UI/Card';
// import { Button } from '../UI/Button';
// import { useState } from 'react';
// import { updateHandler, deleteHandler } from '../../services/handler.service';

// const HandlerCard = ({ handler, onUpdate }) => {
//   const [editing, setEditing] = useState(false);
//   const [name, setName] = useState(handler.name);
//   const [description, setDescription] = useState(handler.description);
//   const [loading, setLoading] = useState(false);

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       await updateHandler(handler.id, { name, description });
//       setEditing(false);
//       onUpdate(); // Trigger parent component to refresh data
//     } catch (error) {
//       console.error('Failed to update handler:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (window.confirm('Are you sure you want to delete this handler?')) {
//       setLoading(true);
//       try {
//         await deleteHandler(handler.id);
//         onUpdate(); // Trigger parent component to refresh data
//       } catch (error) {
//         console.error('Failed to delete handler:', error);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <Card className="mb-4">
//       <div className="p-4">
//         {editing ? (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Name</label>
//               <input
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Description</label>
//               <textarea
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 rows="3"
//               />
//             </div>
//             <div className="flex justify-end space-x-2">
//               <Button
//                 variant="secondary"
//                 onClick={() => setEditing(false)}
//                 disabled={loading}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="primary"
//                 onClick={handleSave}
//                 loading={loading}
//               >
//                 Save
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="flex justify-between items-start">
//               <div>
//                 <h3 className="text-lg font-medium">{handler.name}</h3>
//                 <p className="text-gray-600 mt-1">{handler.description}</p>
//                 <div className="mt-2">
//                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                     Success Rate: {handler.successRate}%
//                   </span>
//                   <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                     Calls: {handler.totalCalls}
//                   </span>
//                 </div>
//               </div>
//               <div className="flex space-x-2">
//                 <Button
//                   variant="secondary"
//                   onClick={() => setEditing(true)}
//                   size="sm"
//                 >
//                   Edit
//                 </Button>
//                 <Button
//                   variant="danger"
//                   onClick={handleDelete}
//                   size="sm"
//                 >
//                   Delete
//                 </Button>
//               </div>
//             </div>
//             <div className="mt-4">
//               <div className="h-2 bg-gray-200 rounded-full">
//                 <div
//                   className="h-2 bg-green-500 rounded-full"
//                   style={{ width: `${handler.successRate}%` }}
//                 ></div>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </Card>
//   );
// };

// export default HandlerCard;
// src/components/Handlers/HandlerCard.jsx
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