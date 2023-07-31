import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import usersRouter from './routes/users.js';

const app = express();

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

// Middleware to enable sessions with a secret key
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));

// Serve static files from the 'client' directory
app.use(express.static('client'));

// Mount the 'usersRouter' on the '/api' route
app.use('/api', usersRouter);

// Set the directory for views as 'client'
app.set('views', 'client');

// Set the view engine to use 'ejs' for rendering
app.set('view engine', 'ejs');

// Route to render the dashboard view
app.get('/dashboard', (req, res) => {
  // Check if a user is logged in using the session
  if (req.session.user != null) {
    const user = req.session.user;
    // Render the 'dashboard' view and pass the 'user' object to it
    res.render('dashboard', { user });
  } else {
    // If no user is logged in, redirect to the login page
    res.redirect('/login');
  }
});

// Route to render the login view
app.get('/login', (req, res) => {
  // Render the 'login' view
  res.render('login');
});

// Route to render the edit view
app.get('/edit', (req, res) => {
  // Check if a user is logged in using the session
  if (req.session.user != null) {
    const user = req.session.user;
    // Render the 'edit' view and pass the 'user' object to it
    res.render('edit', { user });
  } else {
    // If no user is logged in, redirect to the login page
    res.redirect('/login');
  }
});

// Route to render the balance view
app.get('/balance', (req, res) => {
  // Check if a user is logged in using the session
  if (req.session.user != null) {
    const user = req.session.user;
    // Render the 'balance' view and pass the 'user' object to it
    res.render('balance', { user });
  } else {
    // If no user is logged in, redirect to the login page
    res.redirect('/login');
  }
});

// Export the 'app' object as the default export of this module
export default app;
