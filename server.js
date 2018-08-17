'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');

const app = express();
app.use(express.json());

const userRoutes = require('./users/routes');
const feedPostsRoutes = require('./feed/routes');

app.use(morgan('common'));

app.use(express.static('public'));

app.use('/api/users', userRoutes);
app.use('/api/feed', feedPostsRoutes);

app.use((req, res, next) => {
    res.sendStatus(404);
    next();
})

app.use((req, res, next, error) => {
    console.error(error);
    res.status(500).json(error);
    next();
})

//add runServer/closeServer
let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };