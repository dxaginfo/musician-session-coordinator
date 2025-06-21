import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  CircularProgress,
  Autocomplete,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  AccessTime as AccessTimeIcon,
  Description as DescriptionIcon,
  PersonAdd as PersonAddIcon,
  MusicNote as MusicNoteIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useSelector } from 'react-redux';
import { format, addHours } from 'date-fns';

import { selectUser } from '../../store/authSlice';
import { useCreateSessionMutation, useGetMusiciansQuery } from '../../store/services/api';
import { showNotification } from '../../store/uiSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';

interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role?: string;
}

const CreateSession: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  
  // Session state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date(Date.now() + 3600000), // Default to 1 hour from now
    duration: 120, // Default to 2 hours
    location: '',
    status: 'pending',
  });
  
  // Participants state
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [participantRole, setParticipantRole] = useState('');
  
  // Validation errors
  const [errors, setErrors] = useState({
    title: '',
    date: '',
    duration: '',
    location: '',
  });
  
  // RTK Query hooks
  const { data: musicians, isLoading: isLoadingMusicians } = useGetMusiciansQuery();
  const [createSession, { isLoading: isCreating, error: createError }] = useCreateSessionMutation();
  
  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      title: '',
      date: '',
      duration: '',
      location: '',
    };
    
    if (!formData.title.trim()) {
      newErrors.title = 'Session title is required';
      isValid = false;
    }
    
    if (!formData.date) {
      newErrors.date = 'Date and time are required';
      isValid = false;
    } else if (formData.date < new Date()) {
      newErrors.date = 'Session date must be in the future';
      isValid = false;
    }
    
    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
      isValid = false;
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
    
    // Clear error when user types
    if (name && errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  // Handle date change
  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setFormData((prev) => ({
        ...prev,
        date: newDate,
      }));
      
      // Clear error
      setErrors((prev) => ({
        ...prev,
        date: '',
      }));
    }
  };
  
  // Handle adding a participant
  const handleAddParticipant = () => {
    if (selectedParticipant && !participants.some(p => p.id === selectedParticipant.id)) {
      const newParticipant = {
        ...selectedParticipant,
        role: participantRole,
      };
      
      setParticipants([...participants, newParticipant]);
      setSelectedParticipant(null);
      setParticipantRole('');
    }
  };
  
  // Handle removing a participant
  const handleRemoveParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Prepare participant data
      const participantData = participants.map(p => ({
        user_id: p.id,
        role: p.role || undefined,
        status: 'pending',
      }));
      
      // Create session
      const result = await createSession({
        ...formData,
        host_id: user?.id,
        participants: participantData,
      }).unwrap();
      
      dispatch(showNotification({
        message: 'Session created successfully!',
        type: 'success',
      }));
      
      navigate(`/sessions/${result.id}`);
    } catch (error) {
      console.error('Error creating session:', error);
      dispatch(showNotification({
        message: 'Failed to create session. Please try again.',
        type: 'error',
      }));
    }
  };
  
  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/sessions')}
          sx={{ mb: 2 }}
        >
          Back to Sessions
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Session
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Schedule a new recording session and invite musicians
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Session Details
          </Typography>
          
          <Grid container spacing={3}>
            {/* Session Title */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="title"
                name="title"
                label="Session Title"
                value={formData.title}
                onChange={handleChange}
                error={Boolean(errors.title)}
                helperText={errors.title}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            {/* Date and Duration */}
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Date & Time"
                  value={formData.date}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: Boolean(errors.date),
                      helperText: errors.date,
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EventIcon />
                          </InputAdornment>
                        ),
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                id="duration"
                name="duration"
                label="Duration (minutes)"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                error={Boolean(errors.duration)}
                helperText={errors.duration}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            {/* Location */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="location"
                name="location"
                label="Location"
                value={formData.location}
                onChange={handleChange}
                error={Boolean(errors.location)}
                helperText={errors.location || "Studio name, address, or 'Remote' for virtual sessions"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4 }} />
          
          <Typography variant="h6" gutterBottom>
            Invite Participants
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Autocomplete
                id="participant-select"
                options={musicians || []}
                loading={isLoadingMusicians}
                getOptionLabel={(option) => `${option.first_name} ${option.last_name} (${option.email})`}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={selectedParticipant}
                onChange={(event, newValue) => {
                  setSelectedParticipant(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Musician"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <MusicNoteIcon />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                id="role"
                name="role"
                label="Role (optional)"
                value={participantRole}
                onChange={(e) => setParticipantRole(e.target.value)}
                placeholder="e.g., Guitarist, Vocalist, Producer"
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                startIcon={<PersonAddIcon />}
                onClick={handleAddParticipant}
                disabled={!selectedParticipant}
                sx={{ height: '56px' }}
              >
                Add
              </Button>
            </Grid>
            
            {/* Participant List */}
            <Grid item xs={12}>
              <Paper 
                variant="outlined" 
                sx={{
                  p: 2,
                  minHeight: '100px',
                  bgcolor: theme.palette.background.default,
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Participants ({participants.length})
                </Typography>
                
                {participants.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No participants added yet.
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {participants.map((participant) => (
                      <Chip
                        key={participant.id}
                        avatar={
                          <Avatar>
                            {participant.first_name.charAt(0)}
                            {participant.last_name.charAt(0)}
                          </Avatar>
                        }
                        label={`${participant.first_name} ${participant.last_name}${participant.role ? ` (${participant.role})` : ''}`}
                        onDelete={() => handleRemoveParticipant(participant.id)}
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<CancelIcon />}
              onClick={() => navigate('/sessions')}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              startIcon={isCreating ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create Session'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateSession;