import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, Save } from 'lucide-react';

const AddEntry = () => {
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        sourceId: '',
        date: new Date().toISOString().split('T')[0],
        purpose: '',
        source: '',
        category: ''
    });
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSources = async () => {
            try {
                const { data } = await api.get('/sources');
                setSources(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, sourceId: data[0]._id }));
                }
            } catch (err) {
                console.error('Error fetching sources', err);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchSources();
    }, []);

    const categories = {
        income: ['Salary', 'Freelance', 'Gift', 'Investment', 'Other'],
        expense: ['Food', 'Travel', 'Rent', 'Shopping', 'Bills', 'Health', 'Other']
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/transactions', formData);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Error saving transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4" style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
                <ArrowLeft size={20} /> Back
            </button>

            <div className="glass-card">
                <h2 className="mb-4" style={{ fontSize: '1.5rem' }}>Add New Entry</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <button
                            type="button"
                            className="flex-1"
                            style={{
                                background: formData.type === 'income' ? 'var(--income)' : 'var(--glass)',
                                padding: '10px'
                            }}
                            onClick={() => setFormData({ ...formData, type: 'income', purpose: '' })}
                        >
                            Income
                        </button>
                        <button
                            type="button"
                            className="flex-1"
                            style={{
                                background: formData.type === 'expense' ? 'var(--expense)' : 'var(--glass)',
                                padding: '10px'
                            }}
                            onClick={() => setFormData({ ...formData, type: 'expense', source: '' })}
                        >
                            Expense
                        </button>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Select Account / Source</label>
                        <select name="sourceId" value={formData.sourceId} onChange={handleChange} required>
                            {sources.length === 0 ? (
                                <option value="">No sources found. Please add one first!</option>
                            ) : (
                                sources.map(s => <option key={s._id} value={s._id}>{s.name}</option>)
                            )}
                        </select>
                        <Link to="/sources" style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '4px', display: 'inline-block' }}>
                            + Add new source
                        </Link>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Amount (₹)</label>
                        <input name="amount" type="number" value={formData.amount} onChange={handleChange} required placeholder="0.00" />
                    </div>

                    {formData.type === 'income' ? (
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Source</label>
                            <input name="source" type="text" value={formData.source} onChange={handleChange} required placeholder="Where did it come from?" />
                        </div>
                    ) : (
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Purpose</label>
                            <input name="purpose" type="text" value={formData.purpose} onChange={handleChange} required placeholder="What was it for?" />
                        </div>
                    )}

                    {formData.type === 'income' && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} required>
                                <option value="">Select Category</option>
                                {categories[formData.type].map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Date</label>
                        <input name="date" type="date" value={formData.date} onChange={handleChange} required />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary mt-4 flex items-center justify-center gap-2">
                        <Save size={20} /> {loading ? 'Saving...' : 'Save Transaction'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddEntry;
