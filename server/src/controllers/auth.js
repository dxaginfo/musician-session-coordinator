const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { email, password, user_type, first_name, last_name, bio, location, hourly_rate } = req.body;
    
    // Check if user with email already exists
    const existingUser = await User.query().findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }
    
    // Hash password
    const password_hash = await User.hashPassword(password);
    
    // Create new user
    const newUser = await User.query().insert({
      email,
      password_hash,
      user_type,
      first_name,
      last_name,
      bio: bio || null,
      location: location || null,
      hourly_rate: hourly_rate || null
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, userType: newUser.user_type },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // If user is a musician, create musician profile
    if (user_type === 'musician') {
      await newUser.$relatedQuery('musicianProfile').insert({
        years_experience: req.body.years_experience || 0,
        studio_experience: req.body.studio_experience || false,
        remote_recording_capability: req.body.remote_recording_capability || false,
        portfolio_url: req.body.portfolio_url || null
      });
    }
    
    // Remove password hash from response
    delete newUser.password_hash;
    
    logger.info(`New user registered: ${newUser.email} (${newUser.user_type})`);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
      token
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    next(error);
  }
};

// Login existing user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.query().findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Verify password
    const isValid = await user.verifyPassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Remove password hash from response
    delete user.password_hash;
    
    logger.info(`User logged in: ${user.email}`);
    
    res.status(200).json({
      message: 'Login successful',
      user,
      token
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    next(error);
  }
};

// Get current user profile
exports.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.query()
      .findById(userId)
      .withGraphFetched('[musicianProfile]');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove password hash from response
    delete user.password_hash;
    
    res.status(200).json({ user });
  } catch (error) {
    logger.error(`Get current user error: ${error.message}`);
    next(error);
  }
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.query().findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isValid = await user.verifyPassword(currentPassword);
    if (!isValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const password_hash = await User.hashPassword(newPassword);
    
    // Update password
    await User.query().findById(userId).patch({ password_hash });
    
    logger.info(`Password changed for user: ${user.email}`);
    
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    logger.error(`Change password error: ${error.message}`);
    next(error);
  }
};