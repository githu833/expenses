import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionAPI } from '../api';
import { PlusCircle, MinusCircle, IndianRupee, TextQuote, Save } from 'lucide-react';

const AddEntry = () => {
    const [type, setType] = useState('credit');
    const [amount, setAmount] = useState('');
    const [details, setDetails] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await transactionAPI.add({ type, amount: parseFloat(amount), details });
            navigate('/');
        } catch (err) {
            console.error(err);
            const errorData = err.response?.data;
            let errorMessage = errorData?.error || errorData?.msg || 'Failed to add transaction. Please ensure all backends are running.';

            if (errorData?.detail) {
                errorMessage += `\n\nDetail: ${errorData.detail}`;
            }
            if (errorData?.error && errorData?.msg) {
                errorMessage = `${errorData.msg}: ${errorData.error}`;
            }

            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>Add New Transaction</h1>

            <div className="glass-card">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <button
                        className="btn"
                        onClick={() => setType('credit')}
                        style={{ flex: 1, background: type === 'credit' ? 'var(--success)' : 'var(--glass)', border: type === 'credit' ? 'none' : '1px solid var(--glass-border)', justifyContent: 'center' }}
                    >
                        <PlusCircle size={20} /> Credit
                    </button>
                    <button
                        className="btn"
                        onClick={() => setType('debit')}
                        style={{ flex: 1, background: type === 'debit' ? 'var(--danger)' : 'var(--glass)', border: type === 'debit' ? 'none' : '1px solid var(--glass-border)', justifyContent: 'center' }}
                    >
                        <MinusCircle size={20} /> Debit
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>{type === 'credit' ? 'From Whom' : 'Purpose'}</label>
                        <div style={{ position: 'relative' }}>
                            <TextQuote size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder={type === 'credit' ? "e.g. Salary, John Doe" : "e.g. Rent, Groceries"}
                                style={{ paddingLeft: '40px' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Amount</label>
                        <div style={{ position: 'relative' }}>
                            <IndianRupee size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                style={{ paddingLeft: '40px' }}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Saving...' : <><Save size={20} /> Save Transaction</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddEntry;
