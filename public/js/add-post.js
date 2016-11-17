var courseIndex = 0;
var activityIndex = 0;
var majors, depts = {};

function getCourseCode(courseTitle) {
  return courseTitle.substr(0, courseTitle.indexOf(' -'));
};

function addCourse() {
  var newCourseRow = $("#course-template").clone()
                                          .removeClass('hide')
                                          .removeAttr('id')
                                          .attr("data-course-index", courseIndex);

  newCourseRow
    .find('input[type="text"]').attr({'data-course-index': courseIndex,
                                      'id': "course-dept-" + courseIndex}).end()
    .find('label.course-dept').attr('for', "course-dept-" + courseIndex).end()
    .find('select').attr('id', 'course-select-' + courseIndex).end();

  $("#courses").append(newCourseRow);
  $("#course-select-" + courseIndex).material_select();

  courseIndex++;
};

function addActivity() {
  var newActivityRow = $("#activity-template").clone()
                                              .removeClass('hide')
                                              .removeAttr('id')
                                              .attr("data-activity-index", activityIndex);

  newActivityRow
    .find('input[type="text"]').attr({'data-activity-index': activityIndex,
                                      'id': "activity-name-" + activityIndex}).end()
    .find('label.activity-name').attr('for',"activity-name-" + activityIndex).end()
    .find('input[type="number"]').attr('id', "activity-time-" + activityIndex).end()
    .find('label.activity-time').attr('for', "activity-time-" + activityIndex).end();

  $("#activities").append(newActivityRow);

  activityIndex++;
};

$(document).ready(function() {
  var USER = JSON.parse(localStorage.getItem("user"));

  if(!USER) {
    location.href = "./";
  } else {
    $("#username").html(USER.username);
  }

  $.get('/getMajorsFile', function(res) {
    majors = res.majors;

    for(var major in majors) {
      depts[major] = null;
    }
  });

  $("#add-post-form")
    .on('input propertychange', '.depts', function updateCourseSelect() {
      var deptQuery = $(this).val();
      var disableState = deptQuery.length ? null : "disabled";
      var rowNum = $(this).attr('data-course-index');
      var siblingSelect = "#course-select-" + rowNum;
      var courses = majors[deptQuery.toUpperCase()];

      $(siblingSelect).attr("disabled", disableState);
      $(siblingSelect).prev('input').attr("disabled", disableState);
      $(siblingSelect).empty().html('');

      if(!courses) {
        $(siblingSelect).append(
          $("<option></option>").attr("disabled", "disabled").text("No Courses Found for '" + deptQuery + "'")
        );
      } else {
        $(siblingSelect).append(
          $("<option></option>").attr({"disabled": "disabled", "selected": "selected"}).text("Select a Course")
        );
        for(var course in courses) {
          $(siblingSelect).append(
            $("<option></option>").attr("value", getCourseCode(courses[course])).text(courses[course])
          );
        }
      }

      $(siblingSelect).material_select();
    })
    .on('click', '.removeCourse', function removeCourse() {
      $(this).parents('.row.course').remove();
    })
    .on('click', '.removeActivity', function removeActivity() {
      $(this).parents('.row.activity').remove();
    });

    $("#submit-post").on('click', function submitPost() {
      var post        = {}, postCourses = [];
      var selQuarter  = $("input[name='quarter']:checked").attr("id");
      var selQtrIcon  = null;
      var courses     = $("#courses").children();
      var activities  = $("#activities").children();
      var postBody    = $("#post-body");
      var errors      = false;

      if(!selQuarter) {
        Materialize.toast("Please select a quarter!", 4000);
        errors = true;
      }

      if(!courses.length && !activities.length) {
        Materialize.toast("Please add at least one course or activity!", 4025);
        errors = true;
      }

      if(!postBody.val().length) {
        Materialize.toast("Please explain your course plan in the post body section!", 4050);
        errors = true;
      }

      if(errors) return;

      switch(selQuarter) {
        case "fall":
          selQuarter = "Fall";
          selQtrIcon = "nature_people";
          break;
        case "winter":
          selQuarter = "Winter";
          selQtrIcon = "ac_unit";
          break;
        case "spring":
          selQuarter = "Spring";
          selQtrIcon = "local_florist";
          break;
        case "summer":
          selQuarter = "Summer";
          selQtrIcon = "wb_sunny";
          break;
      }

      for(var course of courses) {
        cIndex = course.getAttribute("data-course-index");
        cName = $("#course-dept-" + cIndex).val();
        cCourse = $("#course-select-" + cIndex).val();
        if(!cName || !cCourse) {
          errors = true;
        } else {
          postCourses.push({
            type: "course",
            courseName: cName + " " + cCourse
          });
        }
      }

      if(errors) {
        Materialize.toast("One or more courses is not correctly filled in!", 4000);
        return;
      }

      for(var activity of activities) {
        aIndex = activity.getAttribute("data-activity-index");
        aName = $("#activity-name-" + aIndex).val();
        aTime = $("#activity-time-" + aIndex).val();
        if(!aName || !aTime) {
          errors = true;
        } else {
          postCourses.push({
            type: "activity",
            activityName: aName,
            activityTime: "+" + aTime
          });
        }
      }

      if(errors) {
        Materialize.toast("One or more activities is not correctly filled in!", 4000);
        return;
      }

      post = {
        date: Date.now(),
        quarter: selQuarter,
        quarterIcon: selQtrIcon,
        courses: postCourses,
        votes: 0,
        upvoters: [],
        downvoters: [],
        author: USER.username,
        body: postBody.val(),
        comments: []
      }

      $.ajax({
        type: "POST",
        url: "/addNewPost",
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        data: JSON.stringify(post),
        async: true,
        success: function(res) {
          location.href="./signed-in";
        },
        error: function(err) {
          Materialize.toast("Error while submitting post!", 5000);
          console.log(err);
        }
      });
    });

    $(".logoutBtn").on("click", function() {
      localStorage.removeItem("user");
      location.href="./";
    });
});
