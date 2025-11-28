import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tixtmyokobfpjvzgouyd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeHRteW9rb2JmcGp2emdvdXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODMzNzcsImV4cCI6MjA3OTc1OTM3N30.CWweDgtoZ8jHRxxR8YMaXBU5ZixcK70q6fWGUc1-uWI';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Setting up realtime subscription...');

const channel = supabase
    .channel('test-channel')
    .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'racers'
    }, (payload) => {
        console.log('REALTIME UPDATE RECEIVED:', payload);
    })
    .subscribe((status) => {
        console.log('Subscription status:', status);
    });

console.log('Subscription created. Waiting for updates...');
console.log('Press Ctrl+C to exit');

// Keep the script running
setInterval(() => { }, 1000);
