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
            <Link to="/" style={{
                color: (isActive('/') || isActive('/dashboard')) ? 'var(--primary)' : 'var(--text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                gap: '4px',
                padding: '8px 16px', // Larger touch target
                flex: 1
            }}>
                <Home size={24} />
                <span style={{ fontSize: '0.8rem', fontWeight: (isActive('/') || isActive('/dashboard')) ? '600' : '400' }}>Home</span>
            </Link>

            <Link to="/history" style={{
                color: isActive('/history') ? 'var(--primary)' : 'var(--text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                gap: '4px',
                padding: '8px 16px', // Larger touch target
                flex: 1
            }}>
                <HistoryIcon size={24} />
                <span style={{ fontSize: '0.8rem', fontWeight: isActive('/history') ? '600' : '400' }}>History</span>
            </Link>
        </footer>
    );
};

export default Footer;
