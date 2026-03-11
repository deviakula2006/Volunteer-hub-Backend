const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/authMiddleware");
const { getEvents } = require("../controllers/calendarController");

router.get("/", verifyUser, getEvents);

module.exports = router;
