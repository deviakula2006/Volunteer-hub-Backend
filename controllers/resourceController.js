const supabase = require("../config/supabaseClient");

exports.getResources = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("resources")
      .select(`
        id,
        title,
        description,
        link,
        created_at,
        created_by,
        author:profiles!created_by(id, email)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addResource = async (req, res) => {
  const { title, description, link } = req.body;

  if (!title || !link) {
    return res.status(400).json({ error: "Title and link are required." });
  }

  const { error } = await supabase.from("resources").insert([
    {
      title,
      description,
      link,
      created_by: req.user.id,
    },
  ]);

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ message: "Resource added successfully." });
};
