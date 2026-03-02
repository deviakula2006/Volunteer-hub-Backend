

const supabase = require("../config/supabaseClient");

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Get applications
    const { data: applicationsData, error: appError } = await supabase
      .from("applications")
      .select("status")
      .eq("volunteer_id", userId);

    if (appError) {
      return res.status(400).json({ error: appError.message });
    }

    const applications = applicationsData.length;

    const activities = applicationsData.filter(
      (a) => a.status === "completed"
    ).length;

    const upcoming = applicationsData.filter(
      (a) => a.status === "selected"
    ).length;

    // 2️⃣ Get hours
    const { data: hoursData, error: hoursError } = await supabase
      .from("volunteer_hours")
      .select("hours_logged")
      .eq("volunteer_id", userId);

    if (hoursError) {
      return res.status(400).json({ error: hoursError.message });
    }

    const hours = hoursData.reduce(
      (sum, h) => sum + h.hours_logged,
      0
    );

    res.json({
      hours,
      activities,
      upcoming,
      applications,
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};