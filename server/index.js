const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const Game = require('./models/game');

const app = express();
const port = process.env.PORT || 3000;

// Connect to DB
mongoose.connect('mongodb://localhost/loginapp');
const db = mongoose.connection;

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use('/', express.static(path.resolve(__dirname, '../client', 'dist')));

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true,
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  (username, password, done) => {
    User.getUserByUsername(username, (err, user) => {
      if (err) throw err;
      if (!user) {
        return done(null, false, { message: 'Unknown User' });
      }
      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        }
        return done(null, false, { message: 'Invalid password' });
      });
    });
  },
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user);
  });
});

// Endpoint to login
app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));

// Endpoint to get current user
app.get('/user', (req, res) => {
  res.send(req.user);
});

// Endpoint to logout
app.get('/logout', (req, res) => {
  req.logout();
  res.send(null);
});

// Register User
app.post('/register', (req, res) => {
  const { password, password2 } = req.body;

  if (password === password2) {
    const newUser = new User({
      // name: req.body.name,
      // email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });

    User.createUser(newUser, (err, user) => {
      if (err) throw err;
      res.send(user).end();
    });
  } else {
    res.status(500).send("{errors: \"Passwords don't match\"}").end();
  }
});

app.post('/game', async (req, res) => {
  const result = await Game.create(req.body);
  res.send(result);
});

app.get('/game', async (req, res) => {
  const result = await Game.find({});
  res.send(result);
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
