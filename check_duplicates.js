import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tixtmyokobfpjvzgouyd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeHRteW9rb2JmcGp2emdvdXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODMzNzcsImV4cCI6MjA3OTc1OTM3N30.CWweDgtoZ8jHRxxR8YMaXBU5ZixcK70q6fWGUc1-uWI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDuplicates() {
    console.log('Checking for duplicate settings rows...');

    const { data, error } = await supabase
        .from('racers')
        .select('*')
        .eq('name', '__LEAGUE_SETTINGS__');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Found ${data.length} rows with name '__LEAGUE_SETTINGS__'`);
    data.forEach(row => {
        console.log(`ID: ${row.id}, Prize Pool: ${row.race_results?.totalPrizePool}`);
    });

    process.exit(0);
}

checkDuplicates();
