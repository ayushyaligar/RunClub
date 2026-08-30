import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { request } from '../api/client.js';

const EMPTY = { title: '', date: '', time: '', location: '', distanceKm: '', description: '' };

export default function AdminRunForm() {
    const { id } = useParams();
    const editing = Boolean(id);
    const { token } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState(EMPTY);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        if (!editing) return;
        request(`/runs/${id}`, { token })
        .then((run) => setForm({
            title: run.title || '',
            date: run.date ? run.date.slice(0, 10) : '',
            time: run.time || '',
            location: run.location || '',
            distanceKm: run.distanceKm ?? '',
            description: run.description || '',
        }))
        .catch((err) => setError(err.message));
    }, [id, editing, token]);

    const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    async function handleSubmit() {
        setError('');
        setLoading(true);
        try {
        const body = { ...form, distanceKm: Number(form.distanceKm) };
        const run = editing
            ? await request(`/runs/${id}`, { method: 'PUT', token, body })
            : await request('/runs', { method: 'POST', token, body });
        navigate(`/runs/${run._id || id}`);
        } catch (err) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    }

    async function handleDelete() {
        setError('');
        setLoading(true);
        try {
        await request(`/runs/${id}`, { method: 'DELETE', token });
        navigate('/runs');
        } catch (err) {
        setError(err.message);
        setConfirming(false);
        } finally {
        setLoading(false);
        }
    }

    const ready = form.title && form.date && form.time && form.location && form.distanceKm;

    return (
        <>
        <div className="hero">
            <div className="eyebrow">
            <span className="tag">ADMIN</span>
            </div>
            <h1 className="h2">{editing ? 'EDIT RUN' : 'NEW RUN'}</h1>
        </div>

        <div className="section" style={{ borderBottom: 0, maxWidth: 640 }}>
            <div className="field">
            <label className="field-label">TITLE</label>
            <input className="input" value={form.title} onChange={set('title')} placeholder="Cubbon Park 5K" />
            </div>

            <div style={{ display: 'flex', gap: 24 }}>
            <div className="field" style={{ flex: 1 }}>
                <label className="field-label">DATE</label>
                <input className="input" type="date" value={form.date} onChange={set('date')} />
            </div>
            <div className="field" style={{ flex: 1 }}>
                <label className="field-label">TIME</label>
                <input className="input" type="time" value={form.time} onChange={set('time')} />
            </div>
            </div>

            <div className="field">
            <label className="field-label">LOCATION</label>
            <input className="input" value={form.location} onChange={set('location')} placeholder="Cubbon Park" />
            </div>

            <div className="field">
            <label className="field-label">DISTANCE (KM)</label>
            <input className="input" type="number" min="1" value={form.distanceKm} onChange={set('distanceKm')} placeholder="5" />
            </div>

            <div className="field">
            <label className="field-label">DESCRIPTION</label>
            <input className="input" value={form.description} onChange={set('description')} placeholder="Easy pace" />
            </div>

            <button className="btn" onClick={handleSubmit} disabled={loading || !ready}>
            {loading ? 'SAVING…' : editing ? 'SAVE CHANGES  →' : 'CREATE RUN  →'}
            </button>

            {error && <p className="state error" style={{ padding: '16px 0' }}>{error}</p>}
        </div>

        {editing && (
            <div className="section" style={{ borderTop: '1px solid var(--ink)', borderBottom: 0, marginTop: 40 }}>
            <div className="section-label">DANGER ZONE</div>
            {confirming ? (
                <div style={{ marginTop: 20, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <span className="row-meta">THIS CANNOT BE UNDONE.</span>
                <button className="btn" style={{ background: 'var(--red)', borderColor: 'var(--red)' }} onClick={handleDelete} disabled={loading}>
                    YES, DELETE
                </button>
                <button className="btn btn-ghost" onClick={() => setConfirming(false)}>CANCEL</button>
                </div>
            ) : (
                <button className="btn btn-ghost" style={{ marginTop: 20 }} onClick={() => setConfirming(true)}>
                DELETE RUN
                </button>
            )}
            </div>
        )}
        </>
    );
}