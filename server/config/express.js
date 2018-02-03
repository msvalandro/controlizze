import express from 'express';
import consign from 'consign';
import bodyParser from 'body-parser';
import config from './config';
import database from './database';
import authorization from './auth';

const app = express();
app.config = config;

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.database = database(app);
app.set('port', 8080);
app.use(bodyParser.json());

const auth = authorization(app);
app.use(auth.initialize());
app.auth = auth;

consign()
  .include('models')
  .then('controllers')
  .then('routes/auth.js')
  .then('routes')
  .into(app);

export default app;
