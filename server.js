// Import express
const express = require('express');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars');
const credentials = require('./credentials');

// Connect to database
const dbUrl = `mongodb://${credentials.host}:${credentials.port}/${credentials.database}`;
mongoose.connect(dbUrl, { useNewUrlParser: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// setup handlebars view engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
// static resources
app.use(express.static(`${__dirname}/public`));

// Routing;
const routes = require('./routes/index');

app.use('/', routes);

app.use((req, res) => {
  res.status(404);
  res.render('error');
});

app.listen(3000, () => {
  console.log('http://localhost:3000');
});
