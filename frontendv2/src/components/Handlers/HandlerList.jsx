import React, { useEffect, useState, useCallback } from 'react';
import API from '../../services/api';
import HandlerCard from './HandlerCard';
import { Link } from 'react-router-dom';
import StatsModal from './StatsModal';
import { FaGithub, FaCode } from 'react-icons/fa'; 

const HandlerList = () => {
  const [handlers, setHandlers] = useState([]);
  const [leetcodeHandlers, setLeetcodeHandlers] = useState([]);
  const [githubHandlers, setGithubHandlers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedHandlerForStats, setSelectedHandlerForStats] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchHandlers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await API.getUserHandlers();
      const fetchHandlers = response.data || [];

      setHandlers(fetchHandlers)

      // seperate handlers by platform
      setLeetcodeHandlers(fetchHandlers.filter(h => h.platform === 'LC'));
      setGithubHandlers(fetchHandlers.filter(h => h.platform === 'GH'));

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
    const updatedHandlers = handlers.filter(h => h.id !== deletedHandlerDbId);
    setHandlers(updatedHandlers);
    setLeetcodeHandlers(updatedHandlers.filter(h => h.platform === 'LC'));
    setGithubHandlers(updatedHandlers.filter(h => h.platform === 'GH'));
  };

  const handleViewStats = (handler) => {
    setSelectedHandlerForStats(handler);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHandlerForStats(null);
  };

  // This function now just renders the list of cards for a given platform
  // The section titles will be outside the two-column layout for each platform.
  const renderHandlerCards = (handlersForPlatform) => {
    if (handlersForPlatform.length === 0) {
      return (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500 h-full flex items-center justify-center">
          {/* Adjusted message for context within a column */}
          <p>No handlers added for this platform yet.</p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {handlersForPlatform.map(handler => (
          <HandlerCard 
            key={handler.id} 
            handler={handler} 
            onDeleted={handleHandlerDeleted}
            onViewStats={handleViewStats}
          />
        ))}
      </div>
    );
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
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Column: LeetCode Handlers */}
          <div className="lg:w-1/2">
            <h2 className="text-2xl font-bold text-gray-700 mb-5 flex items-center">
              <FaCode className="text-yellow-500 text-3xl" />
              <span className="ml-3">LeetCode Handlers</span>
            </h2>
            {renderHandlerCards(leetcodeHandlers)}
          </div>

          {/* Right Column: GitHub Handlers */}
          <div className="lg:w-1/2">
            <h2 className="text-2xl font-bold text-gray-700 mb-5 flex items-center">
              <FaGithub className="text-gray-700 text-3xl" />
              <span className="ml-3">GitHub Handlers</span>
            </h2>
            {renderHandlerCards(githubHandlers)}
          </div>
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