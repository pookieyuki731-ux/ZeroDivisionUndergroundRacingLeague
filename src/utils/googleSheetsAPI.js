// Google Sheets API configuration
const API_KEY = 'AIzaSyA9GM5ecmKc7EBt_OxCQLTMI3Y2CH0AEj4';
const SHEET_ID = '1-3adrIpDi4RD_YMt8LogZjS8rY3frLTdPAHbHoi4o-k';

// Sheet names
const SHEETS = {
    RACERS: 'Réponses au formulaire 1',
    RACE_RESULTS: 'RaceResults'
};

// Read data from a sheet
export const readSheet = async (sheetName, range = 'A:Z') => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!${range}?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to read sheet: ${response.statusText}`);
        }
        const data = await response.json();
        return data.values || [];
    } catch (error) {
        console.error('Error reading sheet:', error);
        throw error;
    }
};

// Write data to a sheet
export const writeSheet = async (sheetName, range, values) => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!${range}?valueInputOption=RAW&key=${API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                values: values
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to write sheet: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error writing sheet:', error);
        throw error;
    }
};

// Clear a sheet range
export const clearSheet = async (sheetName, range = 'A:Z') => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!${range}:clear?key=${API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to clear sheet: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error clearing sheet:', error);
        throw error;
    }
};

// Fetch racers from the Form Responses sheet (Column B = Codename)
export const fetchRacers = async () => {
    const data = await readSheet(SHEETS.RACERS);
    if (data.length === 0) return [];

    // Column B (index 1) contains "Codename (Racer Tag On The Tablet)"
    // Skip header row and map from row 1 onwards
    return data.slice(1).map((row, index) => ({
        id: `racer_${index}`,
        name: row[1] || '', // Column B
        points: 0,
        raceResults: {}
    })).filter(r => r.name);
};

// Fetch race results from the RaceResults sheet
export const fetchRaceResults = async () => {
    try {
        const data = await readSheet(SHEETS.RACE_RESULTS);
        if (data.length === 0) return {};

        const results = {};
        data.slice(1).forEach(row => {
            const [racerId, raceId, position, points] = row;
            if (!results[racerId]) results[racerId] = {};
            results[racerId][raceId] = {
                position: parseInt(position),
                points: parseInt(points)
            };
        });

        return results;
    } catch (error) {
        // If sheet doesn't exist yet, return empty
        return {};
    }
};

// Save race results to the RaceResults sheet
export const saveRaceResults = async (racers) => {
    const headers = ['RacerId', 'RaceId', 'Position', 'Points'];
    const rows = [];

    racers.forEach(racer => {
        Object.entries(racer.raceResults).forEach(([raceId, position]) => {
            if (position) {
                rows.push([
                    racer.id,
                    raceId,
                    position,
                    racer.points
                ]);
            }
        });
    });

    await clearSheet(SHEETS.RACE_RESULTS);
    if (rows.length > 0) {
        await writeSheet(SHEETS.RACE_RESULTS, 'A1:D' + (rows.length + 1), [headers, ...rows]);
    }
};

export { SHEETS, API_KEY, SHEET_ID };
