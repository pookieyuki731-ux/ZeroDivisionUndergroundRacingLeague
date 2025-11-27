import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tixtmyokobfpjvzgouyd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeHRteW9rb2JmcGp2emdvdXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODMzNzcsImV4cCI6MjA3OTc1OTM3N30.CWweDgtoZ8jHRxxR8YMaXBU5ZixcK70q6fWGUc1-uWI';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch all racers
export const fetchRacers = async () => {
    const { data, error } = await supabase
        .from('racers')
        .select('*')
        .order('id');

    if (error) {
        console.error('Error fetching racers:', error);
        return [];
    }

    return data.map(racer => ({
        ...racer,
        raceResults: racer.race_results || {}
    }));
};

// Add a new racer
export const addRacer = async (name) => {
    const { data, error } = await supabase
        .from('racers')
        .insert([{ name, points: 0, race_results: {} }])
        .select();

    if (error) {
        console.error('Error adding racer:', error);
        throw error;
    }

    return data[0];
};

// Update a racer
export const updateRacer = async (id, updates) => {
    const { data, error } = await supabase
        .from('racers')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) {
        console.error('Error updating racer:', error);
        throw error;
    }

    return data[0];
};

// Delete a racer
export const deleteRacer = async (id) => {
    const { error } = await supabase
        .from('racers')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting racer:', error);
        throw error;
    }
};

// Update race results for all racers
export const updateRaceResults = async (racers) => {
    const updates = racers.map(racer => ({
        id: racer.id,
        points: racer.points,
        race_results: racer.raceResults
    }));

    const { error } = await supabase
        .from('racers')
        .upsert(updates);

    if (error) {
        console.error('Error updating race results:', error);
        throw error;
    }
};

// Sync racers from Google Form (read-only)
export const syncFromGoogleForm = async () => {
    // This will read from your Google Sheet and add any new racers to Supabase
    const API_KEY = 'AIzaSyA9GM5ecmKc7EBt_OxCQLTMI3Y2CH0AEj4';
    const SHEET_ID = '1-3adrIpDi4RD_YMt8LogZjS8rY3frLTdPAHbHoi4o-k';
    const SHEET_NAME = 'Réponses au formulaire 1';

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A:Z?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.values || data.values.length === 0) return;

        // Column B (index 1) contains codenames
        const newRacers = data.values.slice(1)
            .map(row => row[1])
            .filter(name => name);

        // Get existing racers
        const existing = await fetchRacers();
        const existingNames = existing.map(r => r.name);

        // Add only new racers
        const toAdd = newRacers.filter(name => !existingNames.includes(name));

        for (const name of toAdd) {
            await addRacer(name);
        }

        return toAdd.length;
    } catch (error) {
        console.error('Error syncing from Google Form:', error);
        throw error;
    }
};
