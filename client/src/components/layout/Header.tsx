import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Link,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

import { selectAuth, logout } from '../../store/authSlice';
import { selectDarkMode, toggleDarkMode } from '../../store/uiSlice';

interface HeaderProps {
  onDrawerToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(selectAuth);
  const darkMode = useSelector(selectDarkMode);
  
  // Profile menu
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const profileMenuOpen = Boolean(profileAnchorEl);
  
  // Notifications menu
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const notificationsMenuOpen = Boolean(notificationsAnchorEl);
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };
  
  const handleNotificationsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };
  
  const handleNotificationsMenuClose = () => {
    setNotificationsAnchorEl(null);
  };
  
  const handleLogout = () => {
    dispatch(logout());
    handleProfileMenuClose();
  };
  
  const handleThemeToggle = () => {
    dispatch(toggleDarkMode());
  };
  
  return (
    <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {isAuthenticated && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'white',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            component="img"
            sx={{ height: 32, mr: 1 }}
            alt="Logo"
            src="/logo.png"
          />
          {!isMobile && 'Session Coordinator'}
        </Typography>
        
        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
              <IconButton color="inherit" onClick={handleThemeToggle} size="large">
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Messages">
              <IconButton
                color="inherit"
                component={RouterLink}
                to="/messages"
                size="large"
              >
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                onClick={handleNotificationsMenuOpen}
                size="large"
              >
                <Badge badgeContent={2} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Account">
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={profileMenuOpen ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={profileMenuOpen ? 'true' : undefined}
              >
                <Avatar
                  alt={user?.first_name}
                  src={user?.profile_image_url}
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
            <Button
              variant="contained"
              color="secondary"
              component={RouterLink}
              to="/register"
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
      
      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchorEl}
        id="account-menu"
        open={profileMenuOpen}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem component={RouterLink} to="/profile">
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          My Profile
        </MenuItem>
        <MenuItem component={RouterLink} to="/settings">
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      
      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        id="notifications-menu"
        open={notificationsMenuOpen}
        onClose={handleNotificationsMenuClose}
        onClick={handleNotificationsMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            width: 320,
            maxHeight: 400,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <Divider />
        <MenuItem>
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle2">New session invitation</Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              You've been invited to a recording session by John Doe
            </Typography>
            <Typography variant="caption" color="text.secondary">
              2 hours ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle2">Payment received</Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              You received a payment of $150 for the Jazz Trio project
            </Typography>
            <Typography variant="caption" color="text.secondary">
              1 day ago
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
          <Link component={RouterLink} to="/notifications" underline="none">
            See all notifications
          </Link>
        </Box>
      </Menu>
    </AppBar>
  );
};

export default Header;