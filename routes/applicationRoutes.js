const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/authMiddleware");
const applicationController = require("../controllers/applicationController");
const dashboardController = require("../controllers/dashboardController");



router.post("/", verifyUser, applicationController.apply);
router.get("/my", verifyUser, applicationController.getMyApplications);
router.put("/:id", verifyUser, applicationController.updateStatus);
router.get("/organization", verifyUser, applicationController.getOrganizationApplications);
module.exports = router;