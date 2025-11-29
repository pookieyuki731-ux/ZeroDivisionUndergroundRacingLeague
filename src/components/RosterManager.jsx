import React, { useState } from 'react';
import { useLeague } from '../context/LeagueContext';
import { RefreshCw, Trash2, Edit2, Save, X, Plus } from 'lucide-react';

const RosterManager = () => {
    const { racers, loading, syncRoster, updateRacer, deleteRacer } = useLeague();
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '' });


    const handleSync = () => {
        syncRoster();
    };

    const startEdit = (racer) => {
        setEditingId(racer.id);
        setEditForm({ name: racer.name });
    };

    const saveEdit = () => {
        updateRacer(editingId, editForm);
        setEditingId(null);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-rajdhani font-bold text-white border-l-4 border-neon-blue pl-4">
                    ROSTER MANAGEMENT
                </h2>

            </div>

            {/* Sync Section */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">Sync from Google Form</h3>
                        <p className="text-sm text-gray-400">
                            Pull new racer registrations from your Google Form responses
                        </p>
                    </div>
                    <button
                        onClick={handleSync}
                        disabled={loading}
                        className="flex items-center bg-cyan-600 hover:bg-blue-700 disabled:bg-gray-700 text-white px-6 py-2 rounded font-bold transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Syncing...' : 'Sync Roster'}
                    </button>
                </div>
            </div>

            {/* Roster List */}
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-gray-400 uppercase text-xs font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-3">Racer Name</th>
                            <th className="px-6 py-3">Vehicle</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {racers.map(racer => (
                            <tr key={racer.id} className="hover:bg-gray-800/50">
                                <td className="px-6 py-4">
                                    {editingId === racer.id ? (
                                        <input
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ name: e.target.value })}
                                            className="bg-black border border-gray-600 rounded px-2 py-1 text-white w-full"
                                        />
                                    ) : (
                                        <span className="font-medium text-white">{racer.name}</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-gray-300 italic">{racer.vehicle || 'Unknown Vehicle'}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                        {editingId === racer.id ? (
                                            <>
                                                <button onClick={saveEdit} className="p-2 text-green-500 hover:bg-green-500/10 rounded">
                                                    <Save className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setEditingId(null)} className="p-2 text-gray-500 hover:bg-gray-500/10 rounded">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => startEdit(racer)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => deleteRacer(racer.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {racers.length === 0 && (
                            <tr>
                                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                    No racers found. Click "Sync Roster" to pull from Google Form.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RosterManager;
