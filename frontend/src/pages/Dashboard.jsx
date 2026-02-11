import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { PlusCircle, ArrowUpCircle, ArrowDownCircle, Trash2, LogOut, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBreakdown, setShowBreakdown] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const [transRes, sourcesRes] = await Promise.all([
                api.get('/transactions'),
                api.get('/sources')
            ]);
            setTransactions(transRes.data);
            setSources(sourcesRes.data);
            if (sourcesRes.data.length === 0) {
                navigate('/onboarding');
            }
        } catch (err) {
            console.error('Error fetching data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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

    // Calculate totals and per-source breakdown
    const totals = transactions.reduce((acc, curr) => {
        if (curr.type === 'income') acc.income += curr.amount;
        else acc.expense += curr.amount;

        const sourceKey = curr.sourceId?.toString();
        if (sourceKey) {
            if (!acc.sources[sourceKey]) acc.sources[sourceKey] = 0;
            acc.sources[sourceKey] += (curr.type === 'income' ? curr.amount : -curr.amount);
        }

        return acc;
    }, { income: 0, expense: 0, sources: {} });

    const balance = totals.income - totals.expense;

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            {/* Modal Breakdown Overlay */}
            {showBreakdown && (
                <div className="modal-overlay animate-in" onClick={() => setShowBreakdown(false)}>
                    <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setShowBreakdown(false)}>
                            <X size={24} />
                        </button>
                        <h2 className="mb-4" style={{ fontSize: '1.5rem', textAlign: 'center' }}>Account Balances</h2>
                        <div className="flex flex-col gap-4 mt-4 p-4">
                            {sources.length === 0 ? (
                                <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No sources found.</p>
                            ) : (
                                sources.map(s => (
                                    <div key={s._id} className="flex justify-between items-center" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                                        <span style={{ fontSize: '1.1rem' }}>{s.name}</span>
                                        <span style={{ fontWeight: '700', fontSize: '1.2rem', color: (totals.sources[s._id.toString()] || 0) >= 0 ? 'var(--income)' : 'var(--expense)' }}>
                                            ₹{(totals.sources[s._id.toString()] || 0).toLocaleString()}
                                        </span>
                                    </div>
                                ))
                            )}
                            <div className="flex justify-between items-center mt-4" style={{ paddingTop: '16px', borderTop: '2px solid var(--primary)' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Total Balance</span>
                                <span style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--balance)' }}>
                                    ₹{balance.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <header className="flex justify-between items-center mb-4">
                <div>
                    <h1 style={{ fontSize: '1.8rem' }}>Welcome, {user?.email.split('@')[0]}</h1>
                    <div
                        onClick={() => setShowBreakdown(true)}
                        style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginTop: '4px'
                        }}
                        title="Click to see breakdown"
                    >
                        <p style={{ color: 'var(--text-secondary)' }}>Total Balance:</p>
                        <h2 style={{ fontSize: '1.4rem', color: 'var(--balance)' }}>₹{balance.toLocaleString()}</h2>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>▼</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link to="/sources">
                        <button style={{ background: 'var(--glass)', color: 'var(--text-secondary)', padding: '8px 12px' }}>
                            Sources
                        </button>
                    </Link>
                    <button onClick={logout} className="flex items-center gap-2" style={{ color: 'var(--expense)', background: 'transparent' }}>
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div
                    className="glass-card"
                    style={{ borderLeft: '4px solid var(--balance)', cursor: 'pointer' }}
                    onClick={() => setShowBreakdown(true)}
                >
                    <p style={{ color: 'var(--text-secondary)' }}>Total Balance (Click for detail)</p>
                    <h2 style={{ fontSize: '2rem' }}>₹{balance.toLocaleString()}</h2>
                </div>
                <div className="glass-card" style={{ borderLeft: '4px solid var(--income)' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>Total Income</p>
                    <h2 style={{ fontSize: '2rem', color: 'var(--income)' }}>₹{totals.income.toLocaleString()}</h2>
                </div>
                <div className="glass-card" style={{ borderLeft: '4px solid var(--expense)' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>Total Expense</p>
                    <h2 style={{ fontSize: '2rem', color: 'var(--expense)' }}>₹{totals.expense.toLocaleString()}</h2>
                </div>
            </div>

            {/* <div className="flex justify-between items-center mb-4">
                <h3 style={{ fontSize: '1.4rem' }}>Recent Transactions</h3>
                <Link to="/add">
                    <button className="btn-primary flex items-center gap-2">
                        <PlusCircle size={20} /> Add Entry
                    </button>
                </Link>
            </div> */}

            {/* Start adding bottom padding for footer visibility */}
            <div style={{ paddingBottom: '80px' }}></div>

        </div>
    );
};

export default Dashboard;
