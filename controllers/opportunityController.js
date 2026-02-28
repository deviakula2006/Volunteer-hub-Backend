const supabase = require("../config/supabaseClient");

exports.createOpportunity = async (req, res) => {
  try {
    if (req.user.role !== "organization") {
      return res.status(403).json({
        error: "Only organizations can create opportunities"
      });
    }

    const { title, description, location, date } = req.body;

    if (!title || !description || !location || !date) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    const { error } = await supabase
      .from("opportunities")
      .insert([{ title, description, location, date }]);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      message: "Opportunity created successfully"
    });

  } catch (err) {
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};

exports.getOpportunities = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("opportunities")
      .select("*");

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};

exports.updateOpportunity = async (req, res) => {
  try {
    if (req.user.role !== "organization") {
      return res.status(403).json({
        error: "Only organizations can update opportunities"
      });
    }

    const { id } = req.params;
    const { title, description, location, date } = req.body;

    const { error } = await supabase
      .from("opportunities")
      .update({ title, description, location, date })
      .eq("id", id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Opportunity updated successfully"
    });

  } catch (err) {
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};

exports.deleteOpportunity = async (req, res) => {
  try {
    if (req.user.role !== "organization") {
      return res.status(403).json({
        error: "Only organizations can delete opportunities"
      });
    }

    const { id } = req.params;

    const { error } = await supabase
      .from("opportunities")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Opportunity deleted successfully"
    });

  } catch (err) {
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};