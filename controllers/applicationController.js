const supabase = require("../config/supabaseClient");

const apply = async (req, res) => {
  try {
    const { opportunity_id } = req.body;

    if (!opportunity_id)
      return res.status(400).json({ error: "Opportunity ID required" });

    const { error } = await supabase.from("applications").insert([
      {
        opportunity_id,
        volunteer_id: req.user.id,
        status: "applied"
      },
    ]);

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ message: "Applied successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("applications")
      .select("*, opportunities(*)")
      .eq("volunteer_id", req.user.id);

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status)
      return res.status(400).json({ error: "Status required" });

    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id);

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Status updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const getOrganizationApplications = async (req, res) => {
  try {
    if (req.user.role !== "organization") {
      return res.status(403).json({ error: "Only organizations allowed" });
    }

    const { data, error } = await supabase
      .from("applications")
      .select(`
        id,
        status,
        applied_at,
        volunteer:volunteer_id (
          id,
          email
        ),
        opportunity:opportunity_id (
          id,
          title,
          location,
          start_date,
          end_date,
          organizer_id
        )
      `)
      .eq("opportunity.organizer_id", req.user.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  apply,
  getMyApplications,
  updateStatus,
  getOrganizationApplications
};