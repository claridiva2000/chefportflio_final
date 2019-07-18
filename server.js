const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();
const server = express();

const chefroutes = require('./routes/chefs');
const dishroutes = require('./routes/recipes');

server.use('/public/uploads', express.static('./public'));
server.use(express.json());
server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(morgan('dev'));

mongoose.connect(
  '  mongodb+srv://chefportfolio2:backend@chefportfolio-8idgc.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true }
);

server.use('/chefs', chefroutes);
server.use('/recipes', dishroutes);

server.get('/', (req, res, next) => {
  res.send(
    '<h1>ChefPortfolio</h1> <p>Welcome to our server.</p> <p>access chefs:</p> <p>https://chefportfoliopt4.herokuapp.com/chefs</p><p>access recipes:</p> <p>https://chefportfoliopt4.herokuapp.com/recipes</p> <p>to access individual recipes/chefs, just paste in the _id or click the link in the URL which is included for each recipe and chef</p> <p>access pictures: still working on that. we have pictures in memory, just not sure how to get them working just yet..</p>'
  );
});

server.use((req, res, next) => {
  const error = new Error('Not Found');
  res.status(404);
  next(error);
});

server.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message
    }
  });
});

module.exports = server;
