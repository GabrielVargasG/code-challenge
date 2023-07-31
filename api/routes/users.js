// Import necessary modules
import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// Create an instance of the Express Router
var router = express.Router();

// Initialize Lowdb with a JSONFile adapter and read the data
const adapter = new JSONFile('./data/users.json');
const db = new Low(adapter, {})
await db.read();

// Handle user login
router.post('/login', (req, res) => {
  // Extract email and password from the request body
  const { email, password } = req.body;

  // Find the user with the given email in the database
  const user = db.data.users.find((user) => user.email === email);
  if (!user) {
    // If user not found, return an error response
    return res.status(404).json({ error: 'User not found' });
  }

  // Check if the provided password matches the user's password in the database
  if (!(password == user.password)) {
    // If passwords don't match, return an error response
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Set the authenticated user in the session and return user details in the response
  req.session.user = user;
  return res.json(user);
});

// Retrieve the current user's details
router.get('/me', (req, res) => {
  if (!req.session.user) {
    // If user is not authenticated, return an error response
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Return the user details from the session in the response
  return res.json(req.session.user);
});

// Handle user logout
router.post('/logout', (req, res) => {
  // Clear the user from the session and return a success message in the response
  req.session.user = null;
  return res.json({ message: 'Logout successful' });
});

// Get the user's balance
router.get('/balance', (req, res) => {
  if (!req.session.user) {
    // If user is not authenticated, return an error response
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Retrieve the balance of the authenticated user from the database
  const balance = db.get('users').find({ email: req.session.user.email }).get('balance').value();

  // Return the balance in the response
  return res.json({ balance });
});

// Update user details
router.patch('/update', async (req, res) => {
  if (!req.session.user) {
    // If user is not authenticated, return an error response
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Find the index of the authenticated user in the database
  const userIndex = db.data.users.findIndex((user) => user._id == req.session.user._id);

  if (userIndex !== undefined) {
    // If user exists in the database, update the user details
    db.data.users[userIndex] = { ...db.data.users[userIndex], ...req.body };
    await db.write();

    // Update the user details in the session and return a success message in the response
    req.session.user = { ...req.session.user, ...req.body };
    return res.json({ message: 'User details updated successfully' });
  }

  // If user does not exist, return an error response
  return res.status(404).json({ error: 'User not found' });
});

// Export the Express Router instance
export default router;
