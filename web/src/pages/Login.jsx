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
        <div className="login">
        <div className="login-panel">
        <div />
            <div className="login-display">
            EVERY<br />PACE<br />HAS A<br /><span className="accent">PLACE</span>
            </div>
            <div className="login-foot">
            <span className="dot" />
            <span>HUBLI&nbsp; · &nbsp;EST. 2026</span>
            </div>
        </div>

        <div className="login-form-wrap">
            <div className="login-form">
            <div className="field-label">WELCOME BACK</div>
            <h1 className="h2" style={{ fontSize: 56, marginBottom: 32 }}>LOG IN</h1>

            <div className="field">
                <label className="field-label">EMAIL</label>
                <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="field">
                <label className="field-label">PASSWORD</label>
                <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
            </div>

            <button className="btn btn-full" onClick={handleSubmit} disabled={loading}>
                {loading ? 'LOGGING IN…' : 'LOG IN  →'}
            </button>

            {error && <p className="state error" style={{ padding: '12px 0' }}>{error}</p>}
            </div>
        </div>
        </div>
    );
}