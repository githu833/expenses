import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { LogIn, UserPlus } from 'lucide-react';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/signup';
            const { data } = await api.post(endpoint, { email, password });
            login(data);
            navigate(isLogin ? '/dashboard' : '/onboarding');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="flex justify-between items-center" style={{ minHeight: '80vh' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
                <div className="flex items-center gap-2 mb-4" style={{ justifyContent: 'center' }}>
                    {isLogin ? <LogIn size={24} /> : <UserPlus size={24} />}
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {isLogin ? 'Login' : 'Create Account'}
                    </h2>
                </div>

                {error && <div style={{ color: 'var(--expense)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="mb-4" style={{ display: 'block', marginBottom: '8px' }}>Email</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary mt-4">
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-4" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Auth;
