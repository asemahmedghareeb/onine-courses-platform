const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const Lesson = require("../models/lesson");
require("dotenv").config();

router.use(express.static("public"));
const {
  checkuser,
  adminOnly,
  userOnly,
} = require("../middlewares/midddlewares");
router.get("/", async (req, res) => {
  const courses = await Course.find();
  res.render("courses.ejs", { courses: courses });
});

router.get("/howToBuy", async (req, res) => {
  const courses = await Course.find();
  res.render("howToBuy.ejs", { courses: courses });
});

router.use(checkuser);


router.get("/", async (req, res) => {
  const courses = await Course.find();

  res.render("courses.ejs", { courses: courses });
}); 

router.use(adminOnly);
router.get("/dashboard", async (req, res) => {
  try {
    const courses = await Course.find();
    res.render("dashboards/coursesDashboard.ejs", { courses: courses });
  } catch (err) {
    res.send({ error: err });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    let lessons = await Lesson.deleteMany({ course: req.params.id });
  } catch (err) {
    res.send({ error: err });
  }
  res.redirect("/courses/dashboard");
});

router.get("/update/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.render("updatecourse.ejs", { course: course });
  } catch (err) {
    res.send({ error: err });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    course.title = req.body.title;
    course.description = req.body.description;
    course.price = req.body.price;
    await course.save();
  } catch (err) {
    res.send({ error: err });
  }
  res.redirect("/courses/dashboard");
});

router.post("/new", async (req, res) => {
  try {
    const course = new Course({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price * 100,
    });
    await course.save();
  } catch (err) {
    res.send({ error: err });
  }
  res.redirect("/courses/dashboard");
});
module.exports = router;
