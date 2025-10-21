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


async function authToken(req, res, next) {
  try {
    const auth = req.headers['authorization'];
    if (!auth) throw new Error('Authorization header missing');
    if (typeof(auth) === "string") {
      const token = auth.split(' ')[1];
      if (!token) throw new Error('Token missing');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    }     
    else {
      throw new Error('Wrong token')
    }
  }
  catch(err) {
    res.status(401).json({ error: err.message });
  }
}

/*      Default API      */
app.get('/', (req, res) => {
  res.send('Loaded');
})
/*      User accessible       */
app.get('/profile', authToken, async (req, res) => {
  try {
    if (!req.user) throw new Error("User doesn't own a token");
    const user = (await usersCollection.find().toArray()).filter(t => t.username === req.user.username);
    res.json(user);
  } 
  catch (err) {
    console.error('Failed to fetch profile:', err.message);
    alert('Something went wrong, please try again.');
  }
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
      { expiresIn: '3h' }
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
    { expiresIn: '3h' }
  );



  res.json({ message: 'Registered and logged in', token, username: user.username });
})


/*       Not freely accessible       */
app.get('/users', authToken, async(req, res) => {
  try {
    if (req.user.role === 'admin') {
      const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
      res.status(400).json(users);
      next();
    }
    else {
      throw new Error('Unauthorized')
    }
  }
  catch(err) {
    res.status(401).json({error: `${err.message}`})
  }
  

})
app.route('/projects')
.get(authToken, async(req, res) => {
  const projects = await projectsCollection.find().toArray();
  res.send(projects);
})
.post(authToken, async(req, res) => {
    const { name, description, status, dueDate, token } = req.body;
    const startDate = new Date;
    const formatted = startDate.toISOString().split('T')[0];
    const project = {
      userid: req.user.id,
      name: name,
      description: description,
      status: status,
      startDate: formatted,
      dueDate: dueDate
    }
    await projectsCollection.insertOne({project});
    res.status(201).send('Succesfully added a project')

})


/*       Routing for admin      */
app.get('/users/:username', authToken, async (req, res) => {
      
          const username = req.params.username;
          console.log(req.headers);
          const token = req.headers['authorization'].split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (decoded.role === 'admin') {
            try {
              const users = await usersCollection.find().toArray();
              const user = users.filter(t => t.username === username);
              res.status(401).send(`${user}`);
              } 
            catch {
                console.log('You are not an admin')
            }
          }
         
      
})


app.listen(5000, () => console.log("✅ Backend running on http://localhost:5000"));