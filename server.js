var express = require('express'),
app = express(),
path = require('path'),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
passport = require('passport');

//get the config file
var config = require('./config/config');

// getting routes
var routes = require('./routes/index');
var api = require('./routes/api');

//mongoose promise deprecated warning fix!
mongoose.Promise = global.Promise;
//connect to db
mongoose.connect(config.db);

//Use body-parser to get POST requests for API use
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Allow CORS 
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

//Intitialize passport
app.use(passport.initialize());

// set Static Folder
// app.use(express.static(path.join(__dirname, 'public')));

//statis files serve 
app.use("/public", express.static(path.join(__dirname, 'public')));

//setting routes
app.use('/', routes);
app.use('/api', api);

app.listen(config.port);