const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(express.json());

app.use(cors({
  origin: '*',
  methods: 'OPTIONS, GET, POST, PUT, DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  credentials: true,
}));

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

const taskSchema = new mongoose.Schema({
  title: String,
  userId: String,
});

const Task = mongoose.model('Task', taskSchema);

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.redirect('error'); 
    }

    const user = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error');
    res.redirect('error'); 
  }
};

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(200).json({ message: "User registered successfully" }); 
  } catch (error) {
    res.status(500).json({ error: "Server Error" }); 
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ username }, process.env.JWT_SECRET_KEY);
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: "Server Error" });
  }
});

app.get('/tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.username });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: "Server Error" });
  }
});

app.post('/tasks', authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;
    const task = new Task({ title, userId: req.user.username });
    await task.save();
    res.status(200).json({ message: "Task created successfully" });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: "Server Error" });
  }
});

app.delete('/tasks', authenticateToken, async (req, res) => {
  try {
    await Task.deleteMany({ userId: req.user.username });
    res.status(200).json({ message: "Tasks deleted successfully" });
  } catch (error) {
    console.error('Error deleting tasks:', error);
    res.status(500).json({ error: "Server Error" });
  }
});

app.use("/", (req, res) => {
  res.send("Server is running.");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});
