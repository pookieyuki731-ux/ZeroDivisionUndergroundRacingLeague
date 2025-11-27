import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchRacers, updateRacer as updateRacerDB, deleteRacer as deleteRacerDB, updateRaceResults, syncFromGoogleForm } from '../utils/supabase';
import { calculatePoints } from '../utils/pointsSystem';

const LeagueContext = createContext();

export const useLeague = () => useContext(LeagueContext);

export const LeagueProvider = ({ children }) => {
    const [racers, setRacers] = useState([]);
    const [settings, setSettings] = useState({
        totalPrizePool: 150000 // Default from image
    });
    const [loading, setLoading] = useState(false);

    // Load racers from Supabase on mount
    useEffect(() => {
        loadRacers();
    }, []);

    const loadRacers = async () => {
        setLoading(true);
        try {
            const data = await fetchRacers();
            setRacers(data);
        } catch (error) {
            console.error('Error loading racers:', error);
        } finally {
            setLoading(false);
        }
    };

    const syncRoster = async () => {
        setLoading(true);
        try {
            const newCount = await syncFromGoogleForm();
            await loadRacers();
            if (newCount > 0) {
                alert(`Synced ${newCount} new racer(s) from Google Form!`);
            } else {
                alert('No new racers found. All racers are already synced.');
            }
        } catch (error) {
            console.error('Error syncing roster:', error);
            alert('Failed to sync roster. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const updateRacer = async (id, updates) => {
        try {
            await updateRacerDB(id, updates);
            setRacers(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
        } catch (error) {
            console.error('Error updating racer:', error);
            alert('Failed to update racer.');
        }
    };

    const deleteRacer = async (id) => {
        try {
            await deleteRacerDB(id);
            setRacers(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error('Error deleting racer:', error);
            alert('Failed to delete racer.');
        }
    };

    const updateRaceResult = async (raceId, results) => {
        // results: { racerId: position }
        const updatedRacers = racers.map(r => {
            const position = results[r.id];

            // Recalculate total points
            const otherPoints = Object.entries(r.raceResults)
                .filter(([rid]) => rid !== raceId)
                .reduce((sum, [_, pos]) => sum + calculatePoints(pos), 0);

            const newPoints = otherPoints + (position ? calculatePoints(position) : 0);

            return {
                ...r,
                points: newPoints,
                raceResults: {
                    ...r.raceResults,
                    [raceId]: position
                }
            };
        });

        try {
            await updateRaceResults(updatedRacers);
            setRacers(updatedRacers);
            alert('Race results saved successfully!');
        } catch (error) {
            console.error('Error updating race results:', error);
            alert('Failed to save race results.');
        }
    };

    return (
        <LeagueContext.Provider value={{
            racers,
            settings,
            setSettings,
            syncRoster,
            loading,
            updateRacer,
            deleteRacer,
            updateRaceResult,
            refreshRacers: loadRacers
        }}>
            {children}
        </LeagueContext.Provider>
    );
};
