import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tixtmyokobfpjvzgouyd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeHRteW9rb2JmcGp2emdvdXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODMzNzcsImV4cCI6MjA3OTc1OTM3N30.CWweDgtoZ8jHRxxR8YMaXBU5ZixcK70q6fWGUc1-uWI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupDuplicates() {
    let hasMore = true;
    let totalDeleted = 0;

    while (hasMore) {
        console.log('Fetching batch of settings rows...');

        const { data, error } = await supabase
            .from('racers')
            .select('*')
            .eq('name', '__LEAGUE_SETTINGS__')
            .order('id', { ascending: true });

        if (error) {
            console.error('Error fetching:', error);
            return;
        }

        console.log(`Found ${data.length} rows.`);

        if (data.length <= 1) {
            console.log('No duplicates left.');
            hasMore = false;
            break;
        }

        // Keep the last one
        const toKeep = data[data.length - 1];
        const toDelete = data.slice(0, data.length - 1);

        console.log(`Keeping ID: ${toKeep.id}`);
        console.log(`Deleting ${toDelete.length} rows...`);

        const deletePromises = toDelete.map(row =>
            supabase.from('racers').delete().eq('id', row.id)
        );

        // Execute in parallel batches of 50 to speed up
        for (let i = 0; i < deletePromises.length; i += 50) {
            const batch = deletePromises.slice(i, i + 50);
            await Promise.all(batch);
            process.stdout.write('.');
        }
        console.log('\nBatch complete.');
        totalDeleted += toDelete.length;
    }

    console.log(`Cleanup complete! Total deleted: ${totalDeleted}`);
    process.exit(0);
}

cleanupDuplicates();
