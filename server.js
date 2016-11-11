/** constants **/
var PORT       = 3000,
    KEY        = "Team Jingle Secret Key",
    DATA_JSON  = "./data.json",
    USERS_JSON = "./users.json";

var express    = require('express');
var http       = require('http');
var path       = require('path');
var handlebars = require('express-handlebars');
// var firebase   = require('firebase');
var fs         = require('fs');
var uuid       = require('node-uuid');
var crypto     = require('crypto-js');
var df         = require('dateformat');

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
    date: function(a) {
      return df(a, "mm/dd h:MM TT")
    },
    isToday: function(a, opts) {
      var today = new Date();
      today = today.setHours(0,0,0,0);

      if(a >= today) {
        return opts.fn(this);
      } else {
        return opts.inverse(this);
      }
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

app.post('/getVotedOnPosts', function(req, res) {
  var upvoted = [];
  var downvoted = [];

  var postsFile = fs.readFileSync(DATA_JSON);

  var postsArry = JSON.parse(postsFile).posts;

  for(var i = 0; i < postsArry.length; i++) {
    if(postsArry[i].upvoters.indexOf(req.body.userId) > -1) {
      upvoted.push(postsArry[i].id);
    }
    if(postsArry[i].downvoters.indexOf(req.body.userId) > -1) {
      downvoted.push(postsArry[i].id);
    }
  }

  var retObj = {
    upvoted: upvoted,
    downvoted: downvoted
  };

  res.status(200).send(retObj);
});

app.post('/getVotersById', function(req, res) {
  // read the posts file and save the text in a variable
  var postsFile = fs.readFileSync(DATA_JSON);
  // convert the text to JSON
  var postsArry = JSON.parse(postsFile);

  // iterate over posts to find the post that matches the ID passed in
  for(var i = 0; i < postsArry.posts.length; i++) {
    if(postsArry.posts[i].id === req.body.id) {
      // build an object with the data to return
      var retObj = {
        upvoters: postsArry.posts[i].upvoters,
        downvoters: postsArry.posts[i].downvoters
      };
      // return the object to the frontend
      res.status(200).send(retObj);
      return;
    }
  }

  // if no post can be found with a matching ID, return error
  res.status(404).send("failure");
});

app.post('/login', function(req, res) {
  // read the users file and save the text in a variable
  var usersFile = fs.readFileSync(USERS_JSON);
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
        // send a user object back to the client side
        var userObj = buildUserObj(users[i]);
        // if they match, return that it passed
        res.status(200).send(userObj);
        return;
      }
    }
  }
  // if none of the usernames/passwords match, return failure
  res.status(403).send("failure");
});

app.post('/signup', function(req, res) {
  // read the users file and store the text in a variable
  var usersFile = fs.readFileSync(USERS_JSON);
  // convert the text to JSON
  var usersArry = JSON.parse(usersFile);
  // generate and store a unique ID for the new user
  req.body.id = uuid.v4();
  // encrypt their password
  req.body.password = crypto.AES.encrypt(req.body.password, KEY).toString();
  // push the new user into the users JSON object
  usersArry.users.push(req.body);
  // convert the JSON back into text
  usersFile = JSON.stringify(usersArry, null, 2);
  // write the JSON to the file
  fs.writeFileSync(USERS_JSON, usersFile);
  // send a user object back to the client side
  var userObj = buildUserObj(req.body);
  // return success
  res.status(200).send(userObj);
});

app.post('/addNewPost', function(req, res) {
  // generate and store a unique ID with each post
  req.body.id = uuid.v4();
  // read the posts file and save the text in a variable
  var postsFile = fs.readFileSync(DATA_JSON);
  // convert the text to JSON
  var postsArry = JSON.parse(postsFile).posts;
  // add the new data to the JSON
  postsArry.push(req.body);
  // convert the JSON back into text
  postsFile = JSON.stringify(postsArry, null, 2);
  // write the text back into the file
  fs.writeFileSync(DATA_JSON, postsFile);
  // send a success to the frontend
  res.status(200).send("success");
});

app.post('/upvotePostById', function(req, res) {
  var upvoted = false, numVotes = 0;
  var postsFile = fs.readFileSync(DATA_JSON);
  var postsArry = JSON.parse(postsFile);

  for(var i = 0; i < postsArry.posts.length; i++) {
    if(postsArry.posts[i].id === req.body.postId) {
      postsArry.posts[i].votes++;
      postsArry.posts[i].upvoters.push(req.body.userId);
      upvoted = true;
      numVotes = postsArry.posts[i].votes;
      break;
    }
  }

  postsFile = JSON.stringify(postsArry, null, 2);
  fs.writeFileSync("./data.json", postsFile);

  if(upvoted) res.status(200).send("" + numVotes);
  else res.status(500).send("failure");
});

app.post('/undoUpvoteById', function(req, res) {
  var upvoteUndone = false, numVotes;
  var postsFile = fs.readFileSync(DATA_JSON);
  var postsArry = JSON.parse(postsFile);

  for(var i = 0; i < postsArry.posts.length; i++) {
    if(postsArry.posts[i].id === req.body.postId) {
      postsArry.posts[i].votes--;
      var userIndex = postsArry.posts[i].upvoters.indexOf(req.body.userId);
      postsArry.posts[i].upvoters.splice(userIndex, 1);
      upvoteUndone = true;
      numVotes = postsArry.posts[i].votes;
      break;
    }
  }

  postsFile = JSON.stringify(postsArry, null, 2);
  fs.writeFileSync("./data.json", postsFile);

  if(upvoteUndone) res.status(200).send("" + numVotes);
  else res.status(500).send("failure");
});

app.post('/downvotePostById', function(req, res) {
  var downvoted = false, numVotes;
  var postsFile = fs.readFileSync(DATA_JSON);
  var postsArry = JSON.parse(postsFile);

  for(var i = 0; i < postsArry.posts.length; i++) {
    if(postsArry.posts[i].id === req.body.postId) {
      postsArry.posts[i].votes--;
      postsArry.posts[i].downvoters.push(req.body.userId);
      downvoted = true;
      numVotes = postsArry.posts[i].votes;
      break;
    }
  }

  postsFile = JSON.stringify(postsArry, null, 2);
  fs.writeFileSync("./data.json", postsFile);

  if(downvoted) res.status(200).send("" + numVotes);
  else res.status(500).send("failure");
});

app.post('/undoDownvoteById', function(req, res) {
  var downvoteUndone = false, numVotes;
  var postsFile = fs.readFileSync(DATA_JSON);
  var postsArry =   JSON.parse(postsFile);

  for(var i = 0; i < postsArry.posts.length; i++) {
    if(postsArry.posts[i].id === req.body.postId) {
      postsArry.posts[i].votes++;
      var userIndex = postsArry.posts[i].downvoters.indexOf(req.body.userId);
      postsArry.posts[i].downvoters.splice(userIndex, 1);
      downvoteUndone = true;
      numVotes = postsArry.posts[i].votes;
      break;
    }
  }

  postsFile = JSON.stringify(postsArry, null, 2);
  fs.writeFileSync("./data.json", postsFile);

  if(downvoteUndone) res.status(200).send("" + numVotes);
  else res.status(500).send("failure");
});

app.post('/postComment', function(req, res) {
  // success flag
  var commentAdded = false;
  // read the posts file and save the text in a variable
  var postsFile = fs.readFileSync(DATA_JSON);
  // convert the text to JSON
  var postsObj = JSON.parse(postsFile);
  // iterate over the posts and look for the post with the ID passed in
  for(var i = 0; i < postsObj.posts.length; i++) {
    if(postsObj.posts[i].id === req.body.id) {
      // if the post is found, build a comment object to push
      var commentObj = {
        date: Date.now(),
        author: req.body.newComment.author,
        comment: req.body.newComment.msg
      };
      postsObj.posts[i].comments.push(commentObj);
      commentAdded = true;
      break;
    }
  }

  postsFile = JSON.stringify(postsObj, null, 2);

  fs.writeFileSync(DATA_JSON, postsFile);

  if(commentAdded) res.status(200).send("success");
  else res.status(500).send("failure");
});

function buildUserObj(user) {
  var userObj = {
    username: user.username,
    email: user.email,
    college: user.college,
    major: user.major,
    id: user.id
  }

  return userObj;
}

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
