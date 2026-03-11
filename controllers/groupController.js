const supabase = require("../config/supabaseClient");
const emailService = require("../services/emailService");

exports.createGroup = async (req, res) => {
    const { opportunity_id, name } = req.body;

    if (!opportunity_id || !name) {
        return res.status(400).json({ error: "Opportunity ID and Group Name are required" });
    }

    // Insert group
    const { data: groupData, error } = await supabase.from("group_events").insert([
        {
            opportunity_id,
            organizer_id: req.user.id,
            name,
        },
    ]).select().single();

    if (error) return res.status(400).json({ error: error.message });

    // Add the organizer as an accepted member
    await supabase.from("group_members").insert([
        { group_id: groupData.id, user_id: req.user.id, status: 'accepted' }
    ]);

    res.status(201).json({ message: "Group created", group: groupData });
};

exports.getMyGroups = async (req, res) => {
    // Fetch groups where the user is a member
    const { data: memberData, error: memError } = await supabase
        .from("group_members")
        .select(`
      status,
      group:group_events!group_id (
        id,
        name,
        opportunity_id,
        organizer_id,
        opportunities:opportunities!opportunity_id (title, location)
      )
    `)
        .eq("user_id", req.user.id);

    if (memError) return res.status(400).json({ error: memError.message });

    res.json(memberData);
};

exports.inviteMember = async (req, res) => {
    const { groupId } = req.params;
    const { invitee_email } = req.body;

    if (!invitee_email) {
        return res.status(400).json({ error: "Email is required" });
    }

    // Fetch group name
    const { data: groupData } = await supabase
        .from("group_events")
        .select("name")
        .eq("id", groupId)
        .single();

    const groupName = groupData ? groupData.name : "Volunteer Group";

    // Find user by email
    const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", invitee_email)
        .single();

    let inviteLink = "";
    let isNewUser = false;

    if (userData) {
        // User exists, try to add to group_members
        const { error: inviteError } = await supabase.from("group_members").insert([
            { group_id: groupId, user_id: userData.id, status: 'pending' }
        ]);

        // Even if they are already invited/member, we can still re-send the email
        inviteLink = `${process.env.FRONTEND_URL}/groups/join/${groupId}`;
        isNewUser = false;
    } else {
        // New user
        inviteLink = `${process.env.FRONTEND_URL}/register?joinGroup=${groupId}`;
        isNewUser = true;
    }

    const emailSent = await emailService.sendGroupInvite(invitee_email, groupName, inviteLink, isNewUser);

    if (!emailSent) {
        return res.status(500).json({ error: "Failed to send invitation email" });
    }

    res.json({ message: "Invitation sent successfully" });
};

exports.respondToInvite = async (req, res) => {
    const { groupId } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'

    if (status !== 'accepted' && status !== 'rejected') {
        return res.status(400).json({ error: "Invalid status" });
    }

    if (status === 'rejected') {
        // Delete the membership
        const { error } = await supabase
            .from("group_members")
            .delete()
            .match({ group_id: groupId, user_id: req.user.id });
        if (error) return res.status(400).json({ error: error.message });
    } else {
        // Update status to accepted
        const { error } = await supabase
            .from("group_members")
            .update({ status: 'accepted' })
            .match({ group_id: groupId, user_id: req.user.id });
        if (error) return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Response recorded" });
};

exports.getPublicGroups = async (req, res) => {
    try {
        // Fetch groups where the user is NOT already a member
        // First get user's group IDs
        const { data: userGroups } = await supabase
            .from("group_members")
            .select("group_id")
            .eq("user_id", req.user.id);

        const joinedGroupIds = userGroups?.map(g => g.group_id) || [];

        let query = supabase
            .from("group_events")
            .select(`
                *,
                opportunities:opportunities!opportunity_id (title, location)
            `);

        if (joinedGroupIds.length > 0) {
            query = query.not("id", "in", `(${joinedGroupIds.join(",")})`);
        }

        const { data, error } = await query;
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.joinGroup = async (req, res) => {
    const { groupId } = req.params;
    try {
        const { error } = await supabase.from("group_members").insert([
            { group_id: groupId, user_id: req.user.id, status: 'accepted' }
        ]);
        if (error) throw error;
        res.json({ message: "Joined group successfully" });
    } catch (err) {
        res.status(400).json({ error: "Already a member or group not found" });
    }
};
