const supabase = require("../config/supabaseClient");

exports.createOpportunity = async (req, res) => {
  if (req.user.role !== "organization")
    return res.status(403).json({ error: "Only organizations allowed" });

  const {
    title,
    description,
    location,
    start_date,
    end_date,
    max_hours,
  } = req.body;

  const { error } = await supabase.from("opportunities").insert([
    {
      title,
      description,
      location,
      start_date,
      end_date,
      max_hours,
      organizer_id: req.user.id,
    },
  ]);

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({ message: "Opportunity created" });
};

exports.getOpportunities = async (_, res) => {
  const { data, error } = await supabase
    .from("opportunities")
    .select("*");

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
};