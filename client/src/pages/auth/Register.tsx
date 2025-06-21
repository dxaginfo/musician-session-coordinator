import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
  Grid,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Divider,
} from '@mui/material';
import {
  Email as EmailIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  LocationOn as LocationIcon,
  MusicNote as MusicNoteIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

import { register, selectAuthLoading, selectAuthError, clearError } from '../../store/authSlice';
import { showNotification } from '../../store/uiSlice';
import { AppDispatch } from '../../store';

// Step titles
const steps = ['Account Details', 'Personal Information', 'Professional Details'];

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  // Stepper state
  const [activeStep, setActiveStep] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    user_type: 'musician',
    bio: '',
    location: '',
    hourly_rate: '',
    years_experience: '',
    studio_experience: false,
    remote_recording_capability: false,
    portfolio_url: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Validation errors
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    user_type: '',
    bio: '',
    location: '',
    hourly_rate: '',
    years_experience: '',
    portfolio_url: '',
  });
  
  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);
  
  // Form validation for each step
  const validateStep = (step: number): boolean => {
    let valid = true;
    const newErrors = { ...validationErrors };
    
    switch (step) {
      case 0:
        // Email validation
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
          valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
          valid = false;
        } else {
          newErrors.email = '';
        }
        
        // Password validation
        if (!formData.password) {
          newErrors.password = 'Password is required';
          valid = false;
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
          valid = false;
        } else {
          newErrors.password = '';
        }
        
        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
          valid = false;
        } else {
          newErrors.confirmPassword = '';
        }
        break;
        
      case 1:
        // First name validation
        if (!formData.first_name.trim()) {
          newErrors.first_name = 'First name is required';
          valid = false;
        } else {
          newErrors.first_name = '';
        }
        
        // Last name validation
        if (!formData.last_name.trim()) {
          newErrors.last_name = 'Last name is required';
          valid = false;
        } else {
          newErrors.last_name = '';
        }
        
        // Location validation - optional
        break;
        
      case 2:
        // User type validation
        if (!formData.user_type) {
          newErrors.user_type = 'Please select a user type';
          valid = false;
        } else {
          newErrors.user_type = '';
        }
        
        // Hourly rate validation - should be a number if provided
        if (formData.hourly_rate && isNaN(Number(formData.hourly_rate))) {
          newErrors.hourly_rate = 'Hourly rate must be a number';
          valid = false;
        } else {
          newErrors.hourly_rate = '';
        }
        
        // Years experience validation - should be a number if provided
        if (
          formData.years_experience && 
          (isNaN(Number(formData.years_experience)) || Number(formData.years_experience) < 0)
        ) {
          newErrors.years_experience = 'Years of experience must be a positive number';
          valid = false;
        } else {
          newErrors.years_experience = '';
        }
        
        // Portfolio URL validation - should be a valid URL if provided
        if (
          formData.portfolio_url && 
          !/^https?:\/\/.+\..+/.test(formData.portfolio_url)
        ) {
          newErrors.portfolio_url = 'Please enter a valid URL (starting with http:// or https://)';
          valid = false;
        } else {
          newErrors.portfolio_url = '';
        }
        break;
    }
    
    setValidationErrors(newErrors);
    return valid;
  };
  
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name as string]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name as string]: value,
      }));
    }
    
    // Clear validation error when user types
    if (name && validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  
  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate final step
    if (!validateStep(activeStep)) {
      return;
    }
    
    // Prepare data for submission (omitting confirmPassword)
    const { confirmPassword, ...registerData } = formData;
    
    // Convert string values to numbers where needed
    const processedData = {
      ...registerData,
      hourly_rate: registerData.hourly_rate ? Number(registerData.hourly_rate) : undefined,
      years_experience: registerData.years_experience ? Number(registerData.years_experience) : undefined,
    };
    
    // Dispatch register action
    const result = await dispatch(register(processedData));
    
    if (register.fulfilled.match(result)) {
      dispatch(showNotification({
        message: 'Registration successful! Welcome aboard.',
        type: 'success',
      }));
      navigate('/dashboard');
    }
  };
  
  // Render different form steps
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
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
              autoComplete="new-password"
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
            />
            
            {/* Confirm Password field */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={Boolean(validationErrors.confirmPassword)}
              helperText={validationErrors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleToggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </>
        );
        
      case 1:
        return (
          <>
            <Grid container spacing={2}>
              {/* First Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="first_name"
                  label="First Name"
                  name="first_name"
                  autoComplete="given-name"
                  value={formData.first_name}
                  onChange={handleChange}
                  error={Boolean(validationErrors.first_name)}
                  helperText={validationErrors.first_name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              {/* Last Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="last_name"
                  label="Last Name"
                  name="last_name"
                  autoComplete="family-name"
                  value={formData.last_name}
                  onChange={handleChange}
                  error={Boolean(validationErrors.last_name)}
                  helperText={validationErrors.last_name}
                />
              </Grid>
            </Grid>
            
            {/* Location */}
            <TextField
              margin="normal"
              fullWidth
              id="location"
              label="Location (City, Country)"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={Boolean(validationErrors.location)}
              helperText={validationErrors.location}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            {/* Bio */}
            <TextField
              margin="normal"
              fullWidth
              id="bio"
              label="Bio"
              name="bio"
              multiline
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              error={Boolean(validationErrors.bio)}
              helperText={validationErrors.bio}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon />
                  </InputAdornment>
                ),
              }}
            />
          </>
        );
        
      case 2:
        return (
          <>
            {/* User Type */}
            <FormControl 
              fullWidth 
              margin="normal"
              required
              error={Boolean(validationErrors.user_type)}
            >
              <InputLabel id="user-type-label">I am a</InputLabel>
              <Select
                labelId="user-type-label"
                id="user_type"
                name="user_type"
                value={formData.user_type}
                onChange={handleChange}
                startAdornment={
                  <InputAdornment position="start">
                    <MusicNoteIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="musician">Musician</MenuItem>
                <MenuItem value="producer">Producer</MenuItem>
                <MenuItem value="studio">Studio Owner</MenuItem>
              </Select>
              {validationErrors.user_type && (
                <FormHelperText error>{validationErrors.user_type}</FormHelperText>
              )}
            </FormControl>
            
            {/* Hourly Rate */}
            <TextField
              margin="normal"
              fullWidth
              id="hourly_rate"
              label="Hourly Rate ($)"
              name="hourly_rate"
              type="number"
              value={formData.hourly_rate}
              onChange={handleChange}
              error={Boolean(validationErrors.hourly_rate)}
              helperText={validationErrors.hourly_rate}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MoneyIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            {formData.user_type === 'musician' && (
              <>
                {/* Years Experience */}
                <TextField
                  margin="normal"
                  fullWidth
                  id="years_experience"
                  label="Years of Experience"
                  name="years_experience"
                  type="number"
                  value={formData.years_experience}
                  onChange={handleChange}
                  error={Boolean(validationErrors.years_experience)}
                  helperText={validationErrors.years_experience}
                />
                
                {/* Studio Experience */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.studio_experience}
                      onChange={handleChange}
                      name="studio_experience"
                      color="primary"
                    />
                  }
                  label="I have professional studio recording experience"
                  sx={{ mt: 1, mb: 1 }}
                />
                
                {/* Remote Recording Capability */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.remote_recording_capability}
                      onChange={handleChange}
                      name="remote_recording_capability"
                      color="primary"
                    />
                  }
                  label="I have remote recording capabilities"
                  sx={{ mt: 1, mb: 2 }}
                />
              </>
            )}
            
            {/* Portfolio URL */}
            <TextField
              margin="normal"
              fullWidth
              id="portfolio_url"
              label="Portfolio URL"
              name="portfolio_url"
              placeholder="https://your-portfolio.com"
              value={formData.portfolio_url}
              onChange={handleChange}
              error={Boolean(validationErrors.portfolio_url)}
              helperText={validationErrors.portfolio_url || "Optional: Link to your portfolio, SoundCloud, or website"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon />
                  </InputAdornment>
                ),
              }}
            />
          </>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Create an Account
      </Typography>
      
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
        Join our community of musicians, producers and studio owners.
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
      
      {/* Stepper */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Box component="form" onSubmit={activeStep === steps.length - 1 ? handleSubmit : handleNext} noValidate>
        {renderStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="outlined"
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>
          ) : (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
      
      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" color="text.secondary">
          OR
        </Typography>
      </Divider>
      
      {/* Sign in link */}
      <Typography variant="body1" align="center">
        Already have an account?{' '}
        <Link component={RouterLink} to="/login" variant="body1" fontWeight="bold">
          Log In
        </Link>
      </Typography>
    </Box>
  );
};

export default Register;