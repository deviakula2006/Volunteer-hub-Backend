const express = require("express");
const router = express.Router();
const { postAnnouncement, getGroupAnnouncements } = require("../controllers/messageController");
const verifyUser = require("../middleware/authMiddleware");

// Group-specific announcements
router.post("/group/:groupId", verifyUser, postAnnouncement);
router.get("/group/:groupId", verifyUser, getGroupAnnouncements);

module.exports = router;
