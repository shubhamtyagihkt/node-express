const express = require('express'),
      http = require('http'),
      morgan = require('morgan'), // used for logging purposes
      bodyParser = require('body-parser'),
      dishRouter = require('./routes/dishRouter'),
      promoRouter = require('./routes/promoRouter'),
      leaderRouter = require('./routes/leaderRouter'),
      mongoose = require('mongoose'),
      Dishes = require('./models/dishes'),
      cookieParser = require('cookie-parser'),
      session = require('express-session'),
      FileStore = require('session-file-store')(session);
const hostname = 'localhost';
const port = 3000;
const app = express();


const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });

connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });

app.use(morgan('dev'));

app.use(cookieParser('12345-67890-09876-54321'));

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));


function auth(req, res, next) {
  if (!req.session.user) {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');              
        err.status = 401;
        next(err);
        return;
    }
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];
    if (user == 'admin' && pass == 'password') {
        res.cookie('user','admin',{signed: true});
        next(); // authorized
    } else {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');              
        err.status = 401;
        next(err);
    }
  }
  else {
      if (req.session.user === 'admin') {
          next();
      }
      else {
          var err = new Error('You are not authenticated!');
          err.status = 401;
          next(err);
      }
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