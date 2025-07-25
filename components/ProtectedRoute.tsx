import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { SparklesIcon } from './icons';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
        <div className="flex flex-col gap-4 justify-center items-center h-[calc(100vh-200px)]">
            <SparklesIcon className="w-12 h-12 text-brand-accent animate-pulse" />
            <p className="text-slate-600 dark:text-slate-400">Securing connection...</p>
        </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;