const supabase = require("../config/supabaseClient");

exports.addReview = async (req, res) => {
  const { opportunity_id, type, comment } = req.body;

  if (!opportunity_id || !type || !comment) {
    return res.status(400).json({ error: "Opportunity ID, type, and comment are required." });
  }

  const validTypes = ['positive', 'negative', 'neutral'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: "Type must be 'positive', 'negative', or 'neutral'." });
  }

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

exports.getReviews = async (req, res) => {
  const { data, error } = await supabase
    .from("reviews")
    .select(`*, volunteer:profiles!volunteer_id(email), opportunity:opportunities!opportunity_id(title, organizer_id)`)
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
};