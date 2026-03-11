require('dotenv').config();
const supabase = require('./config/supabaseClient');

async function run() {
    const testValues = ['positive', 'negative', 'neutral', 'good', 'bad', 'excellent', '1', '2', '3', '4', '5', 'volunteer', 'organization'];
    const vol = '45b2fa2c-01fb-401f-aafc-2fdb8866455e';
    const opp = '2c75c2b9-972e-40e1-8ad9-5da13230e281';

    for (const val of testValues) {
        const { data, error } = await supabase.from('reviews').insert([
            { volunteer_id: vol, opportunity_id: opp, type: val, comment: 'probe' }
        ]).select();

        if (error) {
            console.log(`type='${val}' -> INVALID: ${error.message.split('\"')[0].trim()}`);
        } else {
            console.log(`type='${val}' -> VALID! Columns: ${Object.keys(data[0]).join(', ')}`);
            // clean up
            await supabase.from('reviews').delete().eq('id', data[0].id);
            break;
        }
    }
}

run();
