const supabase = require("../config/supabaseClient");

exports.addReview = async (req, res) => {
  const { opportunity_id, type, comment } = req.body;

  const { error } = await supabase.from("reviews").insert([
    {
      opportunity_id,
      volunteer_id: req.user.id,
      type,
      comment,
    },
  ]);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Review added" });
};