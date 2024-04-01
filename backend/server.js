const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/restaurant')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile:String,
  password: String
});

// Define User model
const User = mongoose.model('user', userSchema); // Change model name to 'user'

app.use(bodyParser.json());

// Define route for user registration
app.post('/register', (req, res) => {
  const { name, email,mobile, password, reEnterPassword } = req.body;

  // Validate input
  if (!name || !email || !password ||!mobile || !reEnterPassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if passwords match
  if (password !== reEnterPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Check if user already exists
  User.findOne({ email })
    .then(user => {
      if (user) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Create new user
      const newUser = new User({ name, email, password });
      newUser.save()
        .then(() => res.json({ message: 'User registered successfully' }))
        .catch(err => res.status(500).json({ error: 'Failed to register user', details: err }));
    })
    .catch(err => res.status(500).json({ error: 'Server error', details: err }));
});

// Define route for user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Find user by email
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check password
      if (user.password !== password) {
        return res.status(401).json({ error: 'Incorrect password' });
      }

      // If user and password are correct, you can create a session or JWT token here
      // For example, you can use JSON Web Tokens (JWT) for authentication and session management

      // In this example, let's simply respond with a success message
      return res.json({ message: 'Login successful' });
    })
    .catch(err => res.status(500).json({ error: 'Server error', details: err }));
});

// Define schema for booking data
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  person: Number,
  date: Date,
  time: String,
  food: String,
  occasion: String
});

// Define model for booking data
const Booking = mongoose.model('Booking', bookingSchema);

// Define route to handle form submission
app.post('/book-table', (req, res) => {
  const { name, email, mobile, person, date, time, food, occasion } = req.body;

  // Validate input
  if (!name || !email || !mobile || !person || !date || !time || !food || !occasion) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Create new booking
  const newBooking = new Booking({ name, email, mobile, person, date, time, food, occasion });
  newBooking.save()
    .then(() => res.json({ message: 'Table booked successfully' }))
    .catch(err => res.status(500).json({ error: 'Failed to book table', details: err }));
});

// Define schema for message data
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String
});

// Define model for message data
const Message = mongoose.model('Message', messageSchema);

// Define route to handle form submission
app.post('/send-message', (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate input
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Create new message
  const newMessage = new Message({ name, email, subject, message });
  newMessage.save()
    .then(() => res.json({ message: 'Message sent successfully' }))
    .catch(err => res.status(500).json({ error: 'Failed to send message', details: err }));
});

// Define schema for feedback data
const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  waiterComplain: String,
  serviceRating: Number,
  cleanlinessRating: Number,
  suggestion: String
});

// Define model for feedback data
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Define route to handle form submission
app.post('/send-feedback', (req, res) => {
  const { name, email, waiterComplain, serviceRating, cleanlinessRating, suggestion } = req.body;

  // Validate input
  if (!name || !email || serviceRating || cleanlinessRating || !suggestion) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Create new feedback
  const newFeedback = new Feedback({ name, email, waiterComplain, serviceRating, cleanlinessRating, suggestion });
  newFeedback.save()
    .then(() => res.json({ message: 'Feedback sent successfully' }))
    .catch(err => res.status(500).json({ error: 'Failed to send feedback', details: err }));
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
