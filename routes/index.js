var fs = require('fs');

var DATA_JSON   = "data.json",
    MAJORS_JSON = "majors.json",
		REQS_JSON   = "reqs.json";

exports.add = function(req, res) {
	var majorsFile = fs.readFileSync(MAJORS_JSON);
	var majorsObj = JSON.parse(majorsFile).majors
	res.render('add-post', {majors: majorsObj});
};

exports.add2 = function(req, res) {
	var majorsFile = fs.readFileSync(MAJORS_JSON);
	var majorsObj = JSON.parse(majorsFile).majors;
	res.render('add-post-b', {majors: majorsObj});
};

exports.getMajorsFile = function(req, res) {
	var majorsFile = fs.readFileSync(MAJORS_JSON);
	var majorsObj = JSON.parse(majorsFile);
	res.json(majorsObj);
};

exports.signedIn = function(req, res) {
	var postsFile = fs.readFileSync(DATA_JSON);
	var postsObj = JSON.parse(postsFile).posts;
  res.render('signed-in', {posts: postsObj});
};

exports.view = function(req, res) {
	res.render('login');
};

exports.counselor = function(req, res) {
	var reqsFile = fs.readFileSync(REQS_JSON);
	var reqsObj = JSON.parse(reqsFile).reqs;
	res.render('counselor', {reqs: reqsObj});
}
