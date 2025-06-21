import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useTheme,
  Avatar,
  Badge,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  CalendarMonth as CalendarIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
  MusicNote as MusicNoteIcon,
  Message as MessageIcon,
  MoreVert as MoreVertIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

import { selectUser } from '../store/authSlice';
import { useGetStatsQuery, useGetUpcomingSessionsQuery, useGetRecentPaymentsQuery } from '../store/services/api';

// Calendar display component
const CalendarView = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const currentYear = currentDate.getFullYear();
  
  // Get days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get the day of the week of the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Create array for the days to display
  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  
  // Day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })}{' '}
        {currentYear}
      </Typography>
      
      <Grid container spacing={1}>
        {/* Day names */}
        {dayNames.map((day) => (
          <Grid item xs={12/7} key={day}>
            <Typography
              variant="body2"
              align="center"
              fontWeight="bold"
            >
              {day}
            </Typography>
          </Grid>
        ))}
        
        {/* Calendar days */}
        {days.map((day, index) => (
          <Grid item xs={12/7} key={index}>
            {day ? (
              <Button
                variant={day === currentDay ? 'contained' : 'text'}
                color={day === currentDay ? 'primary' : 'inherit'}
                fullWidth
                sx={{
                  height: 40,
                  maxWidth: 40,
                  borderRadius: '50%',
                  margin: '0 auto',
                  display: 'flex',
                }}
              >
                {day}
              </Button>
            ) : (
              <Box sx={{ height: 40 }} />
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Custom tab panel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [tabValue, setTabValue] = useState(0);
  
  // Query hooks for data fetching
  const { data: stats, isLoading: isLoadingStats } = useGetStatsQuery();
  const { data: upcomingSessions, isLoading: isLoadingUpcomingSessions } = useGetUpcomingSessionsQuery();
  const { data: recentPayments, isLoading: isLoadingRecentPayments } = useGetRecentPaymentsQuery();
  
  // Mock data while we build the backend
  const mockStats = {
    totalSessions: 12,
    pendingInvitations: 3,
    upcomingSessions: 5,
    pendingPayments: 2,
    totalEarnings: 1250,
    completedSessions: 8,
  };
  
  const mockUpcomingSessions = [
    {
      id: '1',
      title: 'Jazz Trio Recording',
      date: '2025-06-22T14:00:00',
      location: 'Blue Note Studio',
      status: 'confirmed',
    },
    {
      id: '2',
      title: 'Vocal Tracking Session',
      date: '2025-06-24T10:00:00',
      location: 'Remote',
      status: 'confirmed',
    },
    {
      id: '3',
      title: 'Commercial Jingle',
      date: '2025-06-25T15:30:00',
      location: 'Redwood Studios',
      status: 'pending',
    },
  ];
  
  const mockRecentPayments = [
    {
      id: '1',
      amount: 350,
      date: '2025-06-15T09:22:00',
      projectName: 'Film Score Session',
      status: 'completed',
    },
    {
      id: '2',
      amount: 150,
      date: '2025-06-10T14:10:00',
      projectName: 'Album Recording',
      status: 'completed',
    },
  ];
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const statsData = stats || mockStats;
  const sessionsData = upcomingSessions || mockUpcomingSessions;
  const paymentsData = recentPayments || mockRecentPayments;
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.first_name || 'Musician'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's your latest activity and upcoming sessions
        </Typography>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Upcoming Sessions
              </Typography>
              <Typography variant="h3">
                {isLoadingStats ? <Skeleton width={40} /> : statsData.upcomingSessions}
              </Typography>
              <Button
                variant="text"
                size="small"
                endIcon={<ChevronRightIcon />}
                onClick={() => navigate('/sessions')}
                sx={{ mt: 1 }}
              >
                View All
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Pending Invites
              </Typography>
              <Typography variant="h3">
                {isLoadingStats ? <Skeleton width={40} /> : statsData.pendingInvitations}
              </Typography>
              <Button
                variant="text"
                size="small"
                endIcon={<ChevronRightIcon />}
                onClick={() => navigate('/invitations')}
                sx={{ mt: 1 }}
              >
                View All
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Completed Sessions
              </Typography>
              <Typography variant="h3">
                {isLoadingStats ? <Skeleton width={40} /> : statsData.completedSessions}
              </Typography>
              <Button
                variant="text"
                size="small"
                endIcon={<ChevronRightIcon />}
                onClick={() => navigate('/sessions?status=completed')}
                sx={{ mt: 1 }}
              >
                View All
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Earnings
              </Typography>
              <Typography variant="h3">
                {isLoadingStats ? <Skeleton width={80} /> : `$${statsData.totalEarnings}`}
              </Typography>
              <Button
                variant="text"
                size="small"
                endIcon={<ChevronRightIcon />}
                onClick={() => navigate('/payments')}
                sx={{ mt: 1 }}
              >
                View All
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        {/* Left column */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardHeader 
              title="Activity Feed" 
              action={
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="activity tabs">
                  <Tab label="Upcoming Sessions" />
                  <Tab label="Recent Payments" />
                </Tabs>
              }
            />
            <Divider />
            <CardContent>
              <TabPanel value={tabValue} index={0}>
                {isLoadingUpcomingSessions ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                  </Box>
                ) : sessionsData.length > 0 ? (
                  <List>
                    {sessionsData.map((session) => (
                      <ListItem
                        key={session.id}
                        disablePadding
                        secondaryAction={
                          <IconButton edge="end">
                            <MoreVertIcon />
                          </IconButton>
                        }
                      >
                        <ListItemButton onClick={() => navigate(`/sessions/${session.id}`)}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: session.status === 'pending' ? 'warning.main' : 'success.main' }}>
                              <EventIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={session.title}
                            secondary={
                              <>
                                <Typography component="span" variant="body2">
                                  {new Date(session.date).toLocaleDateString()} at{' '}
                                  {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2" color="text.secondary">
                                  {session.location} • {session.status === 'pending' ? 'Awaiting confirmation' : 'Confirmed'}
                                </Typography>
                              </>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      No upcoming sessions found
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      sx={{ mt: 2 }}
                      onClick={() => navigate('/sessions/new')}
                    >
                      Schedule a Session
                    </Button>
                  </Box>
                )}
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                {isLoadingRecentPayments ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                  </Box>
                ) : paymentsData.length > 0 ? (
                  <List>
                    {paymentsData.map((payment) => (
                      <ListItem
                        key={payment.id}
                        disablePadding
                        secondaryAction={
                          <IconButton edge="end">
                            <MoreVertIcon />
                          </IconButton>
                        }
                      >
                        <ListItemButton onClick={() => navigate(`/payments/${payment.id}`)}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'success.main' }}>
                              <PaymentIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={`$${payment.amount} - ${payment.projectName}`}
                            secondary={
                              <>
                                <Typography component="span" variant="body2">
                                  {new Date(payment.date).toLocaleDateString()}
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2" color="success.main">
                                  Payment completed
                                </Typography>
                              </>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      No recent payments found
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/payments')}
                      sx={{ mt: 2 }}
                    >
                      View Payment History
                    </Button>
                  </Box>
                )}
              </TabPanel>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader 
              title="Quick Actions" 
              titleTypographyProps={{ variant: 'h6' }}
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      borderRadius: 2,
                      cursor: 'pointer',
                      bgcolor: 'background.default',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                    onClick={() => navigate('/sessions/new')}
                  >
                    <Avatar
                      sx={{
                        bgcolor: 'primary.light',
                        mb: 1,
                        mx: 'auto',
                      }}
                    >
                      <EventIcon />
                    </Avatar>
                    <Typography variant="body2">New Session</Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      borderRadius: 2,
                      cursor: 'pointer',
                      bgcolor: 'background.default',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                    onClick={() => navigate('/musicians')}
                  >
                    <Avatar
                      sx={{
                        bgcolor: 'secondary.light',
                        mb: 1,
                        mx: 'auto',
                      }}
                    >
                      <MusicNoteIcon />
                    </Avatar>
                    <Typography variant="body2">Find Musicians</Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      borderRadius: 2,
                      cursor: 'pointer',
                      bgcolor: 'background.default',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                    onClick={() => navigate('/messages')}
                  >
                    <Avatar
                      sx={{
                        bgcolor: 'info.light',
                        mb: 1,
                        mx: 'auto',
                      }}
                    >
                      <MessageIcon />
                    </Avatar>
                    <Typography variant="body2">Messages</Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      borderRadius: 2,
                      cursor: 'pointer',
                      bgcolor: 'background.default',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                    onClick={() => navigate('/profile')}
                  >
                    <Avatar
                      sx={{
                        bgcolor: 'success.light',
                        mb: 1,
                        mx: 'auto',
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="body2">Edit Profile</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Right column */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardHeader 
              title="Calendar" 
              titleTypographyProps={{ variant: 'h6' }}
              action={
                <Tooltip title="View full calendar">
                  <IconButton onClick={() => navigate('/calendar')}>
                    <CalendarIcon />
                  </IconButton>
                </Tooltip>
              }
            />
            <Divider />
            <CardContent>
              <CalendarView />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader 
              title="Pending Invitations" 
              titleTypographyProps={{ variant: 'h6' }}
              action={
                <Button 
                  size="small" 
                  onClick={() => navigate('/invitations')}
                >
                  View All
                </Button>
              }
            />
            <Divider />
            <CardContent>
              {statsData.pendingInvitations > 0 ? (
                <List sx={{ p: 0 }}>
                  {Array.from({ length: Math.min(statsData.pendingInvitations, 3) }).map((_, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton onClick={() => navigate('/invitations')}>
                        <ListItemAvatar>
                          <Badge color="error" variant="dot">
                            <Avatar>
                              <EventIcon />
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`Session Invitation ${index + 1}`}
                          secondary="Tap to view details"
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No pending invitations
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;