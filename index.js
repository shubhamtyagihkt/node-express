const express = require('express'),
      http = require('http'),
      morgan = require('morgan'), // used for logging purposes
      bodyParser = require('body-parser'),
      dishRouter = require('./routes/dishRouter'),
      promoRouter = require('./routes/promoRouter');

const hostname = 'localhost';
const port = 3000;
const app = express();


app.use(morgan('dev'));
app.use(express.static(__dirname + '/public')); // serving static files

app.use(bodyParser.json());

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});