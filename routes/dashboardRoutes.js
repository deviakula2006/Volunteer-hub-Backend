const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/authMiddleware");
const dashboardController = require("../controllers/dashboardController");

router.get("/dashboard-stats", verifyUser, dashboardController.getDashboardStats);

module.exports = router;