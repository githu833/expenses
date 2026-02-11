import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Plus, Trash2, ArrowLeft, Wallet, Edit2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sources = () => {
    const [sources, setSources] = useState([]);
    const [newName, setNewName] = useState('');
    const [initialBalance, setInitialBalance] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    const handleEditClick = (source) => {
        setEditingId(source._id);
        setEditName(source.name);
    };

    const handleUpdate = async (id) => {
        if (!editName.trim()) return;
        try {
            const { data } = await api.put(`/sources/${id}`, { name: editName });
            setSources(sources.map(s => s._id === id ? data : s));
            setEditingId(null);
            setEditName('');
        } catch (err) {
            if (err.offline) {
                alert(err.message);
                setEditingId(null);
            } else {
                setError(err.response?.data?.message || 'Error updating source');
            }
        }
    };

    const navigate = useNavigate();

    const fetchSources = async () => {
        try {
            const { data } = await api.get('/sources');
            setSources(data);
        } catch (err) {
            console.error('Error fetching sources', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSources();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        setError('');
        try {
            const { data } = await api.post('/sources', {
                name: newName,
                initialBalance: Number(initialBalance) || 0
            });
            setSources([...sources, data]);
            setNewName('');
            setInitialBalance('');
        } catch (err) {
            if (err.offline) {
                alert(err.message);
                setNewName('');
                setInitialBalance('');
            } else {
                setError(err.response?.data?.message || 'Error adding source');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this source? (You can only delete sources without transactions)')) {
            try {
                await api.delete(`/sources/${id}`);
                setSources(sources.filter(s => s._id !== id));
            } catch (err) {
                if (err.offline) {
                    alert(err.message);
                } else {
                    alert(err.response?.data?.message || 'Failed to delete source');
                }
            }
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container" style={{ maxWidth: '600px', paddingBottom: '80px' }}>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4" style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
                <ArrowLeft size={20} /> Back
            </button>

            <div className="glass-card mb-4">
                <div className="flex items-center gap-2 mb-4">
                    <Wallet size={24} color="var(--primary)" />
                    <h2 style={{ fontSize: '1.5rem' }}>Manage Sources</h2>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                    Add accounts and their starting balances to track where your money is stored.
                </p>

                <form onSubmit={handleAdd} className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Account Name (e.g. Bank)"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            required
                            style={{ flex: 2 }}
                        />
                        <input
                            type="number"
                            placeholder="Initial Balance (₹)"
                            value={initialBalance}
                            onChange={(e) => setInitialBalance(e.target.value)}
                            style={{ flex: 1 }}
                        />
                    </div>
                    <button type="submit" className="btn-primary flex items-center justify-center gap-2">
                        <Plus size={20} /> Add Source
                    </button>
                </form>
                {error && <p style={{ color: 'var(--expense)', marginTop: '10px', fontSize: '0.9rem' }}>{error}</p>}
            </div>

            <div className="flex flex-col gap-3">
                {sources.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No sources added yet.</p>
                ) : (
                    sources.map(s => (
                        <div key={s._id} className="glass-card flex justify-between items-center" style={{ padding: '12px 20px' }}>
                            {editingId === s._id ? (
                                <div className="flex items-center gap-2" style={{ flex: 1 }}>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        style={{ padding: '8px', width: '100%' }}
                                    />
                                    <button onClick={() => handleUpdate(s._id)} style={{ color: 'var(--income)', background: 'transparent' }}>
                                        <Save size={18} />
                                    </button>
                                    <button onClick={() => setEditingId(null)} style={{ color: 'var(--text-secondary)', background: 'transparent' }}>
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <span style={{ fontWeight: '500' }}>{s.name}</span>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleEditClick(s)} style={{ color: 'var(--text-secondary)', background: 'transparent' }}>
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(s._id)} style={{ color: 'var(--text-secondary)', background: 'transparent' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Sources;
