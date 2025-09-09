require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const { jwtAuth } = require("./middlewares/midddlewares");
const Course = require("./models/course");
const { globalLimiter, authLimiter } = require("./config/rateLimiter");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(cookieParser());

app.use(globalLimiter);

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

app.use("/login", authLimiter, loginRouter);
app.use("/register", authLimiter, registerRouter);
app.use("/profile", jwtAuth, profileRouter);
app.use("/courses", jwtAuth, coursesRouter);
app.use("/lessons", jwtAuth, lessonsRouter);
app.use("/users", jwtAuth, usersRouter);
app.get("/howToBuy", async (req, res, next) => {
  try {
    const courses = await Course.find();
    res.render("howToBuy.ejs", { courses: courses });
  } catch (error) {
    next(error);
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreash");
  res.redirect("/login");
});

// Custom Error Class
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// 404 Handler
app.use((req, res, next) => {
  res.render("Error.ejs", {
    error: `404 Not found resouce => ${req.originalUrl} on this server!`,
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // For production, don't leak error details
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      console.error("ERROR ", err);
      res.status(500).json({
        status: "error",
        message: err.message,
        // message: "Something went very wrong!",
      });
    }
  }
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!  Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!  Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

let server;
connectDB().then(() => {
  server = app.listen(process.env.PORT || 3000, () => {
    console.log(
      `server is running on port http://localhost:${process.env.PORT}`
    );
  });
});
