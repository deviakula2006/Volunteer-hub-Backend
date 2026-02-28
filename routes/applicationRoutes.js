const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/authMiddleware");
const applicationController = require("../controllers/applicationController");

// Apply to opportunity
router.post("/", verifyUser, applicationController.apply);

// Get all applications
router.get("/", applicationController.getApplications);

// Update application status
router.put("/:id", applicationController.updateStatus);

module.exports = router;