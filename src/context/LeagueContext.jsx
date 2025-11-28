import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchRacers, updateRacer as updateRacerDB, deleteRacer as deleteRacerDB, updateRaceResults, syncFromGoogleForm, fetchSettings, updateSettings as updateSettingsDB } from '../utils/supabase';
import { calculatePoints } from '../utils/pointsSystem';
import { useToast } from './ToastContext';

const LeagueContext = createContext();

export const useLeague = () => useContext(LeagueContext);

export const LeagueProvider = ({ children }) => {
    const { showToast } = useToast();
    const [racers, setRacers] = useState([]);
    const [settings, setSettings] = useState({
        totalPrizePool: 150000
    });
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // Load racers and settings from Supabase on mount
    useEffect(() => {
        loadData();
        // Check for persisted admin session
        const savedAdmin = localStorage.getItem('zdurl_admin');
        if (savedAdmin === 'true') {
            setIsAdmin(true);
        }

        // Poll for settings updates every 5 seconds
        // (Realtime is not enabled on Supabase, so we use polling as fallback)
        const pollInterval = setInterval(async () => {
            try {
                const newSettings = await fetchSettings();
                if (newSettings) {
                    setSettings(prevSettings => {
                        // Only update if the value actually changed
                        if (newSettings.totalPrizePool !== prevSettings.totalPrizePool) {
                            showToast('Settings updated', 'info');
                            return newSettings;
                        }
                        return prevSettings;
                    });
                }
            } catch (error) {
                console.error('Error polling settings:', error);
            }
        }, 5000); // Poll every 5 seconds

        return () => {
            clearInterval(pollInterval);
        };
    }, []); // Empty dependency array - only run once on mount

    const loadData = async () => {
        setLoading(true);
        try {
            const [racersData, settingsData] = await Promise.all([
                fetchRacers(),
                fetchSettings()
            ]);

            setRacers(racersData);
            if (settingsData) {
                setSettings(settingsData);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            showToast('Failed to load league data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const verifyAdmin = (code) => {
        if (code === 'DeroZivision@4!') {
            setIsAdmin(true);
            localStorage.setItem('zdurl_admin', 'true');
            showToast('Admin access granted', 'success');
            return true;
        }
        showToast('Invalid access code', 'error');
        return false;
    };

    const logoutAdmin = () => {
        setIsAdmin(false);
        localStorage.removeItem('zdurl_admin');
        showToast('Admin logged out', 'info');
    };

    const updateLeagueSettings = async (newSettings) => {
        try {
            // Optimistic update
            setSettings(newSettings);
            await updateSettingsDB(newSettings);
            showToast('Settings saved successfully', 'success');
        } catch (error) {
            console.error('Error saving settings:', error);
            showToast('Failed to save settings', 'error');
            // Revert on error (reload data)
            loadData();
        }
    };

    const syncRoster = async () => {
        setLoading(true);
        try {
            const newCount = await syncFromGoogleForm();
            await loadData(); // Reload everything to be safe
            if (newCount > 0) {
                showToast(`Synced ${newCount} new racer(s) from Google Form!`, 'success');
            } else {
                showToast('No new racers found. All racers are already synced.', 'info');
            }
        } catch (error) {
            console.error('Error syncing roster:', error);
            showToast('Failed to sync roster. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const updateRacer = async (id, updates) => {
        if (!isAdmin) {
            showToast('Admin access required', 'error');
            return;
        }
        try {
            await updateRacerDB(id, updates);
            setRacers(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
        } catch (error) {
            console.error('Error updating racer:', error);
            showToast('Failed to update racer.', 'error');
        }
    };

    const deleteRacer = async (id) => {
        if (!isAdmin) {
            showToast('Admin access required', 'error');
            return;
        }
        try {
            await deleteRacerDB(id);
            setRacers(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error('Error deleting racer:', error);
            showToast('Failed to delete racer.', 'error');
        }
    };

    const updateRaceResult = async (raceId, results) => {
        if (!isAdmin) {
            showToast('Admin access required', 'error');
            return;
        }

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
            showToast('Race results saved successfully!', 'success');
        } catch (error) {
            console.error('Error updating race results:', error);
            showToast('Failed to save race results.', 'error');
        }
    };

    return (
        <LeagueContext.Provider value={{
            racers,
            settings,
            setSettings: updateLeagueSettings,
            syncRoster,
            loading,
            updateRacer,
            deleteRacer,
            updateRaceResult,
            refreshRacers: loadData,
            isAdmin,
            verifyAdmin,
            logoutAdmin
        }}>
            {children}
        </LeagueContext.Provider>
    );
};
