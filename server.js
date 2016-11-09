var PORT = 3000;
var KEY = "Team Jingle Secret Key";

var express    = require('express');
var http       = require('http');
var path       = require('path');
var handlebars = require('express-handlebars');
// var firebase   = require('firebase');
var fs         = require('fs');
var uuid       = require('node-uuid');
var crypto     = require('crypto-js');

var index      = require('./routes/index.js');

var app        = express();

app.set('port', process.env.PORT || PORT);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars({
  helpers: {
    if_eq: function(a, b, opts) {
      if(a === b) {
        return opts.fn(this);
      } else {
        return opts.inverse(this);
      }
    },
    toJSON: function(obj) {
      return JSON.stringify(obj);
    }
  }
}));
app.set('view engine', 'handlebars');
app.set('view cache', false);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser(KEY));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/** ROUTES **/
app.get('/', index.view);
app.get('/add', index.add);
app.get('/getMajorsFile', index.getMajorsFile);
app.get('/signed-in', index.signedIn);
app.get('/counselor', index.counselor);

app.post('/login', function(req, res) {
  // read the users file and save the text in a variable
  var usersFile = fs.readFileSync('./users.json');
  // convert the text to JSON
  var users = JSON.parse(usersFile).users;
  // loop through array
  for(var i = 0; i < users.length; i++) {
    // if usernames match
    if(users[i].username === req.body.username) {
      // TODO: The following is terrible code and horribly insecure...I know...
      // decrypt the stored password and compare to passed in value
      var dPass = crypto.AES.decrypt(users[i].password, KEY).toString(crypto.enc.Utf8);
      if(dPass === req.body.password) {
        // if they match, return that it passed
        res.status(200).send("success");
        return;
      }
    }
  }
  // if none of the usernames/passwords match, return failure
  res.status(403).send("failure");
});

app.post('/signup', function(req, res) {
  // read the users file and store the text in a variable
  var usersFile = fs.readFileSync('./users.json');
  // convert the text to JSON
  var usersArry = JSON.parse(usersFile);
  // generate and store a unique ID for the new user
  req.body.id = uuid.v4();
  // encrypt their password
  req.body.password = crypto.AES.encrypt(req.body.password, KEY).toString();
  // push the new user into the users JSON object
  usersArry.users.push(req.body);
  // convert the JSON back into text
  usersFile = JSON.stringify(usersArry);
  // write the JSON to the file
  fs.writeFileSync('./users.json', usersFile);
  // return success
  res.status(200).send("success");
});

app.post('/addNewPost', function(req, res) {
  // generate and store a unique ID with each post
  req.body.id = uuid.v4();
  // read the posts file and save the text in a variable
  var postsFile = fs.readFileSync('./data.json');
  // convert the text to JSON
  var postsArry = JSON.parse(postsFile).posts;
  // add the new data to the JSON
  postsArry.push(req.body);
  // convert the JSON back into text
  postsFile = JSON.stringify(postsArry);
  // write the text back into the file
  fs.writeFileSync('./data.json', postsFile);
  // send a success to the frontend
  res.status(200).send("success");
});

// app.post('/upvote', function(req, res) {
//
// });
//
// app.post('/downvote', function(req, res) {
//
// });
//
// app.post('/postComment', function(req, res) {
//
// });
//
// app.post('/sendToCounselor', function(req, res) {
//
// });

/** START SERVER **/
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

/** FIREBASE CONFIG **/
// var fbConfig = {
//   apiKey: "AIzaSyDmJrCjmCLEj3hpD8ITh1rg1UAtrKl3UbY",
//   authDomain: "vac-go.firebaseapp.com",
//   databaseURL: "https://vac-go.firebaseio.com",
//   storageBucket: "vac-go.appspot.com",
// };
// firebase.initializeApp(fbConfig);
