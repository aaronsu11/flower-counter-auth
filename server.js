const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// const db = knex({
//   client: 'pg',
//   connection: {
//   	connectionString : process.env.DATABASE_URL,
//   	ssl: true
//   }
// });

const app = express();

const connect = () => {
  // [START gae_flex_postgres_connect]
  const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
  };

  if (
    process.env.INSTANCE_CONNECTION_NAME &&
    process.env.NODE_ENV === 'production'
  ) {
    config.host = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
  }

  // Connect to the database
  const db = knex({
    client: 'pg',
    connection: config,
  });
  // [END gae_flex_postgres_connect]

  return db;
};

const db = connect();

app.use(cors())
app.use(bodyParser.json());

app.get('/', (req, res) => { 
	// res.send(db.users);
	res.send('Runing');
})

app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(process.env.PORT || 8080, ()=> {
  console.log('app is running on port ${process.env.PORT}');
})
