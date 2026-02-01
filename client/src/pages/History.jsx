import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../api';
import { ArrowUpRight, ArrowDownLeft, Clock, Calendar } from 'lucide-react';

const History = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await transactionAPI.getHistory();
                setTransactions(data);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch transaction history. Please ensure the backends are running.');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>;
    if (error) return <div style={{ color: 'var(--danger)', textAlign: 'center', padding: '4rem' }}>{error}</div>;

    return (
        <div className="fade-in">
            <h1 style={{ marginBottom: '2rem' }}>Transaction History</h1>

            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'var(--glass)', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1.25rem' }}>Details</th>
                            <th style={{ padding: '1.25rem' }}>Type</th>
                            <th style={{ padding: '1.25rem' }}>Amount</th>
                            <th style={{ padding: '1.25rem' }}>Balance After</th>
                            <th style={{ padding: '1.25rem' }}>Date & Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((t) => (
                            <tr key={t._id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ fontWeight: '600' }}>{t.details}</div>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '2rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        background: t.type === 'credit' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: t.type === 'credit' ? 'var(--success)' : 'var(--danger)'
                                    }}>
                                        {t.type === 'credit' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                                        {t.type.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem', fontWeight: '600', color: t.type === 'credit' ? 'var(--success)' : 'var(--danger)' }}>
                                    {t.type === 'credit' ? '+' : '-'}₹{t.amount.toFixed(2)}
                                </td>
                                <td style={{ padding: '1.25rem', fontWeight: 'bold' }}>
                                    ₹{t.balance_after.toFixed(2)}
                                </td>
                                <td style={{ padding: '1.25rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar size={14} /> {new Date(t.timestamp).toLocaleDateString()}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                        <Clock size={14} /> {new Date(t.timestamp).toLocaleTimeString()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No transactions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default History;
