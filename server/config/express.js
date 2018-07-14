import express from 'express';
import consign from 'consign';
import bodyParser from 'body-parser';
import cors from 'cors';
import config from './config';
import database from './database';
import authorization from './auth';
import migration from './migration';

const app = express();
app.config = config;

app.database = database(app);
app.set('port', 8080);
app.use(cors());
app.use(bodyParser.json());

const auth = authorization(app);
app.use(auth.initialize());
app.auth = auth;

consign()
  .include('models')
  .then('controllers/usuario.js')
  .then('controllers')
  .then('routes/auth.js')
  .then('routes')
  .into(app);

migration(app);

export default app;
