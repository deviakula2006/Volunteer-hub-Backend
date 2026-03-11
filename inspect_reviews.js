require('dotenv').config();
const supabase = require('./config/supabaseClient');

async function run() {
    console.log('--- Inspecting Reviews Columns ---');
    try {
        const { data, error } = await supabase
            .from('reviews')
            .insert([
                {
                    volunteer_id: '45b2fa2c-01fb-401f-aafc-2fdb8866455e',
                    opportunity_id: '2c75c2b9-972e-40e1-8ad9-5da13230e281',
                    type: 'review',
                    comment: 'type probe test'
                }
            ])
            .select();

        if (error) {
            console.error('Insert Error:', error);
        } else if (data && data.length > 0) {
            console.log('Insert Success! Columns in reviews table:', Object.keys(data[0]));
            // Clean up
            const deleteRes = await supabase.from('reviews').delete().eq('id', data[0].id);
            if (deleteRes.error) console.error('Cleanup error:', deleteRes.error);
            else console.log('Test row cleaned up.');
        } else {
            console.log('Insert seemed to succeed but no data was returned.');
        }
    } catch (err) {
        console.error('Script crashed:', err);
    }
}

run();
