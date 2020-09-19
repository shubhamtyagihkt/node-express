const express = require('express'),
      http = require('http'),
      morgan = require('morgan'), // used for logging purposes
      bodyParser = require('body-parser'),
      dishRouter = require('./routes/dishRouter'),
      promoRouter = require('./routes/promoRouter'),
      leaderRouter = require('./routes/leaderRouter'),
      userRouter = require('./routes/users'),
      mongoose = require('mongoose'),
      Dishes = require('./models/dishes'),
      cookieParser = require('cookie-parser'),
      session = require('express-session'),
      FileStore = require('session-file-store')(session),
      passport = require('passport'),
      authenticate = require('./authenticate');
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

app.use(passport.initialize());
app.use(passport.session());

// app.use('/', indexRouter);
app.use('/user', userRouter);


function auth(req, res, next) {
  console.log(req.user);
  if(!req.user) {
    var err = new Error('You are not authenticated!');
    err.status = 403;
    return next(err);
  }
  else {
    next();
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