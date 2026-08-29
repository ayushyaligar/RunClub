import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { request } from '../api/client.js';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit() {
        setError('');
        setLoading(true);
        try {
        const data = await request('/auth/login', {
            method: 'POST',
            body: { email, password },
        });
        login(data.token);
        navigate('/runs');
        } catch (err) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: 320 }}>
        <h2>Log in</h2>

        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ display: 'block', width: '100%', marginBottom: 8 }}
        />

        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            style={{ display: 'block', width: '100%', marginBottom: 8 }}
        />

        <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Logging in…' : 'Log in'}
        </button>

        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        </div>
    );
}