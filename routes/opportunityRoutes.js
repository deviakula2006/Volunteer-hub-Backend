const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/authMiddleware");
const opportunityController = require("../controllers/opportunityController");

router.post("/", verifyUser, opportunityController.createOpportunity);
router.get("/", opportunityController.getOpportunities);

module.exports = router;