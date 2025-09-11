const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const { jwtAuth } = require("../../middlewares/midddlewares");
const router = express.Router();
const bcrypt = require("bcrypt");

router.get("/", jwtAuth, (req, res) => {
  if (req.user) {
    res.render("Error.ejs", { error: "لقد قمت بتسجيل الدخول" });
  } else res.render("auth/login.ejs", { error: "" });
});

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  //checking if email exists
  const user = await User.findOne({ email: email });
  if (user) {
    //checking the password
    let result = bcrypt.compareSync(password, user.password);

    if (result) {
      const info = {
        id: user.id,
        name: user.name,
        role: user.role,
        courses: user.courses,
      };
      const refreash = {
        id: user.id,
      };
      //genetating access token
      const token = jwt.sign(info, process.env.MY_SECRET);
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 60 * 1000),
      });

      //generate refreash token
      const refreshToken = jwt.sign(refreash, process.env.REFREASH);
      res.cookie("refreash", refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      return res.redirect("/profile");
    } else {
      return res.render("auth/login.ejs", { error: "هناك خطا في كلمة السر " });
    }
  }
  return res.render("auth/login.ejs", {
    error: "هناك خطا في كلمة السر او الاميل",
  });
});
module.exports = router;
