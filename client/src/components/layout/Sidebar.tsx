import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  MusicNote as MusicNoteIcon,
  Event as EventIcon,
  CalendarMonth as CalendarIcon,
  Message as MessageIcon,
  Payment as PaymentIcon,
  ChevronLeft as ChevronLeftIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/authSlice';

const DRAWER_WIDTH = 240;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const user = useSelector(selectUser);
  
  // Close drawer when route changes on mobile
  React.useEffect(() => {
    if (isMobile && open) {
      onClose();
    }
  }, [location.pathname, isMobile, open, onClose]);
  
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Projects', icon: <AssignmentIcon />, path: '/projects' },
    { text: 'Musicians', icon: <MusicNoteIcon />, path: '/musicians' },
    { text: 'Sessions', icon: <EventIcon />, path: '/sessions' },
    { text: 'Calendar', icon: <CalendarIcon />, path: '/calendar' },
    { text: 'Messages', icon: <MessageIcon />, path: '/messages' },
    { text: 'Payments', icon: <PaymentIcon />, path: '/payments' },
  ];
  
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  const drawer = (
    <div>
      <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        {isMobile && (
          <IconButton onClick={onClose}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={isActive(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.12)',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path)
                    ? theme.palette.primary.main
                    : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );
  
  return (
    <Box
      component="nav"
      sx={{ width: { md: open ? DRAWER_WIDTH : 0 }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        /* Desktop drawer */
        <Drawer
          variant="persistent"
          open={open}
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;