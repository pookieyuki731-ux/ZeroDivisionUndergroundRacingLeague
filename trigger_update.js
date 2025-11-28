import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tixtmyokobfpjvzgouyd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeHRteW9rb2JmcGp2emdvdXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODMzNzcsImV4cCI6MjA3OTc1OTM3N30.CWweDgtoZ8jHRxxR8YMaXBU5ZixcK70q6fWGUc1-uWI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function triggerUpdate() {
    const { data: allData } = await supabase
        .from('racers')
        .select('*')
        .eq('name', '__LEAGUE_SETTINGS__');

    const settings = allData?.find(r => r.name === '__LEAGUE_SETTINGS__');

    if (settings) {
        console.log('Updating settings to trigger realtime event...');
        await supabase
            .from('racers')
            .update({ race_results: { totalPrizePool: 888888 } })
            .eq('id', settings.id);

        console.log('Update sent! Check the other terminal for realtime event.');
    }

    process.exit(0);
}

triggerUpdate();
