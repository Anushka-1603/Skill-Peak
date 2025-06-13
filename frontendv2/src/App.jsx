import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
// Layout
import Layout from './components/Layout/Layout';
// Pages
import Login from './components/Authentication/Login';
import Register from './components/Authentication/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Leaderboard from './components/Leaderboard/Leaderboard';
import Profile from './components/Profile/Profile';
import HandlerList from './components/Handlers/HandlerList';
import AddHandler from './components/Handlers/AddHandler';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext); // Use context

  if (loading) {
    // You can replace this with a more sophisticated loading spinner
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <>
    <AuthProvider> {/* AuthProvider wraps everything */}
      <Router>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/handlers" element={
            <ProtectedRoute>
              <Layout>
                <HandlerList />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/add-handler" element={
            <ProtectedRoute>
              <Layout>
                <AddHandler />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/weekly-report" element={ // New Route
            <ProtectedRoute>
              <Layout>
                <Leaderboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Redirect any other route to dashboard if authenticated, else to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
    </>
  );
}

export default App;