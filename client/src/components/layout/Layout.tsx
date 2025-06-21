import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, useMediaQuery, useTheme } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import { selectSidebarOpen, setSidebarOpen } from '../../store/uiSlice';
import Header from './Header';
import Sidebar from './Sidebar';
import Notification from '../common/Notification';

const Layout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const sidebarOpen = useSelector(selectSidebarOpen);
  const dispatch = useDispatch();

  // Close sidebar when screen size becomes mobile
  React.useEffect(() => {
    if (isMobile) {
      dispatch(setSidebarOpen(false));
    } else {
      dispatch(setSidebarOpen(true));
    }
  }, [isMobile, dispatch]);

  const handleDrawerToggle = () => {
    dispatch(setSidebarOpen(!sidebarOpen));
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      <Header onDrawerToggle={handleDrawerToggle} />
      <Sidebar open={sidebarOpen} onClose={handleDrawerToggle} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          padding: theme.spacing(3),
          paddingTop: { xs: `calc(${theme.spacing(3)} + 56px)`, sm: `calc(${theme.spacing(3)} + 64px)` },
          maxWidth: '100vw',
          overflow: 'hidden',
        }}
      >
        <Outlet />
      </Box>
      
      <Notification />
    </Box>
  );
};

export default Layout;