const supabase = require("../config/supabaseClient");

exports.sendMessage = async (req, res) => {
  const { receiver_id, opportunity_id, message } = req.body;

  const { error } = await supabase.from("messages").insert([
    {
      sender_id: req.user.id,
      receiver_id,
      opportunity_id,
      message,
    },
  ]);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Message sent" });
};

exports.getMessages = async (req, res) => {
  const { opportunity_id } = req.params;

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("opportunity_id", opportunity_id)
    .order("created_at");

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
};