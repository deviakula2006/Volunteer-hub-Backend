const express = require("express");
const router = express.Router();
const opportunityController = require("../controllers/opportunityController");
const verifyUser = require("../middleware/authMiddleware");

router.post("/", verifyUser, opportunityController.createOpportunity);
router.get("/", opportunityController.getOpportunities);
router.put("/:id", verifyUser, opportunityController.updateOpportunity);
router.delete("/:id", verifyUser, opportunityController.deleteOpportunity);

module.exports = router;