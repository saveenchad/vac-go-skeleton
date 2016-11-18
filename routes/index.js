var fs = require('fs');

exports.add = function(req, res) {
	var majorsFile = fs.readFileSync('majors.json');
	var majorsObj = JSON.parse(majorsFile);
	res.render('add-post', {majors: majorsObj.majors});
};

exports.add2 = function(req, res) {
	var majorsFile = fs.readFileSync('majors.json');
	var majorsObj = JSON.parse(majorsFile);
	res.render('add-post-b', {majors: majorsObj.majors});
};

exports.getMajorsFile = function(req, res) {
	var majorsFile = fs.readFileSync('majors.json');
	var majorsObj = JSON.parse(majorsFile);
	res.json(majorsObj);
};

exports.signedIn = function(req, res) {
	var postsFile = fs.readFileSync('data.json');
	var postsObj = JSON.parse(postsFile);
  res.render('signed-in', {posts: postsObj.posts});
};

exports.view = function(req, res) {
	res.render('login');
};

exports.counselor = function(req, res) {
	res.render('counselor');
}
