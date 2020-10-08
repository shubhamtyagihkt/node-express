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
      authenticate = require('./authenticate'),
      config = require('./config');
const hostname = 'localhost';
const port = 3000;
const app = express();


const url = config.mongoUrl;
const connect = mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });

connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });

app.use(morgan('dev'));

app.use(cookieParser('12345-67890-09876-54321'));

app.use(passport.initialize());

// app.use('/', indexRouter);
app.use('/user', userRouter);

app.use(express.static(__dirname + '/public')); // serving static files

app.use(bodyParser.json());

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});