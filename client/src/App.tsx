import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';

// Theme
import theme from './theme';

// Auth
import { selectAuth } from './store/authSlice';

// Layout components
import Layout from './components/layout/Layout';
import AuthLayout from './components/layout/AuthLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProjectList from './pages/projects/ProjectList';
import ProjectCreate from './pages/projects/ProjectCreate';
import ProjectDetails from './pages/projects/ProjectDetails';
import MusicianSearch from './pages/musicians/MusicianSearch';
import MusicianProfile from './pages/musicians/MusicianProfile';
import SessionList from './pages/sessions/SessionList';
import SessionDetails from './pages/sessions/SessionDetails';
import SchedulerCalendar from './pages/scheduler/SchedulerCalendar';
import Messages from './pages/messages/Messages';
import Conversation from './pages/messages/Conversation';
import PaymentHistory from './pages/payments/PaymentHistory';
import NotFound from './pages/NotFound';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector(selectAuth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const { isAuthenticated, user } = useSelector(selectAuth);
  const dispatch = useDispatch();
  
  // Socket.io connection setup
  useEffect(() => {
    if (isAuthenticated && user) {
      const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
      
      // Connect and join user's room
      socket.on('connect', () => {
        socket.emit('join', user.id);
      });
      
      // Handle incoming messages
      socket.on('private-message', (data) => {
        // TODO: Dispatch message received action
      });
      
      // Handle typing indicators
      socket.on('typing', (data) => {
        // TODO: Dispatch typing indicator action
      });
      
      return () => {
        socket.disconnect();
      };
    }
  }, [isAuthenticated, user, dispatch]);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public routes with auth layout */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          
          {/* Public home page */}
          <Route path="/" element={<Home />} />
          
          {/* Protected routes with main layout */}
          <Route element={<Layout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            
            {/* Project routes */}
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <ProjectList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/create"
              element={
                <ProtectedRoute>
                  <ProjectCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute>
                  <ProjectDetails />
                </ProtectedRoute>
              }
            />
            
            {/* Musician routes */}
            <Route
              path="/musicians"
              element={
                <ProtectedRoute>
                  <MusicianSearch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/musicians/:id"
              element={
                <ProtectedRoute>
                  <MusicianProfile />
                </ProtectedRoute>
              }
            />
            
            {/* Session routes */}
            <Route
              path="/sessions"
              element={
                <ProtectedRoute>
                  <SessionList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sessions/:id"
              element={
                <ProtectedRoute>
                  <SessionDetails />
                </ProtectedRoute>
              }
            />
            
            {/* Scheduler */}
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <SchedulerCalendar />
                </ProtectedRoute>
              }
            />
            
            {/* Messages */}
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages/:userId"
              element={
                <ProtectedRoute>
                  <Conversation />
                </ProtectedRoute>
              }
            />
            
            {/* Payments */}
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <PaymentHistory />
                </ProtectedRoute>
              }
            />
          </Route>
          
          {/* 404 Not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;