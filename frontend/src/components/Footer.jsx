import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, History as HistoryIcon, PlusCircle, Wallet } from 'lucide-react';

const Footer = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <footer style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            background: 'rgba(30, 41, 59, 0.8)', // slightly darker backdrop
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid var(--border)',
            padding: '12px 0',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 1000,
            paddingBottom: '20px' // Extra padding for mobile bottom bar
        }}>
            <Link to="/dashboard" style={{
                color: isActive('/dashboard') ? 'var(--primary)' : 'var(--text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                gap: '4px'
            }}>
                <Home size={24} />
                <span style={{ fontSize: '0.75rem' }}>Home</span>
            </Link>

            <Link to="/add" style={{
                color: isActive('/add') ? 'var(--primary)' : 'var(--text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                gap: '4px'
            }}>
                <PlusCircle size={32} color={isActive('/add') ? 'var(--primary)' : 'var(--text-secondary)'} />
                {/* <span style={{ fontSize: '0.75rem' }}>Add</span> */}
            </Link>

            <Link to="/history" style={{
                color: isActive('/history') ? 'var(--primary)' : 'var(--text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                gap: '4px'
            }}>
                <HistoryIcon size={24} />
                <span style={{ fontSize: '0.75rem' }}>History</span>
            </Link>
            <Link to="/sources" style={{
                color: isActive('/sources') ? 'var(--primary)' : 'var(--text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                gap: '4px'
            }}>
                <Wallet size={24} />
                <span style={{ fontSize: '0.75rem' }}>Sources</span>
            </Link>
        </footer>
    );
};

export default Footer;
