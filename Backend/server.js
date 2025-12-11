import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const secret = process.env.JWT_SECRET;

const app = express();
const db = await connectDB();
const usersCollection = db.collection('users');
const projectsCollection = db.collection('projects');
const tasksCollection = db.collection('tasks');

app.use(cors());
app.use(express.json()); 


class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}
class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DatabaseError';
  }
}

  async function setAuthCookies(res, user) {
  const token = jwt.sign({ userId: user.userId, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  })
  res.cookie('jwt_auth', token, {
    httpOnly: true,    
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict',  
    maxAge: 24 * 60 * 60 * 1000 
  });
  return token;
}

function isLoggedIn(req, res, next) {
  const auth = req.headers['authorization'];
  const arr = auth.trim().split(' ')
  const valid = jwt.verify(arr[1],process.env.JWT_SECRET);
  console.log(valid)
  if (valid) {
     req.userId = valid.userId;
  }
  next();
}







app.get('/', (req, res) => {
  res.send('Server is running');
})

// User Routes

  app.post('/user/login', async(req, res) => {
    const { username, password } = req.body;
    //console.log('1',username)
    //console.log('2',password)
    if (!username || !password ) throw new ValidationError('Incorrect username or password');

  try {
    const user = await usersCollection.findOne({ username: username });
    //console.log('3',user)
    if (!user) throw new DatabaseError('Incorrect username or password');

    const valid = await bcrypt.compare(password, user.password);
    //console.log('4',valid)
    if (!valid) throw new DatabaseError('Incorrect username or password');

    const token = await setAuthCookies(res, user);
    console.log(token);
    res.json( token );

  } catch (err) {
      if (err instanceof ValidationError) { 
        return res.status(400).json({ error: err.message }); 
      }
      if (err instanceof DatabaseError) { 
        return res.status(400).json({ error: err.message });
      }
      else {
        return res.status(500).send('Internal Server Error');
      }
    }
  })

  app.post('/user/register', async(req, res) => {
  const { username, email, password } = req.body;

  try {
    const usernameUsed = await usersCollection.findOne({ username: username });
    if (usernameUsed) throw new ValidationError('Username is already used.')
    
    const hashed = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const user = {
      userId: userId, 
      username: username,
      email: email,
      password: hashed,
    }
    await usersCollection.insertOne(user);
    res.status(201).json({ message: 'Registered and logged in', userId: user.userId, token: token, username: user.username }); 
    
  }
  catch (err) {
    if (err instanceof ValidationError) { 
      return res.status(400).json({ error: err.message });
    }
    if (err instanceof DatabaseError) { 
      return res.status(400).json({ error: err.message });
    }
    else {
      return res.status(500).send('Internal Server Error');
    }
  }
  })

  app.get('/user/projects', isLoggedIn, async (req, res) => {
    const userId = req.userId;
    try {
      if (!userId) throw new ValidationError('Invalid User Token!');

      const projects = await projectsCollection.find({$or: [{userId: req.userId}, {memberIds: req.userId }]}).toArray();;
      if (projects.length === 0 ) {
        return res.status(200).json([]);
      }
      
      console.log('data',projects);
      res.status(200).json(projects);
    }
    catch (err) {
      console.error("CRASH PREVENTED:", err);
      
      if (err instanceof ValidationError) { 
        return res.status(400).json({ error: err.message });
      }
      if (err instanceof DatabaseError) { 
        return res.status(400).json({ error: err.message });
      }
      else {
        return res.status(500).send('Internal Server Error');
      }
    }
  }) 


  app.get('/user/profile', async (req, res) => {

  })


  app.post('/user/token/decrypt', (req, res) => {
  const token = req.body.token;

  try {
    const decoded = jwt.verify(token, secret);
    console.log(decoded);
    res.status(200).json(decoded);

  }
  catch (err) {
    
  }
  })




app.listen(5000, () => console.log("✅ Backend running on http://localhost:5000"));