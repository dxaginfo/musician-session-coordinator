import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, Container, Paper, useTheme, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../store/authSlice';

const AuthLayout: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        backgroundImage: 'url(/auth-background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <img src="/logo.png" alt="Logo" style={{ height: 60, marginBottom: 16 }} />
          </Box>
          
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;