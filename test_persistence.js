import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tixtmyokobfpjvzgouyd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeHRteW9rb2JmcGp2emdvdXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODMzNzcsImV4cCI6MjA3OTc1OTM3N30.CWweDgtoZ8jHRxxR8YMaXBU5ZixcK70q6fWGUc1-uWI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testPersistence() {
    console.log('1. Reading current value...');
    const { data: start } = await supabase
        .from('racers')
        .select('*')
        .eq('name', '__LEAGUE_SETTINGS__')
        .single();
    console.log('Start value:', start?.race_results?.totalPrizePool);

    console.log('2. Updating to 555555...');
    const { error } = await supabase
        .from('racers')
        .update({ race_results: { totalPrizePool: 555555 } })
        .eq('id', start.id);

    if (error) console.error('Update error:', error);

    console.log('3. Waiting 5 seconds...');
    await new Promise(r => setTimeout(r, 5000));

    console.log('4. Reading value again...');
    const { data: end } = await supabase
        .from('racers')
        .select('*')
        .eq('name', '__LEAGUE_SETTINGS__')
        .single();
    console.log('End value:', end?.race_results?.totalPrizePool);

    process.exit(0);
}

testPersistence();
