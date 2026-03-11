const express = require("express");
const router = express.Router();
const { addReview, getReviews } = require("../controllers/reviewController");
const verifyUser = require("../middleware/authMiddleware");

router.get("/", verifyUser, getReviews);
router.post("/", verifyUser, addReview);

module.exports = router;