import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { parseJwt } from '../Frontend/parseJwt.js';

dotenv.config();

const app = express();
const db = await connectDB();
const usersCollection = db.collection('users');
const projectsCollection = db.collection('projects');

app.use(cors());
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Loaded');
})
app.get('/users', async(req, res) => {
  const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
  res.send(users);
})
app.route('/projects')
.get(async(req, res) => {
  const projects = await projectsCollection.find().toArray();
  res.send(projects);
})
.post(async(req, res) => {
    const { name, description, dueDate, token } = req.body;
    const startDate = new Date;
    const formatted = startDate.toISOString().split('T')[0];
    const decoded = await parseJwt(token);
    const project = {
      userid: decoded.id,
      name: name,
      description: description,
      startDate: formatted,
      dueDate: dueDate
    }
    await projectsCollection.insertOne({project});
    res.status(201).send('Succesfully added a project')

})
app.post('/users/login', async(req, res) => {
  try {
    const { username, password } = req.body;
    const user = await usersCollection.findOne({ username });
    if (!user) return res.status(400).send('"Invalid username or password"');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).send('"Invalid username or password"');

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role  },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.send({ message: 'Logged in', token, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

app.post('/users/register', async(req, res) => {
  const { username, email, password } = req.body;
  const used = await usersCollection.findOne({ username });
  if (used) return res.status(400).send('User is already registered');
  const hashed = await bcrypt.hash(password, 10);
  const user = {
    username: username,
    email: email,
    password: hashed,
    role: "user"
  }
  const response = await usersCollection.insertOne(user);

  const token = jwt.sign(
    { id: user._id, username: user.username, role: user.role  },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ message: 'Registered and logged in', token, username: user.username });
});

app.listen(5000, () => console.log("✅ Backend running on http://localhost:5000"));