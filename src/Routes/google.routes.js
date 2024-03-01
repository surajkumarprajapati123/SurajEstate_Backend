const express = require("express");
const { GoogleController } = require("../controller");

const router = express.Router();

router.route("/google").post(GoogleController.google);

module.exports = router;
