import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';

import { getCurrentUser, selectIsAuthenticated, selectAuthLoading, selectAuth } from '../../store/authSlice';
import { AppDispatch } from '../../store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedUserTypes?: ('musician' | 'producer' | 'studio')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  allowedUserTypes,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { isAuthenticated, loading, user } = useSelector(selectAuth);
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAuthenticated && user) {
          // User is already authenticated and we have user data
          setIsChecking(false);
          return;
        }
        
        // Try to get current user if we have a token
        const token = localStorage.getItem('token');
        if (token) {
          await dispatch(getCurrentUser());
        }
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAuth();
  }, [dispatch, isAuthenticated, user]);
  
  // Show loading spinner while checking authentication
  if (isChecking || loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Checking authorization...
        </Typography>
      </Box>
    );
  }
  
  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Redirect to dashboard if user is authenticated but tries to access login/register pages
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Check if user has the required role/type
  if (requireAuth && isAuthenticated && user && allowedUserTypes) {
    if (!allowedUserTypes.includes(user.user_type)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // If all checks pass, render the children
  return <>{children}</>;
};

export default ProtectedRoute;