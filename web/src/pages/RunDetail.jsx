import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

    if (error && !run) return <p style={{ color: 'crimson' }}>{error}</p>;
    if (!run) return <p>Loading…</p>;

    return (
        <div style={{ maxWidth: 480 }}>
        <h2>{run.title}</h2>
        <p>
            {new Date(run.date).toLocaleDateString()} at {run.time}<br />
            {run.location} · {run.distanceKm}km
        </p>
        {run.description && <p>{run.description}</p>}
        <p>{run.rsvpCount} going</p>

        <hr />

        {run.hasRsvped
            ? <button onClick={() => act(() => cancelRsvp(id, token))} disabled={busy}>Cancel RSVP</button>
            : <button onClick={() => act(() => rsvpToRun(id, token))} disabled={busy}>RSVP</button>}

        <hr />

        {run.hasCheckedIn ? (
            <p>✓ Checked in</p>
        ) : (
            <div>
            <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="6-digit code"
                maxLength={6}
                style={{ marginRight: 8 }}
            />
            <button
                onClick={() => act(async () => {
                await redeemCode(id, code, token);
                setCode('');
                })}
                disabled={busy || code.length !== 6}
            >
                Check in
            </button>
            </div>
        )}

        {user?.role === 'admin' && (
            <>
            <hr />
            <button
                onClick={() => act(async () => {
                const res = await generateCode(id, token);
                setAdminCode(res.code);
                setNotice(`Code: ${res.code} (expires ${new Date(res.expiresAt).toLocaleTimeString()})`);
                })}
                disabled={busy}
            >
                Generate attendance code
            </button>
            {adminCode && <p style={{ fontSize: '1.5em', fontFamily: 'monospace' }}>{adminCode}</p>}
            </>
        )}

        {notice && <p style={{ color: 'green' }}>{notice}</p>}
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        </div>
    );
}