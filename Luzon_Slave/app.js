
const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

const bodyParser = require('body-parser')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');
app.set('view engine', 'hbs');
app.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));

app.use(express.static('public'));

const session = require('express-session');

app.use(session({
  secret: 'eyjafjallathehvitaska',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

const router = require('./controllers/mainRouter')
app.use("/", router);

const port = process.env.PORT | 3000;
server.listen(port, function(){
    console.log('Listening at port '+port);
});
