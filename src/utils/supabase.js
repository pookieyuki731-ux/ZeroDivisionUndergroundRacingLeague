import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tixtmyokobfpjvzgouyd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeHRteW9rb2JmcGp2emdvdXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODMzNzcsImV4cCI6MjA3OTc1OTM3N30.CWweDgtoZ8jHRxxR8YMaXBU5ZixcK70q6fWGUc1-uWI';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch all racers
export const fetchRacers = async () => {
    const { data, error } = await supabase
        .from('racers')
        .select('*')
        .neq('name', '__LEAGUE_SETTINGS__')
        .order('id');

    if (error) {
        console.error('Error fetching racers:', error);
        return [];
    }

    // Client-side filter because server-side neq might be flaky
    return data
        .filter(r => r.name !== '__LEAGUE_SETTINGS__')
        .map(racer => ({
            ...racer,
            raceResults: racer.race_results || {}
        }));
};

// Add a new racer
export const addRacer = async (name, vehicle = 'Unknown Vehicle') => {
    const { data, error } = await supabase
        .from('racers')
        .insert([{ name, vehicle, points: 0, race_results: {} }])
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

        // Column B (index 1) contains codenames, Column F (index 5) contains vehicle names
        const sheetRacers = data.values.slice(1)
            .map(row => ({
                name: row[1],
                vehicle: row[5] || 'Unknown Vehicle'
            }))
            .filter(racer => racer.name);

        // Get existing racers
        const existing = await fetchRacers();
        const existingMap = new Map(existing.map(r => [r.name, r]));

        let addedCount = 0;
        let updatedCount = 0;

        for (const sheetRacer of sheetRacers) {
            const existingRacer = existingMap.get(sheetRacer.name);

            if (!existingRacer) {
                // Add new racer
                await addRacer(sheetRacer.name, sheetRacer.vehicle);
                addedCount++;
            } else if (existingRacer.vehicle !== sheetRacer.vehicle) {
                // Update vehicle name if it changed
                await updateRacer(existingRacer.id, { vehicle: sheetRacer.vehicle });
                updatedCount++;
            }
        }

        return { added: addedCount, updated: updatedCount };
    } catch (error) {
        console.error('Error syncing from Google Form:', error);
        throw error;
    }
};


// Fetch global settings
export const fetchSettings = async () => {
    console.log('[fetchSettings] Starting fetch...');
    // Client-side filtering workaround for Supabase permissions issue
    const { data, error } = await supabase
        .from('racers')
        .select('*')
        .eq('name', '__LEAGUE_SETTINGS__');

    if (error) {
        console.error('[fetchSettings] Error fetching settings:', error);
        return null;
    }

    console.log('[fetchSettings] Raw data:', data);

    // Find the settings row
    const settingsRow = data?.find(r => r.name === '__LEAGUE_SETTINGS__');

    if (!settingsRow) {
        console.log('[fetchSettings] Row not found! Attempting to create default...');
        // Create default settings if not found
        const defaultSettings = {
            totalPrizePool: 150000,
            raceNames: {
                race_1: 'Race 1',
                race_2: 'Race 2',
                race_3: 'Race 3',
                race_4: 'Race 4',
                race_5: 'Race 5'
            }
        };

        const { data: newRow, error: createError } = await supabase
            .from('racers')
            .insert([{
                name: '__LEAGUE_SETTINGS__',
                race_results: defaultSettings,
                points: 0
            }])
            .select()
            .single();

        if (createError) {
            console.error('[fetchSettings] Error creating settings:', createError);
            // If we can't create, just return default to avoid crashing
            return defaultSettings;
        }

        console.log('[fetchSettings] Created new default row:', newRow);
        return newRow.race_results;
    }

    console.log('[fetchSettings] Found row:', settingsRow);
    const settings = settingsRow.race_results;

    // Ensure race names exist (backward compatibility)
    if (!settings.raceNames) {
        settings.raceNames = {
            race_1: 'Race 1',
            race_2: 'Race 2',
            race_3: 'Race 3',
            race_4: 'Race 4',
            race_5: 'Race 5'
        };
    }

    return settings;
};

// Update global settings
export const updateSettings = async (settings) => {
    // First get the ID of the settings row using client-side find
    const { data } = await supabase
        .from('racers')
        .select('*')
        .eq('name', '__LEAGUE_SETTINGS__')
        .order('id', { ascending: false }); // Always get the latest one

    const existing = data?.find(r => r.name === '__LEAGUE_SETTINGS__');

    if (!existing) {
        // Should have been created by fetchSettings, but just in case
        await fetchSettings();
        return updateSettings(settings);
    }

    const { error } = await supabase
        .from('racers')
        .update({ race_results: settings })
        .eq('id', existing.id);

    if (error) {
        console.error('Error updating settings:', error);
        throw error;
    }
};
