const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/authMiddleware");
const hoursController = require("../controllers/hoursController");

router.post("/", verifyUser, hoursController.logHours);
router.get("/my", verifyUser, hoursController.getMyHours);

module.exports = router;