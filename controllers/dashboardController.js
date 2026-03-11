

const supabase = require("../config/supabaseClient");

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Get applications
    const { data: applicationsData, error: appError } = await supabase
      .from("applications")
      .select(`
        status,
        opportunity:opportunities!opportunity_id(organizer_id)
      `)
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

    const completedApps = applicationsData.filter(
      (a) => a.status === "completed"
    );

    const orgs = new Set();
    completedApps.forEach(a => {
      const orgId = a.opportunity?.organizer_id || (Array.isArray(a.opportunity) && a.opportunity[0]?.organizer_id);
      if (orgId) {
        orgs.add(orgId);
      }
    });
    const uniqueOrgs = orgs.size;

    // 2️⃣ Get total volunteer hours
    const { data: hoursData, error: hoursError } = await supabase
      .from("volunteer_hours")
      .select("hours_logged")
      .eq("volunteer_id", userId);

    if (hoursError) {
      return res.status(400).json({ error: hoursError.message });
    }

    const totalHours = hoursData?.reduce((sum, h) => sum + (h.hours_logged || 0), 0) || 0;

    res.json({
      hours: totalHours,
      activities,
      upcoming,
      applications,
      uniqueOrgs
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};