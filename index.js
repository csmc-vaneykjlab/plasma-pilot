const express = require('express');
const path = require('path');
const pg = require('pg');
const bodyParser = require('body-parser');
const routes = require('./server/routes/index');

// set port
const PORT = process.env.PORT || 5000
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/todo';

const app = express();

app.use(express.static(path.join(__dirname, '/public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')
app.get('/', function (req, res) {
  res.render('pages/index')
}); //route

app.use('/', routes);

const client = new pg.Client(connectionString);

app.listen(PORT, () => console.log(`Listening on ${ PORT }`)) 

module.exports = app;