require("dotenv").config();
const supabase = require("./config/supabaseClient");

async function run() {
    const { data, error } = await supabase
        .from("applications")
        .select(`
        id,
        status,
        applied_at,
        volunteer_id,
        opportunity_id,
        volunteer:volunteer_id(id, email),
        opportunity:opportunity_id!inner(title, location, start_date, end_date, organizer_id)
      `);

    console.log(JSON.stringify(data, null, 2));
    if (error) console.error("Error:", error);
}

run();
