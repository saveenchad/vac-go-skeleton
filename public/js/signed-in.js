$(document).ready(function() {
  var USER = JSON.parse(localStorage.getItem("user"));

  if(!USER) {
    location.href = "./";
  } else {
    $("#username").html(USER.username);
  }

  function upvote(postId, userId, post) {
    var voteObj = {
      userId: userId, post,
      postId: postId
    };

    $.ajax({
      type: "POST",
      url: "/upvotePostById",
      contentType: "application/json; charset=utf-8",
      dataType: "text",
      data: JSON.stringify(voteObj),
      async: true,
      success: function(res) {
        post.siblings(".votes").html(res).addClass("upvoted");
        if(post.hasClass("upvote")) {
          post.addClass("upvoted");
        } else {
          post.siblings(".upvote").addClass("upvoted");
        }
      },
      error: function(err) {
        Materialize.toast("Error while upvoting post. Please try again", 4000);
      }
    });
  };

  function undoUpvote(postId, userId, post) {
    var voteObj = {
      userId: userId,
      postId: postId
    };

    $.ajax({
      type: "POST",
      url: "/undoUpvoteById",
      contentType: "application/json; charset=utf-8",
      dataType: "text",
      data: JSON.stringify(voteObj),
      async: true,
      success: function(res) {
        post.siblings(".votes").html(res).removeClass("upvoted");
        if(post.hasClass("upvote")) {
          post.removeClass("upvoted");
        } else {
          post.siblings(".upvote").removeClass("upvoted");
        }
      },
      error: function(err) {
        Materialize.toast("Error while undoing upvote. Please try again", 4000);
      }
    });
  };

  function downvote(postId, userId, post) {
    var voteObj = {
      userId: userId,
      postId: postId
    };

    $.ajax({
      type: "POST",
      url: "/downvotePostById",
      contentType: "application/json; charset=utf-8",
      dataType: "text",
      data: JSON.stringify(voteObj),
      async: true,
      success: function(res) {
        post.siblings(".votes").html(res).addClass("downvoted");
        if(post.hasClass("downvote")) {
          post.addClass("downvoted");
        } else {
          post.siblings(".downvote").addClass("downvoted");
        }
      },
      error: function(err) {
        Materialize.toast("Error while downvoting post. Please try again", 4000);
      }
    });
  };

  function undoDownvote(postId, userId, post) {
    var voteObj = {
      userId: userId,
      postId: postId
    };

    $.ajax({
      type: "POST",
      url: "/undoDownvoteById",
      contentType: "application/json; charset=utf-8",
      dataType: "text",
      data: JSON.stringify(voteObj),
      async: true,
      success: function(res) {
        post.siblings(".votes").html(res).removeClass("downvoted");
        if(post.hasClass("downvote")) {
          post.removeClass("downvoted");
        } else {
          post.siblings(".downvote").removeClass("downvoted");
        }
      },
      error: function(err) {
        Materialize.toast("Error while undoing downvote. Please try again", 4000);
      }
    });
  };

  $(".logoutBtn").on("click", function() {
    localStorage.removeItem("user");
    location.href="./";
  });

  $(".comment-reply").click(function(e) {
    var input = $(this).parent().prev().children("input");
    var postId = $(this).parents("li.post").attr("data-post-id");
    var newComment = input.val();
    var self = $(this);

    if(newComment.length === 0) {
      Materialize.toast("Please enter some text to comment!", 4000);
      return;
    };

    var commentObj = {
      id: postId,
      newComment: {
        author: USER.username,
        msg: newComment
      }
    };

    $.ajax({
      type: "POST",
      url: "/postComment",
      contentType: "application/json; charset=utf-8",
      dataType: "text",
      data: JSON.stringify(commentObj),
      async: true,
      success: function(res) {
        var comments = self.parent().parent().parent().prev();
        comments.append("<blockquote><span class='vac-go-comment-author'>" + USER.username + ":</span> " + newComment + "</blockquote>");
        input.val("");
      },
      error: function(err) {
        Materialize.toast("Failed to add comment, please try again!", 5000);
      }
    });
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

  $(".upvote").click(function(e) {
    e.stopPropagation();

    var post = $(this);
    var postId = post.parents("li.post").attr("data-post-id");

    $.ajax({
      type: "POST",
      url: "/getVotersById",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({id: postId}),
      async: true,
      success: function(res) {
        if(res.downvoters.indexOf(USER.id) > -1) {
          undoDownvote(postId, USER.id, post);
        }

        if (res.upvoters.indexOf(USER.id) > -1) {
          undoUpvote(postId, USER.id, post);
        } else {
          upvote(postId, USER.id, post);
        }
      },
      error: function(err) {
        console.log(err);
      }
    });

  });

  $(".downvote").click(function(e) {
    e.stopPropagation();

    var post   = $(this);
    var postId = post.parents("li.post").attr("data-post-id");

    $.ajax({
      type: "POST",
      url: "/getVotersById",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({id: postId}),
      async: true,
      success: function(res) {
        if(res.upvoters.indexOf(USER.id) > -1) {
          undoUpvote(postId, USER.id, post);
        }

        if (res.downvoters.indexOf(USER.id) > -1) {
          undoDownvote(postId, USER.id, post);
        } else {
          downvote(postId, USER.id, post);
        }
      },
      error: function(err) {
        console.log(err);
      }
    });
  });
});
