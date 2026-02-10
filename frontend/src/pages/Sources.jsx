import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Plus, Trash2, ArrowLeft, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sources = () => {
    const [sources, setSources] = useState([]);
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
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
            const { data } = await api.post('/sources', { name: newName });
            setSources([...sources, data]);
            setNewName('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding source');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this source? (You can only delete sources without transactions)')) {
            try {
                await api.delete(`/sources/${id}`);
                setSources(sources.filter(s => s._id !== id));
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete source');
            }
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4" style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
                <ArrowLeft size={20} /> Back
            </button>

            <div className="glass-card mb-4">
                <div className="flex items-center gap-2 mb-4">
                    <Wallet size={24} color="var(--primary)" />
                    <h2 style={{ fontSize: '1.5rem' }}>Manage Sources</h2>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                    Add accounts like "Bank Account", "Cash", or "Credit Card" to track where your money is stored.
                </p>

                <form onSubmit={handleAdd} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="e.g. Bank Account"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn-primary flex items-center gap-2" style={{ whiteSpace: 'nowrap' }}>
                        <Plus size={20} /> Add
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
                            <span style={{ fontWeight: '500' }}>{s.name}</span>
                            <button onClick={() => handleDelete(s._id)} style={{ color: 'var(--text-secondary)', background: 'transparent' }}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Sources;
