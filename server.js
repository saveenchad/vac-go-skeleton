var PORT = 3000;

var express    = require('express');
var http       = require('http');
var path       = require('path');
var handlebars = require('express-handlebars');
var firebase   = require('firebase');
var fs         = require('fs');
var uuid       = require('node-uuid');

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
app.use(express.cookieParser('VAC-Go secret key!'));
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

app.post('/addNewPost', function(req, res) {
  req.body.id = uuid.v4();
  var postsFile = fs.readFileSync('./data.json');
  var postsObj = JSON.parse(postsFile);
  postsObj.posts.push(req.body);
  postsFile = JSON.stringify(postsObj);
  fs.writeFileSync('./data.json', postsFile);

  res.status(200).send("success");
});

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
