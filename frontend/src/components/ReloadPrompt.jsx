import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

function ReloadPrompt() {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needUpdate, setNeedUpdate],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered');
        },
        onRegisterError(error) {
            console.log('SW registration error', error);
        },
    });

    const close = () => {
        setOfflineReady(false);
        setNeedUpdate(false);
    };

    if (!offlineReady && !needUpdate) return null;

    return (
        <div className="glass-card" style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1000,
            width: 'calc(100% - 48px)',
            maxWidth: '350px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: 'rgba(23, 23, 27, 0.95)',
            boxShadow: 'var(--shadow-premium), var(--shadow-glow)',
            animation: 'slideUp 0.3s ease-out'
        }}>
            <div style={{ textAlign: 'center' }}>
                {offlineReady ? (
                    <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>App is ready to work offline!</p>
                ) : (
                    <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>New content available! Update now for the latest features.</p>
                )}
            </div>
            <div className="flex gap-2">
                {needUpdate && (
                    <button
                        onClick={() => updateServiceWorker(true)}
                        className="btn-primary"
                        style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                    >
                        Reload
                    </button>
                )}
                <button
                    onClick={close}
                    style={{ 
                        flex: 1, 
                        background: 'var(--glass)', 
                        color: 'var(--text-secondary)',
                        padding: '10px',
                        fontSize: '0.85rem'
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default ReloadPrompt;
