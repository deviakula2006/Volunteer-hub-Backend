const supabase = require("../config/supabaseClient");

exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        error: "Email, password and role are required"
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      return res.status(400).json({
        error: error.message
      });
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: data.user.id,
          email,
          role
        }
      ]);

    if (profileError) {
      return res.status(500).json({
        error: "Profile insertion failed"
      });
    }

    return res.status(201).json({
      message: "User registered successfully"
    });

  } catch (err) {
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    return res.status(200).json({
      message: "Login successful",
      session: data.session,
      user: data.user
    });

  } catch (err) {
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};