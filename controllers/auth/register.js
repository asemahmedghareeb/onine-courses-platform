const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const { checkuser } = require("../../middlewares/midddlewares");
router.get("/", (req, res) => {
  const token = req.cookies.token;
  if (token || req.user) {
    res.render("Error.ejs", { error: " لديك حساب بالفعل" });
  } else {
    res.render("auth/register.ejs", { error: "" });
  }
});

module.exports = router;
