// Get all of our friend data
var posts  = require('../posts.json');
var majors = require('../majors.json');

exports.add = function(req, res) {
	res.render('add-post', {majors: majors.majors});
};

exports.getMajorsFile = function(req, res) {
	res.json(majors);
};

exports.login = function(req, res) {
  res.render('signed-in', {posts: posts.posts});
};

exports.view = function(req, res) {
	res.render('index', {posts: posts.posts});
};
