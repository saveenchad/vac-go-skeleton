$(document).ready(function() {
  $("ul.tabs").tabs();
  $("#collegeSel, #majorSel").material_select();

  $("#loginBtn").on("click", function login() {
    var username = $("#lUsername");
    var password = $("#lPassword");

    var errors = false;

    if(username.hasClass("invalid") || username.val().length === 0) {
      Materialize.toast("Please input a valid username", 4000);
      errors = true;
    }

    if(password.hasClass("invalid") || password.val().length === 0) {
      Materialize.toast("Please input a valid password", 4025);
      errors = true;
    }

    if(errors) return;

    var loginObj = {
      username: username.val(),
      password: password.val()
    };

    $.ajax({
      type: "POST",
      url: "/login",
      contentType: "application/json; charset=utf-8",
      dataType: "text",
      data: JSON.stringify(loginObj),
      async: true,
      success: function(res) {
        console.log("User signed in");
        location.href="./signed-in";
      },
      error: function(err) {
        Materialize.toast("Login failed! Please check your username and password and try again", 5000);
        console.log("Login failed!");
      }
    });
  });

  $("#signupBtn").on("click", function signup() {
    var email        = $("#sEmail");
    var username     = $("#sUsername");
    var password     = $("#sPassword");
    var confPassword = $("#confPassword");
    var confLabel    = $("#confLabel");
    var college      = $("#collegeSel");
    var major        = $("#majorSel");

    var errors = false;

    if(email.hasClass("invalid") || email.val().length === 0) {
      Materialize.toast("Please input a valid email", 4025);
      errors = true;
    }

    if(username.hasClass("invalid") || username.val().length === 0) {
      Materialize.toast("Please input a valid username", 4050);
      errors = true;
    }

    if(password.hasClass("invalid") || password.val().length === 0) {
      Materialize.toast("Please input a valid password", 4075);
      errors = true;
    }

    if(confPassword.val().length > 5) {
      if(confPassword.val() !== password.val()) {
        Materialize.toast("Passwords don't match!", 4100);
        confPassword.addClass("validate invalid");
        confLabel.addClass("active");
        errors = true;
      }
    }

    if(college.val() === null) {
      Materialize.toast("Please select your college", 4125);
      errors = true;
    }

    if(major.val() === null) {
      Materialize.toast("Please select your major", 4150);
      errors = true;
    }

    if(errors) return;

    var signupObj = {
      username: username.val(),
      password: password.val(),
      email: email.val(),
      college: college.val(),
      major: major.val()
    }

    $.ajax({
      type: "POST",
      url: "/signup",
      contentType: "application/json; charset=utf-8",
      dataType: "text",
      data: JSON.stringify(signupObj),
      async: true,
      success: function(res) {
        console.log("User signed up");
        location.href="./signed-in";
      },
      error: function(err) {
        Materialize.toast("Signup failed! Please check your inputs and try again", 5000);
        console.log("Signup failed!");
      }
    });
  });
});
