require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Make sure to require cors
const auth = require('./middleware/auth');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));



// CORS configuration based on the environment
if (process.env.NODE_ENV === 'production') {
  // Production-specific logic
  app.use(express.static('build'));
  // app.use(cors({ credentials: true, origin: 'https://austinaguirre.github.io/personalsite'}));
  app.use(cors({ credentials: true, origin: 'https://austinaguirre.github.io'}));

} else {
  // Development-specific logic
  // app.use(cors({ credentials: true, origin: 'http://localhost:3000/personalsite' }));
  app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

}



// Define your routes
app.use('/api/users', require('./routes/users')); 
app.use('/api/events', require('./routes/events'));

// Define a test route for token verification using the app instance
app.get('/api/testToken', auth, (req, res) => {
  res.json({ msg: 'Token is valid', user: req.user });
});

app.get('/', (req, res) => {
  res.send('Hello from Node.js backend!');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
