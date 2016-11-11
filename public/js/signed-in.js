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
      var link = "mailto:counselor@ucsd.edu"
               + "?subject=" + escape("[VAC-Go] Course plan review")
               + "&body=" + escape("Please review my course plan:\n\nCSE 12\nCSE 15L\nCSE20\n\nThank you!\n");

      location.href = link;
    } else {
      Materialize.toast('Please select at least one course plan to send!', 4000)
    }
  });

  $("#sendUrgent").click(function(e) {
    if($("#sel:checked").length) {
      var link = "mailto:counselor@ucsd.edu"
               + "?subject=" + escape("[URGENT] [VAC-Go] PreReq Clearance")
               + "&body=" + escape("Can I get cleared for CSE 110? I really want to take it and my first pass is in an hour!\n\nThank you!\n");

      location.href = link;
    } else {
      Materialize.toast('Please select at least one course plan to send!', 4000)
    }
  });

  $(".upvote").click(function() {
    $(this).parents("li.post").attr("data-post-id");
    var user = JSON.parse(localStorage.getItem("user"))
    $.ajax({
      type: "POST",
      url: "/getVotersById",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({id: user.id}),
      async: true,
      success: function(res) {
        console.log(res);
        if (res.upvoters.length > 0) {
          if (res.upvoters.indexof(user.id) > -1) {
            /* call downvote */
          }
          else {
            /* call upvote*/
          }
        }
        else {

          /* call upvote */
        }
      },
      error: function(err) {
        console.log(err);
      }
    });

  });

  $(".downvote").click(function() {
    $(this).parents("li.pot").attr("data-post-id");
  $.ajax({
      type: "POST",
      url: "/getVotersById",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({id: user.id}),
      async: true,
      success: function(res) {
        console.log(res);
        if (res.upvoters.length > 0) {
          if (res.upvoters.indexof(user.id) > -1) {
            /* call upvote */
          }
          else {
            /* call downvote*/
          }
        }
        else {

          /* call downvote */
        }
      },
      error: function(err) {
        console.log(err);
      }
    });

  });
});
