import React from 'react';
import { useLeague } from '../context/LeagueContext';
import { supabase } from '../utils/supabase';

const Settings = () => {
    const { settings, setSettings, isAdmin, verifyAdmin, logoutAdmin } = useLeague();
    const [accessCode, setAccessCode] = React.useState('');
    const [localPrizePool, setLocalPrizePool] = React.useState('');

    // Initialize local state when settings are loaded
    React.useEffect(() => {
        if (settings?.totalPrizePool) {
            setLocalPrizePool(settings.totalPrizePool);
        }
    }, [settings]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (verifyAdmin(accessCode)) {
            setAccessCode('');
        }
    };

    const handleUpdatePrizePool = () => {
        const newPrizePool = Number(localPrizePool);
        </div >
    );
};

export default Settings;
