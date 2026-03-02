const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/authMiddleware");

let reviews = [];

router.get("/", verifyUser, (req, res) => {
  const myReviews = reviews.filter(
    (r) => r.userId === req.user.id
  );
  res.json(myReviews);
});

router.post("/", verifyUser, (req, res) => {
  const { rating, comment } = req.body;

  const newReview = {
    id: Date.now(),
    userId: req.user.id,
    rating,
    comment,
  };

  reviews.push(newReview);

  res.json({ message: "Review added successfully" });
});

module.exports = router;