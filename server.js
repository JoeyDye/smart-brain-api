const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signIn = require('./controllers/signIn');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'joeydye',
    password: '',
    database: 'smart-brain'
  }
});

app.use(bodyParser.json());
app.use(cors());

const getUser = id =>
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });

// Root
app.get('/', (req, res) => {
  res.json(database.users);
});

// Signin
app.post('/signin', signIn.handleSignIn(db, bcrypt));

// Register
app.post('/register', register.handleRegister(db, bcrypt));

// Profile
app.get('/profile/:id', profile.handleProfileGet(db));

// Image
app.put('/image', image.handleImage(db));

// API
app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res);
});

app.listen('5000', () => {
  console.log('app is running on port 5000');
});
