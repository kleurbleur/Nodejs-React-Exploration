var express = require('express');
var path = require('path');
var logger = require('morgan');
// var bodyParser = require('body-parser');

// create express App
var app = express();

// log the requests
app.use(logger('dev'));

// parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({extended: true}))

// parse requests of content-type -application/json
// app.use(bodyParser.json())

// configuring the database
var dbConfig = require('./config/database.config.js');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url);

mongoose.connection.on('error', function() {
  console.log('Could not connect to the database. Exiting now...');
  process.exit();
});

mongoose.connection.once('open', function() {
  console.log('Succesfully connected to the database');
})

// use the public folder for the frontend files
app.use(express.static(path.join(__dirname, 'public')));

// define a simple route
app.get('/', function(req,res){
  res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

//require Notes route
require('./app/routes/note.routes.js')(app);

// listen for requests
app.listen(3000, function(){
  console.log("Server is listening on port 3000");
});
