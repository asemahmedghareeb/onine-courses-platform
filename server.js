require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const { jwtAuth } = require("./middlewares/midddlewares");
const Course = require("./models/course");
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(cookieParser());

const loginRouter = require("./controllers/auth/login");
const registerRouter = require("./controllers/auth/register");
const coursesRouter = require("./controllers/courses");
const lessonsRouter = require("./controllers/lessons");
const profileRouter = require("./controllers/profile");
const usersRouter = require("./controllers/users");

const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.CONN);
    console.log(`connected to DB`);
  } catch (err) {
    console.log("Error connecting to database");
    console.log(err);
    process.exit(1);
  }
};

app.get("/", jwtAuth, (req, res) => {
  res.render("home.ejs");
});

app.use("/login", loginRouter);
app.use("/profile", jwtAuth, profileRouter);
app.use("/register", registerRouter);
app.use("/courses", jwtAuth, coursesRouter);
app.use("/lessons", jwtAuth, lessonsRouter);
app.use("/users", jwtAuth, usersRouter);
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreash");
  res.redirect("/login");
}); 
app.get("/howToBuy", async (req, res) => {
  const courses = await Course.find();
  res.render("howToBuy.ejs", { courses: courses });
});

connectDB().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`server is running on port http://localhost:${process.env.PORT}`);
  });
});
  