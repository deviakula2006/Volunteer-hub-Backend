require("dotenv").config();
const supabase = require("./config/supabaseClient");

async function checkSchema() {
    console.log("--- Schema Inspection ---");

    const tablesToCheck = [
        "opportunities",
        "reviews",
        "resources",
        "group_events",
        "group_members",
        "volunteer_hours",
        "notifications",
        "messaging",
        "profiles"
    ];

    for (const table of tablesToCheck) {
        const { data, error } = await supabase
            .from(table)
            .select("*")
            .limit(1);

        if (error) {
            if (error.code === '42P01') {
                console.log(`Table '${table}': NOT FOUND`);
            } else {
                console.log(`Table '${table}': ERROR (${error.code}) - ${error.message}`);
            }
        } else {
            console.log(`Table '${table}': EXISTS`);
            if (data && data.length > 0) {
                console.log(`  Columns found: ${Object.keys(data[0]).join(", ")}`);
            } else {
                // Try to get one row to see columns, if empty, we might need another way or just try a broad select
                // But if it exists, it's a good start.
            }
        }
    }
}

checkSchema();
