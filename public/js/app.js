$(document).ready(function(){
  $('.collapsible').collapsible({
    accordion : false
  });
  $('.modal-trigger').leanModal();
  $('.tooltipped').tooltip({
    delay: 50
  });

  $("#logoutBtn").on("click", function() {
    localStorage.removeItem("user");
    location.href = "/";
  });
});
