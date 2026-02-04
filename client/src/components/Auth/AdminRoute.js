import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px',
        background: 'white',
        borderRadius: '12px',
        margin: '40px auto',
        maxWidth: '600px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <h2 style={{ color: '#e53e3e', marginBottom: '16px' }}>Access Denied</h2>
        <p style={{ color: '#4a5568', fontSize: '1.1rem' }}>
          You don't have permission to access this area. Admin privileges required.
        </p>
      </div>
    );
  }

  return children;
};

export default AdminRoute;