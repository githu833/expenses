import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, Save } from 'lucide-react';

const AddEntry = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const editingTransaction = location.state?.transaction;

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

    useEffect(() => {
        const fetchSources = async () => {
            try {
                const { data } = await api.get('/sources');
                setSources(data);

                if (editingTransaction) {
                    setFormData({
                        type: editingTransaction.type,
                        amount: editingTransaction.amount,
                        sourceId: editingTransaction.sourceId,
                        date: new Date(editingTransaction.date).toISOString().split('T')[0],
                        purpose: editingTransaction.purpose || '',
                        source: editingTransaction.source || '',
                        category: editingTransaction.category || ''
                    });
                } else if (data.length > 0) {
                    setFormData(prev => ({ ...prev, sourceId: data[0]._id }));
                }
            } catch (err) {
                console.error('Error fetching sources', err);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchSources();
    }, [editingTransaction]);

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
            if (editingTransaction) {
                await api.put(`/transactions/${editingTransaction._id}`, formData);
            } else {
                await api.post('/transactions', formData);
            }
            navigate('/history'); // return to history after edit
        } catch (err) {
            alert(err.response?.data?.message || 'Error saving transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', paddingBottom: '80px' }}>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4" style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
                <ArrowLeft size={20} /> Back
            </button>

            <div className="glass-card">
                <h2 className="mb-4" style={{ fontSize: '1.5rem' }}>{editingTransaction ? 'Edit Transaction' : 'Add New Entry'}</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* ... (rest of form) ... */}
                    {/* I need to keep the form content intact, let's just target the header and button independently or broadly */}
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
                        <Save size={20} /> {loading ? 'Saving...' : (editingTransaction ? 'Update Transaction' : 'Save Transaction')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddEntry;
