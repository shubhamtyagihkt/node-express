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
      config = require('./config'),
      fs = require('fs'),
      https = require('https'),
      uploadRouter = require('./routes/uploadRouter');
const hostname = 'localhost';
const port = 3000;
const app = express();
app.set('secPort',port+443);

// Secure traffic only
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

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
app.use('/imageUpload', uploadRouter);

const server = http.createServer(app);
/**
 * Create HTTPS server.
 */ 
 
var options = {
  key: fs.readFileSync(__dirname+'/private.key'),
  cert: fs.readFileSync(__dirname+'/certificate.pem')
};

var secureServer = https.createServer(options,app);

/**
 * Listen on provided port, on all network interfaces.
 */

secureServer.listen(app.get('secPort'), () => {
   console.log('Server listening on port ',app.get('secPort'));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});