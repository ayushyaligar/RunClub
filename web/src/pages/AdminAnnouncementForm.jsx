import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getAnnouncement, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../api/client.js';

const EMPTY = { title: '', description: '', date: '', time: '', location: '' };

export default function AdminAnnouncementForm() {
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
        getAnnouncement(id, token)
        .then((a) => setForm({
            title: a.title || '',
            description: a.description || '',
            date: a.date ? a.date.slice(0, 10) : '',
            time: a.time || '',
            location: a.location || '',
        }))
        .catch((err) => setError(err.message));
    }, [id, editing, token]);

    const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    async function handleSubmit() {
        setError('');
        setLoading(true);
        try {
        if (editing) await updateAnnouncement(id, form, token);
        else await createAnnouncement(form, token);
        navigate('/runs');
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
        await deleteAnnouncement(id, token);
        navigate('/runs');
        } catch (err) {
        setError(err.message);
        setConfirming(false);
        } finally {
        setLoading(false);
        }
    }

    const ready = form.title && form.description;

    return (
        <>
        <div className="hero">
            <div className="eyebrow">
            <span className="tag">ADMIN</span>
            </div>
            <h1 className="h2">{editing ? 'EDIT NOTICE' : 'NEW NOTICE'}</h1>
        </div>

        <div className="section" style={{ borderBottom: 0, maxWidth: 640 }}>
            <div className="field">
            <label className="field-label">TITLE</label>
            <input className="input" value={form.title} onChange={set('title')} placeholder="Republic Day 10K" />
            </div>

            <div className="field">
            <label className="field-label">DESCRIPTION</label>
            <textarea
                className="input"
                rows={3}
                value={form.description}
                onChange={set('description')}
                placeholder="Special event run followed by breakfast."
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
            </div>

            <div style={{ display: 'flex', gap: 24 }}>
            <div className="field" style={{ flex: 1 }}>
                <label className="field-label">DATE (OPTIONAL)</label>
                <input className="input" type="date" value={form.date} onChange={set('date')} />
            </div>
            <div className="field" style={{ flex: 1 }}>
                <label className="field-label">TIME (OPTIONAL)</label>
                <input className="input" type="time" value={form.time} onChange={set('time')} />
            </div>
            </div>

            <div className="field">
            <label className="field-label">LOCATION (OPTIONAL)</label>
            <input className="input" value={form.location} onChange={set('location')} placeholder="Cubbon Park Bandstand" />
            </div>

            <p className="row-meta" style={{ marginBottom: 24 }}>
            LEAVE THE DATE EMPTY FOR A NOTICE THAT DOESN’T EXPIRE.
            </p>

            <button className="btn" onClick={handleSubmit} disabled={loading || !ready}>
            {loading ? 'SAVING…' : editing ? 'SAVE CHANGES  →' : 'POST NOTICE  →'}
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
                DELETE NOTICE
                </button>
            )}
            </div>
        )}
        </>
    );
}