const express = require('express'),
      http = require('http'),
      morgan = require('morgan'), // used for logging purposes
      bodyParser = require('body-parser'),
      dishRouter = require('./routes/dishRouter'),
      promoRouter = require('./routes/promoRouter'),
      leaderRouter = require('./routes/leaderRouter'),
      mongoose = require('mongoose'),
      Dishes = require('./models/dishes');
const hostname = 'localhost';
const port = 3000;
const app = express();


const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });

connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });

app.use(morgan('dev'));

function auth(req, res, next) {
  console.log(req.headers);
  let authHeader = req.headers.authorization;
  if (!authHeader) {
    let err = new Error('You are not authorized');
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    next(err);
    return;
  }

  var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  let user = auth[0];
  let pass = auth[1];
  if (user == 'admin' && pass == 'password') {
      next(); // authorized
  } else {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');      
      err.status = 401;
      next(err);
  }

}

app.use(auth);

app.use(express.static(__dirname + '/public')); // serving static files

app.use(bodyParser.json());

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});