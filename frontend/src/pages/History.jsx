import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { ArrowUpCircle, ArrowDownCircle, Trash2, PlusCircle, Edit2 } from 'lucide-react';

import { Link } from 'react-router-dom';

const History = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sources, setSources] = useState([]); // Need sources for names
    const { user } = useAuth(); // Get user if needed, or remove if unused

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [transRes, sourcesRes] = await Promise.all([
                    api.get('/transactions'),
                    api.get('/sources')
                ]);
                setTransactions(transRes.data);
                setSources(sourcesRes.data);
            } catch (err) {
                console.error('Error fetching history data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this transaction?')) {
            try {
                await api.delete(`/transactions/${id}`);
                setTransactions(transactions.filter(t => t._id !== id));
            } catch (err) {
                alert('Failed to delete transaction');
            }
        }
    };

    if (loading) return <div className="container" style={{ paddingBottom: '80px' }}>Loading...</div>;

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            <div className="flex justify-between items-center mb-4">
                <h2 style={{ fontSize: '1.8rem' }}>History</h2>
                <Link to="/add">
                    <button className="btn-primary flex items-center gap-2">
                        <PlusCircle size={20} /> Add
                    </button>
                </Link>
            </div>

            <div className="flex flex-col gap-4">
                {(() => {
                    const displayTransactions = transactions.filter(t => t.purpose !== 'Initial Balance Setup');
                    if (displayTransactions.length === 0) {
                        return <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No transactions found.</p>;
                    }
                    return displayTransactions.map(t => (
                        <div key={t._id} className="glass-card flex justify-between items-center" style={{ padding: '16px 24px' }}>
                            <div className="flex items-center gap-4">
                                {t.type === 'income' ?
                                    <ArrowUpCircle color="var(--income)" size={32} /> :
                                    <ArrowDownCircle color="var(--expense)" size={32} />
                                }
                                <div>
                                    <h4 style={{ fontWeight: '600' }}>{t.type === 'income' ? (t.source || 'Income') : (t.purpose || 'Expense')}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {sources.find(s => s._id.toString() === t.sourceId?.toString())?.name || 'Unknown Source'} • {t.category ? `${t.category} • ` : ''}{new Date(t.date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span style={{
                                    fontWeight: '700',
                                    fontSize: '1.1rem',
                                    color: t.type === 'income' ? 'var(--income)' : 'var(--expense)'
                                }}>
                                    {t.type === 'income' ? '+' : '-'} ₹{t.amount.toLocaleString()}
                                </span>
                                <Link to="/add" state={{ transaction: t }} style={{ color: 'var(--text-secondary)', background: 'transparent' }}>
                                    <Edit2 size={18} />
                                </Link>
                                <button onClick={() => handleDelete(t._id)} style={{ color: 'var(--text-secondary)', background: 'transparent' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ));
                })()}
            </div>
        </div>
    );
};

export default History;
