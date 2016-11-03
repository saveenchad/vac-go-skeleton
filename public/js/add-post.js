var courseIndex = 0;
var activityIndex = 0;
var majors, depts = {};

function getCourseCode(courseTitle) {
  return courseTitle.substr(0, courseTitle.indexOf(' -'));
};

function addCourse() {
  var newCourseRow = $("#course-template").clone()
                                          .removeClass('hide')
                                          .removeAttr('id');

  newCourseRow
    .find('input[type="text"]').attr({'data-course-index': courseIndex,
                                      'id': "course-dept-" + courseIndex}).end()
    .find('label.course-dept').attr('for', "course-dept-" + courseIndex).end()
    .find('select').attr('id', 'course-select-' + courseIndex).end();

  $("#courses").append(newCourseRow);

  $("#course-dept-" + courseIndex).autocomplete({
    data: depts
  });
  $("#course-select-" + courseIndex).material_select();

  courseIndex++;
};

function addActivity() {
  var newActivityRow = $("#activity-template").clone()
                                              .removeClass('hide')
                                              .removeAttr('id');

  newActivityRow
    .find('input[type="text"]').attr({'data-activity-index': activityIndex,
                                      'id': "activity-name-" + activityIndex}).end()
    .find('label.activity-name').attr('for',"activity-name-" + activityIndex).end()
    .find('input[type="number"]').attr('id', "activity-time-" + activityIndex).end()
    .find('label.activity-time').attr('for', "activity-time-" + activityIndex).end();

  activityIndex++;

  $("#activities").append(newActivityRow);
};

$(document).ready(function() {
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

      $(siblingSelect).material_select('destroy');
      $(siblingSelect).material_select();
    })
    .on('click', '.removeCourse', function removeCourse() {
      $(this).parents('.row.course').remove();
    })
    .on('click', '.removeActivity', function removeActivity() {
      $(this).parents('.row.activity').remove();
    });
});
