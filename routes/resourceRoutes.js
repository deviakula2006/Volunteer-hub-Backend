const express = require("express");
const router = express.Router();
const { getResources, addResource } = require("../controllers/resourceController");
const verifyUser = require("../middleware/authMiddleware");

// Anyone logged in can see and add resources
router.get("/", verifyUser, getResources);
router.post("/", verifyUser, addResource);

module.exports = router;
