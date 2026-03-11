require("dotenv").config();
const supabase = require("./config/supabaseClient");

const defaultResources = [
    {
        title: "The Ultimate Guide to Volunteering",
        description: "Everything you need to know to start your volunteering journey effectively.",
        link: "https://www.worldvolunteerweb.org/resources",
    },
    {
        title: "How to Track Your Impact",
        description: "A comprehensive guide on measuring and reporting your volunteer contributions.",
        link: "https://www.pointsoflight.org/resources/",
    },
    {
        title: "Top 10 Volunteering Skills",
        description: "Discover the most valued skills in the non-profit sector and how to develop them.",
        link: "https://www.idealist.org/en/careers/volunteer-skills",
    },
    {
        title: "Volunteer Safety Essentials",
        description: "Stay safe while making a difference. Essential safety tips for all volunteers.",
        link: "https://www.volunteerhub.com/blog/volunteer-safety/",
    }
];

async function seedResources() {
    console.log("Seeding default resources...");

    for (const res of defaultResources) {
        const { data: existing } = await supabase
            .from("resources")
            .select("id")
            .eq("title", res.title)
            .single();

        if (!existing) {
            const { error } = await supabase.from("resources").insert([res]);
            if (error) console.error(`Error adding ${res.title}:`, error.message);
            else console.log(`Added: ${res.title}`);
        } else {
            console.log(`Skipping: ${res.title} (already exists)`);
        }
    }
    console.log("Seeding complete.");
}

seedResources();
