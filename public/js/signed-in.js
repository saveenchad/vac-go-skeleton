$(document).ready(function() {
  $(".collapsible-header .btn-small.upvote").click(function(e) {
    e.stopPropagation();
  });

  $(".collapsible-header .btn-small.downvote").click(function(e) {
    e.stopPropagation();
  });

  $(".comment-reply").click(function(e) {
    var newComment = $(this).prev().val();
    if(newComment.length === 0) return;

    var comments = $(this).parent().parent().parent().prev();

    comments.append("<blockquote><span class='vac-go-comment-author'>user.name1</span>: " + newComment + "</blockquote>");
    $(this).prev().val("");
  });

  $("#send").click(function(e) {
    if($("#sel:checked").length) {
      Materialize.toast('Course plan sent to counselors!', 4000);
    } else {
      Materialize.toast('Please select at least one course plan to send!', 4000)
    }
  });
});
