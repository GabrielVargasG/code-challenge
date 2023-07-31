// Import the 'app' module from the './api/index.js' file.
import app from './api/index.js';

// Define the port on which the server will listen.
const PORT = 3000;

// Start the server and listen on the specified port.
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
