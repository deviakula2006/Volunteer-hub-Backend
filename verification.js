require("dotenv").config();
const supabase = require("./config/supabaseClient");

async function verify() {
    console.log("--- Starting Verification ---");

    try {
        // 1. Check Messages Join
        console.log("\n1. Verifying Messages Query...");
        const { data: messages, error: msgError } = await supabase
            .from("messages")
            .select(`
                id,
                group_info:group_events!group_id(id, name),
                sender:profiles!sender_id(id, email),
                receiver:profiles!receiver_id(id, email)
            `)
            .limit(1);

        if (msgError) console.error("Message Query Error:", msgError);
        else console.log("Message Query Success!");

        // 2. Check Resources Join
        console.log("\n2. Verifying Resources Query...");
        const { data: resources, error: resError } = await supabase
            .from("resources")
            .select(`
                id,
                author:profiles!created_by(id, email)
            `)
            .limit(1);

        if (resError) console.error("Resource Query Error:", resError);
        else console.log("Resource Query Success!");

    } catch (err) {
        console.error("Verification crashed:", err);
    }

    console.log("\n--- Verification Complete ---");
}

verify();
