import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Home, PlusCircle, History as HistoryIcon, Wallet } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!token) return null;

    return (
        <nav className="glass-card" style={{ borderRadius: '0 0 1rem 1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                <Wallet size={24} />
                <span>ExpenseTracker</span>
            </div>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link to="/" className="btn btn-outline" style={{ border: 'none', color: 'var(--text-main)', textDecoration: 'none' }}>
                    <Home size={20} /> Dashboard
                </Link>
                <Link to="/add" className="btn btn-outline" style={{ border: 'none', color: 'var(--text-main)', textDecoration: 'none' }}>
                    <PlusCircle size={20} /> Add Entry
                </Link>
                <Link to="/history" className="btn btn-outline" style={{ border: 'none', color: 'var(--text-main)', textDecoration: 'none' }}>
                    <HistoryIcon size={20} /> History
                </Link>
                <div style={{ height: '24px', width: '1px', background: 'var(--glass-border)' }}></div>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{user?.email}</span>
                <button onClick={logout} className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                    <LogOut size={20} /> Logout
                </button>
            </div>
        </nav >
    );
};

export default Navbar;
