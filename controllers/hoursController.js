const supabase = require("../config/supabaseClient");

const logHours = async (req, res) => {
  try {
    const { opportunity_id, hours_logged } = req.body;

    const { error } = await supabase
      .from("volunteer_hours")
      .upsert(
        {
          opportunity_id,
          volunteer_id: req.user.id,
          hours_logged,
        },
        { onConflict: "opportunity_id,volunteer_id" }
      );

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Hours logged" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMyHours = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("volunteer_hours")
      .select("*")
      .eq("volunteer_id", req.user.id);

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  logHours,
  getMyHours,
};