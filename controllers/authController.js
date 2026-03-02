const supabase = require("../config/supabaseClient");

exports.register = async (req, res) => {
  const { email, password, role } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });

  await supabase.from("profiles").insert([
    {
      id: data.user.id,
      email,
      role,
    },
  ]);

  res.status(201).json({ message: "Registered successfully" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  res.json({
    token: data.session.access_token,
    user: {
      id: data.user.id,
      email,
      role: profile.role,
    },
  });
};