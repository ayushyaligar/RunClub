import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { request } from '../api/client.js';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit() {
        setError('');
        if (password.length < 8) return setError('Password must be at least 8 characters.');

        setLoading(true);
        try {
        const data = await request('/auth/register', {
            method: 'POST',
            body: { name, email, password },
        });
        if (data.token) {
            login(data.token);
            navigate('/runs');
        } else {
            navigate('/login');
        }
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
            START<br />YOUR<br /><span className="accent">FIRST</span><br />RUN
            </div>
            <div className="login-foot">
            <span className="dot" />
            <span>BENGALURU&nbsp; · &nbsp;EST. 2026</span>
            </div>
        </div>

        <div className="login-form-wrap">
            <div className="login-form">
            <div className="field-label">NEW HERE</div>
            <h1 className="h2" style={{ fontSize: 56, marginBottom: 32 }}>REGISTER</h1>

            <div className="field">
                <label className="field-label">NAME</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

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
                {loading ? 'CREATING…' : 'CREATE ACCOUNT  →'}
            </button>

            <div style={{ marginTop: 20, fontSize: 11, letterSpacing: '0.1em', color: 'var(--grey)' }}>
                ALREADY A MEMBER? <Link to="/login" style={{ color: 'var(--red)', fontWeight: 700 }}>LOG IN</Link>
            </div>

            {error && <p className="state error" style={{ padding: '12px 0' }}>{error}</p>}
            </div>
        </div>
        </div>
    );
}