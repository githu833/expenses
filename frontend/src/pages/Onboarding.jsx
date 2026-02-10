import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Wallet, Plus, Trash2, CheckCircle } from 'lucide-react';

const Onboarding = () => {
    const [sources, setSources] = useState([{ name: 'Cash', balance: '' }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleAddRow = () => {
        setSources([...sources, { name: '', balance: '' }]);
    };

    const handleRemoveRow = (index) => {
        setSources(sources.filter((_, i) => i !== index));
    };

    const handleChange = (index, field, value) => {
        const newSources = [...sources];
        newSources[index][field] = value;
        setSources(newSources);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const validSources = sources.filter(s => s.name.trim() !== '');
        if (validSources.length === 0) {
            setError('Please add at least one account');
            setLoading(false);
            return;
        }

        try {
            await api.post('/sources/onboarding', {
                sources: validSources.map(s => ({
                    name: s.name,
                    balance: Number(s.balance) || 0
                }))
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to complete setup');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <div className="glass-card mt-4">
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Welcome! 🎉</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Let's set up your finances. How much money do you currently have?</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4">
                        {sources.map((source, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <div style={{ flex: 2 }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Account Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Bank Account"
                                        value={source.name}
                                        onChange={(e) => handleChange(index, 'name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Balance (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={source.balance}
                                        onChange={(e) => handleChange(index, 'balance', e.target.value)}
                                    />
                                </div>
                                {sources.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveRow(index)}
                                        style={{ background: 'transparent', color: 'var(--expense)', marginTop: '20px' }}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={handleAddRow}
                        className="mt-4 flex items-center gap-2"
                        style={{ background: 'transparent', color: 'var(--primary)', fontWeight: '600' }}
                    >
                        <Plus size={20} /> Add another account
                    </button>

                    {error && <p style={{ color: 'var(--expense)', marginTop: '20px', textAlign: 'center' }}>{error}</p>}

                    <button
                        type="submit"
                        className="btn-primary mt-4 w-full flex items-center justify-center gap-2"
                        disabled={loading}
                    >
                        {loading ? 'Setting up...' : <><CheckCircle size={20} /> Finish Setup</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Onboarding;
