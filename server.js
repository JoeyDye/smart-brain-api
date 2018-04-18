const express = require('express');
const bodyParser = require('body-parser');
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
    host: process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Root
app.get('/', (req, res) => {
  res.send('It is working!');
});

// Signin
app.post('/signin', signIn.handleSignin(db, bcrypt));

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

// Run on Heroku port else run on port 5000
app.listen(process.env.PORT || '5000', () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
