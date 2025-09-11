const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Course = require("../models/course");
router.use(express.static("public"));
const bcrypt = require("bcrypt");
const {
  checkuser,
  adminOnly,
  userOnly,
} = require("../middlewares/midddlewares");

router.post("/new", async (req, res) => {
  const { name, password, email, number } = req.body;
  if (await isEmailDoublicatedOrNot(email)) {
    return res.render("Error.ejs", {
      error: "الاميل الذي ادخلته مستخدم من قبل",
    });
  }

  let hashedPass = await bcrypt.hash(password, 10);

  const user = new User({
    name: name,
    email: email,
    password: hashedPass,
    phone_number: number,
  });

  await user.save();
  if (req.user) {
    if (req.user.role === "admin") return res.redirect("/users");
    res.redirect("/logout");
  } else res.redirect("/login");
});

router.use(checkuser);

router.get("/newCourse/:id", userOnly, async (req, res) => {
  const user = req.user;
  const course = await Course.findById(req.params.id);

  await User.updateOne(
    { name: user.name },
    { $push: { courses: course.title } }
  ).catch((err) => {
    console.error(err);
  });
  req.user.courses.push(course.title);

  res.redirect("/profile");
});

router.use(adminOnly);

//get all users
router.get("/", async (req, res) => {
  const Users = await User.find();
  const names = await Course.find({}, "title");
  res.render("dashboards/usersDashboard.ejs", { users: Users, names: names });
});

//delete user
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect("/users/");
});

async function isEmailDoublicatedOrNot(email) {
  const user = await User.findOne({ email: email });
  if (user) {
    console.log("doublicated");
    return true;
  }
  return false;
}

//get update page
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  const courses = await Course.find();
  res.render("updateUser.ejs", {
    id: req.params.id,
    user: user,
    courses: courses,
  });
});

//update user information
router.patch("/:id", async (req, res) => {
  const { name, password, email, role, course } = req.body;
  const user = await User.findById(req.params.id);
  user.name = name;
  user.email = email;
  user.password = password;
  user.role = role;
  user.courses.push(course);
  await user.save();

  res.redirect("/users/");
});

router.post("/addCourse/:id", userOnly, async (req, res) => {
  const user = req.user;
  const course = await Course.findById(req.params.id);
  await User.updateOne(
    { name: user.name },
    { $push: { courses: course.title } }
  ).catch((err) => {
    console.error(err);
  });

  res.redirect("/users/");
});
module.exports = router;
