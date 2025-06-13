// import React, { useState, useEffect } from 'react';
// import HandlerCard from './HandlerCard';
// import { fetchHandlers } from '../../services/handler.service';
// import { Button } from '../UI/Button';
// import { Alert } from '../UI/Alert';
// import AddHandler from './AddHandler';

// const HandlerList = () => {
//   const [handlers, setHandlers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showAddForm, setShowAddForm] = useState(false);

//   const loadHandlers = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchHandlers();
//       setHandlers(data);
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching handlers:', err);
//       setError('Failed to load handlers. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadHandlers();
//   }, []);

//   const handleAddSuccess = () => {
//     setShowAddForm(false);
//     loadHandlers();
//   };

//   if (loading && handlers.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="spinner-border text-primary" role="status">
//           <span className="sr-only">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold">Your Handlers</h2>
//         <Button 
//           variant="primary"
//           onClick={() => setShowAddForm(!showAddForm)}
//         >
//           {showAddForm ? 'Cancel' : 'Add New Handler'}
//         </Button>
//       </div>

//       {error && <Alert type="error" message={error} />}

//       {showAddForm && (
//         <AddHandler onSuccess={handleAddSuccess} onCancel={() => setShowAddForm(false)} />
//       )}

//       {handlers.length === 0 && !loading ? (
//         <div className="bg-gray-50 rounded-lg p-6 text-center">
//           <p className="text-gray-500">You don't have any handlers yet. Create one to get started!</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {handlers.map(handler => (
//             <HandlerCard 
//               key={handler.id} 
//               handler={handler} 
//               onUpdate={loadHandlers} 
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default HandlerList;
// src/components/Handlers/HandlerList.jsx
import React, { useEffect, useState, useCallback } from 'react';
import API from '../../services/api';
import HandlerCard from './HandlerCard';
import { Link } from 'react-router-dom';
import StatsModal from './StatsModal'; // Import the modal

const HandlerList = () => {
  const [handlers, setHandlers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedHandlerForStats, setSelectedHandlerForStats] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchHandlers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await API.getUserHandlers();
      setHandlers(response.data);
    } catch (err) {
      console.error("Failed to load handlers:", err);
      setError('Failed to load your handlers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHandlers();
  }, [fetchHandlers]);

  const handleHandlerDeleted = (deletedHandlerDbId) => {
    setHandlers(prevHandlers => prevHandlers.filter(h => h.id !== deletedHandlerDbId));
  };

  const handleViewStats = (handler) => {
    setSelectedHandlerForStats(handler);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHandlerForStats(null);
  };

  if (loading) {
    return <div className="text-center p-10 font-semibold text-gray-600">Loading Your Handlers...</div>;
  }

  if (error) {
    return (
      <div className="m-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Handlers</h1>
        <Link 
          to="/add-handler" 
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-200 shadow hover:shadow-md w-full sm:w-auto text-center"
        >
          Add New Handler
        </Link>
      </div>

      {handlers.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-lg shadow">
          <p className="text-gray-600 text-lg mb-4">You haven't added any handlers yet.</p>
          <img src="/no-data.svg" alt="No handlers" className="mx-auto my-4 w-48 h-48 opacity-50" /> {/* Optional: Add an SVG/image */}
          <Link 
            to="/add-handler" 
            className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-5 rounded transition duration-200 shadow hover:shadow-md"
          >
            Add Your First Handler
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {handlers.map(handler => (
            <HandlerCard 
              key={handler.id} 
              handler={handler} 
              onDeleted={handleHandlerDeleted}
              onViewStats={handleViewStats}
            />
          ))}
        </div>
      )}
      
      <StatsModal 
        handler={selectedHandlerForStats} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </div>
  );
};

export default HandlerList;