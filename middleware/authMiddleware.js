const supabase = require("../config/supabaseClient");

const verifyUser = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ")
      ? header.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({
        error: "No token provided"
      });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        error: "Invalid or expired token"
      });
    }

    req.user = data.user;
    next();

  } catch (err) {
    return res.status(500).json({
      error: "Authentication failed"
    });
  }
};

module.exports = verifyUser;