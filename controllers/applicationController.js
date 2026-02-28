const supabase = require("../config/supabaseClient");

exports.apply = async (req, res) => {
  try {
    const { opportunity_id } = req.body;
    const volunteer_id = req.user.id;

    if (!opportunity_id) {
      return res.status(400).json({
        error: "Opportunity ID is required"
      });
    }

    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("opportunity_id", opportunity_id)
      .eq("volunteer_id", volunteer_id);

    if (existing.length > 0) {
      return res.status(400).json({
        error: "You already applied"
      });
    }

    const { error } = await supabase
      .from("applications")
      .insert([{ opportunity_id, volunteer_id }]);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      message: "Applied successfully"
    });

  } catch (err) {
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("applications")
      .select(`
        id,
        status,
        applied_at,
        opportunities ( title, location, date ),
        profiles ( email, role )
      `);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Status updated"
    });

  } catch (err) {
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};