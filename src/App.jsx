import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LeagueProvider } from './context/LeagueContext';
import Layout from './components/Layout';
import Leaderboard from './components/Leaderboard';
import RaceManager from './components/RaceManager';
import RosterManager from './components/RosterManager';
import Settings from './components/Settings';
import Info from './components/Info';
import LoginPage from './components/LoginPage';

function AppContent() {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'leaderboard':
        return <Leaderboard />;
      case 'races':
        return <RaceManager />;
      case 'info':
        return <Info />;
      case 'roster':
        return <RosterManager />;
      case 'settings':
        return <Settings />;
      default:
        return <Leaderboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <LeagueProvider>
        <AppContent />
      </LeagueProvider>
    </AuthProvider>
  );
}

export default App;
