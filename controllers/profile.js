const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const User = require("../models/user");
const Lesson = require("../models/lesson");
const { userOnly, checkuser } = require("../middlewares/midddlewares");

router.use(checkuser);
router.get("/", async (req, res) => {
  if (req.user) {
    if (req.user.role === "admin") {
      return res.render("profiles/adminProfile.ejs", { name: req.user.name });
    } else if (req.user.role === "user") {
      let user = await User.findById(req.user.id);
      let userCourses = user.courses;
      console.log(userCourses);
      req.user.courses = userCourses;
      const courses = await Course.find({ title: { $in: userCourses } });
      console.log(courses);
      return res.render("profiles/userProfile.ejs", {
        name: req.user.name,
        courses: courses, 
      });
    }
  }
  res.redirect("/login");
  // res.render('Error.ejs',{error:"قم بتسجيل الدخول"})
});

router.get("/:id", userOnly, async (req, res) => {
  let Id = req.params.id;
  //getting the title to view on the lessons page
  const course = await Course.findById(Id);
  title = course.title;
  //getting all the lessons
  const Lessons = await Lesson.find({ course: Id }).sort({ lessonNumber: 1 });
  res.render("userLessons.ejs", { lessons: Lessons, id: Id, title: title });
});

module.exports = router;