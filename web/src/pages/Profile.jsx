import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { request } from '../api/client.js';

export default function Profile() {
    const { token } = useAuth();
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        request('/users/me', { token })
        .then(setData)
        .catch((err) => setError(err.message));
    }, [token]);

    if (error) return <p className="state error">{error}</p>;
    if (!data) return <p className="state">LOADING…</p>;

    const { user, badges, history } = data;
    const earned = badges.filter(b => b.earned).length;
    const totalKm = history.reduce((sum, h) => sum + (h.run?.distanceKm || 0), 0);

    return (
        <>
        <div className="hero">
            <div className="eyebrow">
            <span className="dot" />
            <span>{user.role.toUpperCase()}</span>
            </div>
            <h1 className="h2">{user.name}</h1>
            <div className="tagline">{user.email}</div>
        </div>

        <div className="stat-row">
            <div className="stat">
            <div className="stat-value">{user.totalRuns}</div>
            <div className="stat-label">RUNS COMPLETED</div>
            </div>
            <div className="stat">
            <div className="stat-value">{totalKm}</div>
            <div className="stat-label">KILOMETRES</div>
            </div>
            <div className="stat">
            <div className="stat-value">{earned}<span style={{ color: 'var(--mute)' }}>/{badges.length}</span></div>
            <div className="stat-label">BADGES</div>
            </div>
        </div>

        <div className="section" style={{ borderBottom: 0, paddingBottom: 0 }}>
            <div className="section-label">BADGES</div>
        </div>
        <div className="badges">
            {badges.map(b => (
            <div key={b.key} className={`badge-card${b.earned ? '' : ' locked'}`}>
                <div className="badge-mark">{b.earned ? '✓' : b.threshold}</div>
                <div className="badge-name">{b.label}</div>
                <div className="badge-req">
                {b.earned ? 'EARNED' : `${b.threshold - user.totalRuns} MORE TO GO`}
                </div>
            </div>
            ))}
        </div>

        <div className="section" style={{ borderBottom: 0, paddingBottom: 0 }}>
            <div className="section-label">ATTENDANCE HISTORY</div>
        </div>
        {history.length === 0 ? (
            <p className="state">NO RUNS YET.</p>
        ) : (
            <div className="hist">
            {history.map(h => (
                <div key={h._id} className="hist-row">
                <span className="hist-date">
                    {new Date(h.checkedInAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()}
                </span>
                <span className="hist-title">{h.run.title}</span>
                <span className="badge">{h.run.distanceKm} KM</span>
                </div>
            ))}
            </div>
        )}
        </>
    );
}