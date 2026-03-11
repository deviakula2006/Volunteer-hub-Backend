const supabase = require("../config/supabaseClient");

exports.getEvents = async (req, res) => {
    try {
        // Return all opportunities as events for the calendar
        const { data, error } = await supabase
            .from("opportunities")
            .select("*")
            .order("start_date", { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
