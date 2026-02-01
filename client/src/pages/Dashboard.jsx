import React, { useState, useEffect } from 'react';
import { transactionAPI, api } from '../api';
import { TrendingUp, TrendingDown, CreditCard, Loader2 } from 'lucide-react';

const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const { data } = await transactionAPI.getSummary();
                setSummary(data);
            } catch (err) {
                console.error(err);
                const targetUrl = `${api.defaults.baseURL}/transactions/summary/`;
                setError(`Failed to fetch financial overview. (Target: ${targetUrl})`);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}><Loader2 className="animate-spin" size={48} /></div>;
    if (error) return <div style={{ color: 'var(--danger)', textAlign: 'center', marginTop: '4rem' }}>{error}</div>;

    const cards = [
        { title: 'Remaining Balance', value: summary?.balance || 0, icon: <CreditCard />, color: 'var(--primary)' },
        { title: 'Total Credited', value: summary?.total_credit || 0, icon: <TrendingUp />, color: 'var(--success)' },
        { title: 'Total Debited', value: summary?.total_debit || 0, icon: <TrendingDown />, color: 'var(--danger)' },
    ];

    return (
        <div className="fade-in">
            <h1 style={{ marginBottom: '2rem' }}>Financial Overview (Live v2)</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Build ID: 2026-02-01-1605</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {cards.map((card, idx) => (
                    <div key={idx} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: `1px solid ${card.color} 40`, color: card.color, padding: '1rem', borderRadius: '1rem' }}>
                            {React.cloneElement(card.icon, { size: 32 })}
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{card.title}</p>
                            <h2 style={{ fontSize: '1.75rem' }}>₹{card.value.toFixed(2)}</h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart or Recent activity placeholder */}
            <div className="glass-card">
                <h3>Account Insights</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Your financial data is visualized here. Start adding transactions to see more insights.</p>
            </div>
        </div>
    );
};

export default Dashboard;
