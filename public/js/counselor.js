$(document).ready(function() {
  var USER = JSON.parse(localStorage.getItem("user"));

  if(!USER) {
    location.href = "/";
  } else if(USER.type === "student") {
    location.href = "/signed-in"
  } else if(USER.type === "counselor") {
    $("#username").html(USER.username);
  }
});
