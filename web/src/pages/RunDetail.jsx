import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getRun, rsvpToRun, cancelRsvp, redeemCode, generateCode } from '../api/client.js';

export default function RunDetail() {
    const { id } = useParams();
    const { token, user } = useAuth();

    const [run, setRun] = useState(null);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const [code, setCode] = useState('');
    const [adminCode, setAdminCode] = useState(null);
    const [notice, setNotice] = useState('');

    async function load() {
        try {
        setRun(await getRun(id, token));
        } catch (err) {
        setError(err.message);
        }
    }

    useEffect(() => { load(); }, [id, token]);

    async function act(fn) {
        setError('');
        setNotice('');
        setBusy(true);
        try {
        await fn();
        await load();
        } catch (err) {
        setError(err.message);
        } finally {
        setBusy(false);
        }
    }

    if (error && !run) return <p className="state error">{error}</p>;
    if (!run) return <p className="state">LOADING…</p>;

    const d = new Date(run.date);

    return (
        <>
        <div className="hero">
            <Link to="/runs" className="back">←&nbsp;&nbsp;ALL RUNS</Link>
            <div className="eyebrow">
            <span className="dot" />
            <span>{d.toDateString().toUpperCase()}</span>
            </div>
            <h1 className="h2">{run.title}</h1>
        </div>

        <div className="spec">
            <div className="spec-cell">
            <div className="spec-label">TIME</div>
            <div className="spec-value">{run.time}</div>
            </div>
            <div className="spec-cell">
            <div className="spec-label">DISTANCE</div>
            <div className="spec-value">{run.distanceKm} KM</div>
            </div>
            <div className="spec-cell">
            <div className="spec-label">LOCATION</div>
            <div className="spec-value">{run.location}</div>
            </div>
            <div className="spec-cell">
            <div className="spec-label">GOING</div>
            <div className="spec-value">{run.rsvpCount}</div>
            </div>
        </div>

        <div className="band">
            <div>
            <div className="band-title">{run.hasRsvped ? "YOU'RE GOING" : 'NOT GOING YET'}</div>
            <div className="band-sub">{run.rsvpCount} RSVP’D</div>
            </div>
            {run.hasRsvped
            ? <button className="btn btn-light" onClick={() => act(() => cancelRsvp(id, token))} disabled={busy}>CANCEL RSVP</button>
            : <button className="btn btn-light" onClick={() => act(() => rsvpToRun(id, token))} disabled={busy}>RSVP</button>}
        </div>

        <div className="section">
            <div className="section-label">CHECK IN</div>
            {run.hasCheckedIn ? (
            <div className="section-title">✓ YOU’RE CHECKED IN</div>
            ) : (
            <>
                <div className="section-title">ENTER THE CODE FROM TODAY’S RUN</div>
                <div className="checkin">
                <input
                    className="code-input"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                />
                <button
                    className="btn"
                    disabled={busy || code.length !== 6}
                    onClick={() => act(async () => { await redeemCode(id, code, token); setCode(''); })}
                >
                    CHECK IN&nbsp;&nbsp;→
                </button>
                </div>
            </>
            )}
        </div>

        {user?.role === 'admin' && (
            <div className="section" style={{ borderBottom: 0 }}>
            <div className="eyebrow">
                <span className="tag">ADMIN</span>
                <span className="section-label">ATTENDANCE CODE</span>
            </div>
            <div className="code-card">
                <div>
                <div className="code-big">{adminCode ? `${adminCode.slice(0,3)} ${adminCode.slice(3)}` : '— — —'}</div>
                <div className="code-sub">{notice || 'NO ACTIVE CODE'}</div>
                </div>
                <button className="btn btn-ghost" onClick={() => act(async () => {
                const res = await generateCode(id, token);
                setAdminCode(res.code);
                setNotice(`EXPIRES ${new Date(res.expiresAt).toLocaleTimeString()}`);
                })} disabled={busy}>
                {adminCode ? 'REGENERATE' : 'GENERATE'}
                </button>
            </div>

            <Link
                to={`/admin/runs/${id}/edit`}
                className="btn btn-ghost"
                style={{ textDecoration: 'none', marginTop: 20, display: 'inline-block' }}
            >
                EDIT RUN
            </Link>
            </div>
        )}

        {error && <p className="state error">{error}</p>}
        </>
    );
}