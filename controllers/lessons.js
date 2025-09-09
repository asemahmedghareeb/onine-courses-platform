const express = require("express");
const router = express.Router();
const Lesson = require("../models/lesson");
const Course = require("../models/course");

const path = require("path");
router.use(express.static("public"));
const {
  checkuser,
  adminOnly,
  adminAndUser,
} = require("../middlewares/midddlewares");

const { upload } = require("../config/multer");
const { uploadToCloudinary, cloudinary } = require("../config/cloudinary");
const { render } = require("ejs");

router.get("/lesson/:id", adminAndUser, async (req, res) => {
  let Id = req.params.id;
  //getting the title to view on the lessons page
  const lesson = await Lesson.findById(Id);

  res.render("lesson_vid_page.ejs", { lesson: lesson });
});

//read
//this id is course id
router.get("/show/:id", async (req, res) => {
  let Id = req.params.id;
  //getting the title to view on the lessons page
  const course = await Course.findById(Id);
  title = course.title;

  //getting all the lessons
  let Lessons = await Lesson.find({ course: Id }).sort({ createdAt: 1 });
  res.render("lessons.ejs", { lessons: Lessons, id: Id, title: title });
});

router.use(checkuser);
router.use(adminOnly);

router.get("/lessonUpload/:id", async (req, res) => {
  let Id = req.params.id;

  //getting the title to view on the lessons page
  const lesson = await Lesson.findById(Id);

  res.render("dashboards/lesson_vid_upload.ejs", { lesson: lesson });
});

router.post("/upload/:id", upload.single("file"), async (req, res) => {
  // try {
  const file = req.file;

  const result = await uploadToCloudinary({
    file: file,
    folder: "platform",
  });
  if (!result.url) {
    // return res.redirect(`/lessons/lessonUpload/${req.params.id}`);
    return res.render("Error.ejs", { error: "حدث خطأ أثناء رفع الفيديو" });
  }
  const lesson = await Lesson.findById(req.params.id);
  lesson.video = result.url;
  lesson.publicId = result.publicId;
  await lesson.save();

  return res.json({
    status: "success",
    message: file.name,
    url: result.url,
  });
  // } catch (err) {
  //   console.log(err.message);
  // }
});

router.get("/:id", async (req, res) => {
  let Id = req.params.id;
  //getting the title to view on the lessons page
  const course = await Course.findById(Id);
  title = course.title;
  //getting all the lessons
  const Lessons = await Lesson.find({ course: Id }).sort({ lessonNumber: 1 });
  res.render("dashboards/course_lessons.ejs", {
    lessons: Lessons,
    id: Id,
    title: title,
  });
});

//delete
//this id is lesson id
router.delete("/delete/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    let course = lesson.course;
    let courseId = course.toString();

    await cloudinary.v2.uploader
      .destroy({ public_id: lesson.publicId })
      .catch((err) => {
        console.log(err);
      });
    res.redirect(`/lessons/${courseId}`);
  } catch (error) {
    console.log(error);
    res.render("Error.ejs", { error: "حدث خطأ أثناء حذف الفيديو" });
  }
});

//create
//this is course id
router.post("/new/:id", async (req, res) => {
  let Id = req.params.id;

  const lesson = new Lesson({
    title: req.body.title,
    course: Id,
    lessonNumber: req.body.lessonNumber,
  });
  await lesson.save();

  res.redirect(`/lessons/lessonUpload/${lesson.id}`);
});

module.exports = router;
