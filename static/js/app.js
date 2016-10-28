$(document).ready(function(){
  $('.collapsible').collapsible({
    accordion : false
  });
  $('.modal-trigger').leanModal();
  $('.tooltipped').tooltip({
    delay: 50
  });
  $('select').material_select();

  $(".collapsible-header .btn-small.upvote").click(function(e) {
    e.stopPropagation();
  });

  $(".collapsible-header .btn-small.downvote").click(function(e) {
    e.stopPropagation();
  });

  $("#send").click(function(e) {
    if($("#sel:checked").length) {
      Materialize.toast('Course plan sent to counselors!', 4000);
    } else {
      Materialize.toast('Please select at least one course plan to send!', 4000)
    }
  });
});
