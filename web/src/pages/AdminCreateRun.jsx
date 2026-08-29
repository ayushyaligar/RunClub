import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { request } from '../api/client.js';

export default function AdminCreateRun() {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: '', date: '', time: '', location: '', distanceKm: '', description: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    async function handleSubmit() {
        setError('');
        setLoading(true);
        try {
        const run = await request('/runs', {
            method: 'POST',
            token,
            body: { ...form, distanceKm: Number(form.distanceKm) },
        });
        navigate(`/runs/${run._id}`);
        } catch (err) {
        setError(err.message);
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
            <h1 className="h2">NEW RUN</h1>
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
            {loading ? 'CREATING…' : 'CREATE RUN  →'}
            </button>

            {error && <p className="state error" style={{ padding: '16px 0' }}>{error}</p>}
        </div>
        </>
    );
}