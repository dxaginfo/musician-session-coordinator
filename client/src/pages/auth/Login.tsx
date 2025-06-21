import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

import { login, selectAuthLoading, selectAuthError, clearError } from '../../store/authSlice';
import { showNotification } from '../../store/uiSlice';
import { AppDispatch } from '../../store';

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
  });
  
  // Handle redirect message from registration
  useEffect(() => {
    const message = location.state?.message;
    if (message) {
      dispatch(showNotification({
        message,
        type: 'success',
      }));
      
      // Clear the message from location state
      navigate(location.pathname, { replace: true });
    }
  }, [location, dispatch, navigate]);
  
  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);
  
  // Form validation
  const validateForm = () => {
    let valid = true;
    const errors = {
      email: '',
      password: '',
    };
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      valid = false;
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
      valid = false;
    }
    
    setValidationErrors(errors);
    return valid;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear validation error when user types
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Dispatch login action
    const result = await dispatch(login({
      email: formData.email,
      password: formData.password,
    }));
    
    if (login.fulfilled.match(result)) {
      dispatch(showNotification({
        message: 'Login successful!',
        type: 'success',
      }));
      navigate('/dashboard');
    }
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Log In
      </Typography>
      
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
        Welcome back! Log in to manage your sessions and projects.
      </Typography>
      
      {/* Error message */}
      {error && (
        <Typography 
          variant="body2" 
          color="error" 
          align="center" 
          sx={{ mb: 2, p: 1, bgcolor: 'error.light', borderRadius: 1 }}
        >
          {error}
        </Typography>
      )}
      
      {/* Email field */}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={formData.email}
        onChange={handleChange}
        error={Boolean(validationErrors.email)}
        helperText={validationErrors.email}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />
      
      {/* Password field */}
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
        error={Boolean(validationErrors.password)}
        helperText={validationErrors.password}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleTogglePasswordVisibility}
                edge="end"
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />
      
      {/* Forgot password link */}
      <Box sx={{ textAlign: 'right', mb: 2 }}>
        <Link component={RouterLink} to="/forgot-password" variant="body2">
          Forgot password?
        </Link>
      </Box>
      
      {/* Submit button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        size="large"
        disabled={loading}
        sx={{ mb: 3 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
      </Button>
      
      <Divider sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          OR
        </Typography>
      </Divider>
      
      {/* Sign up link */}
      <Typography variant="body1" align="center">
        Don't have an account?{' '}
        <Link component={RouterLink} to="/register" variant="body1" fontWeight="bold">
          Sign Up
        </Link>
      </Typography>
    </Box>
  );
};

export default Login;