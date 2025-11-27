import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Access codes
const ACCESS_CODES = {
    VIEWER: 'viewer123',  // Code 1: View-only access
    ADMIN: 'admin456'     // Code 2: Full admin access
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessLevel, setAccessLevel] = useState(null); // 'viewer' or 'admin'

    // Check if already authenticated in session
    useEffect(() => {
        const savedAuth = sessionStorage.getItem('zdurl_auth');
        if (savedAuth) {
            const { level } = JSON.parse(savedAuth);
            setAccessLevel(level);
            setIsAuthenticated(true);
        }
    }, []);

    const login = (code) => {
        if (code === ACCESS_CODES.VIEWER) {
            setAccessLevel('viewer');
            setIsAuthenticated(true);
            sessionStorage.setItem('zdurl_auth', JSON.stringify({ level: 'viewer' }));
            return true;
        } else if (code === ACCESS_CODES.ADMIN) {
            setAccessLevel('admin');
            setIsAuthenticated(true);
            sessionStorage.setItem('zdurl_auth', JSON.stringify({ level: 'admin' }));
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setAccessLevel(null);
        sessionStorage.removeItem('zdurl_auth');
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            accessLevel,
            login,
            logout,
            isAdmin: accessLevel === 'admin',
            isViewer: accessLevel === 'viewer'
        }}>
            {children}
        </AuthContext.Provider>
    );
};
