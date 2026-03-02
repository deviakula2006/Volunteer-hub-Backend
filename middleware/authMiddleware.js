const supabase = require("../config/supabaseClient");

const verifyUser = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ")
      ? header.split(" ")[1]
      : null;

    if (!token)
      return res.status(401).json({ error: "No token provided" });

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user)
      return res.status(401).json({ error: "Invalid token" });

    // 🔥 Fetch role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError)
      return res.status(400).json({ error: "Profile not found" });

    req.user = {
      id: data.user.id,
      email: data.user.email,
      role: profile.role,
    };

    next();
  } catch {
    res.status(500).json({ error: "Authentication failed" });
  }
};

module.exports = verifyUser;