const supabase = require("../config/supabaseClient");

exports.postAnnouncement = async (req, res) => {
  const { groupId } = req.params;
  const { content } = req.body;

  if (!groupId || !content) {
    return res.status(400).json({ error: "Group ID and content are required." });
  }

  try {
    // Verify user is an accepted member of the group
    const { data: membership } = await supabase
      .from("group_members")
      .select("status")
      .match({ group_id: groupId, user_id: req.user.id })
      .single();

    if (!membership || membership.status !== "accepted") {
      return res.status(403).json({ error: "Only accepted group members can post announcements." });
    }

    const { error } = await supabase.from("announcements").insert([
      {
        group_id: groupId,
        sender_id: req.user.id,
        content,
      },
    ]);

    if (error) throw error;
    res.json({ message: "Announcement posted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getGroupAnnouncements = async (req, res) => {
  const { groupId } = req.params;

  try {
    // Verify membership
    const { data: membership } = await supabase
      .from("group_members")
      .select("status")
      .match({ group_id: groupId, user_id: req.user.id })
      .single();

    if (!membership || membership.status !== "accepted") {
      return res.status(403).json({ error: "Only group members can view announcements." });
    }

    const { data, error } = await supabase
      .from("announcements")
      .select(`
        id,
        content,
        created_at,
        sender_id,
        sender:profiles!sender_id(id, email)
      `)
      .eq("group_id", groupId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
