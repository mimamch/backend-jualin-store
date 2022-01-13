var express = require("express");
var router = express.Router();
const {
  view_signin,
  actionSignin,
  actionLogout,
  view_profile,
  edit_profile,
} = require("./controller");

/* GET home page. */
router.get("/", view_signin);
router.post("/", actionSignin);
router.use("/logout", actionLogout);
router.get("/profile", view_profile);
router.put("/profile", edit_profile);

module.exports = router;
