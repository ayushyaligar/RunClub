import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getAnnouncement, notifyMembers } from '../api/client.js';

export default function AdminNotify() {
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [ann, setAnn] = useState(null);
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(null);

    useEffect(() => {
        getAnnouncement(id, token)
        .then((a) => {
            setAnn(a);
            setSubject(a.title);
            setBody(`${a.description}\n\n${a.date ? `When: ${new Date(a.date).toDateString()}${a.time ? ` at ${a.time}` : ''}\n` : ''}${a.location ? `Where: ${a.location}\n` : ''}\nSee you there.\n\n— RunClub`);
        })
        .catch((err) => setError(err.message));
    }, [id, token]);

    async function handleSend() {
        setError('');
        setSending(true);
        try {
        const res = await notifyMembers(id, { subject, body }, token);
        setSent(res.recipients);
        } catch (err) {
        setError(err.message);
        } finally {
        setSending(false);
        }
    }

    if (error && !ann) return <p className="state error">{error}</p>;
    if (!ann) return <p className="state">LOADING…</p>;

    if (sent !== null) {
        return (
        <div className="hero">
            <div className="eyebrow"><span className="dot" /><span>SENT</span></div>
            <h1 className="h2">ON ITS WAY</h1>
            <p className="tagline">QUEUED FOR {sent} MEMBER{sent === 1 ? '' : 'S'}.</p>
            <button className="btn" style={{ marginTop: 28 }} onClick={() => navigate('/runs')}>
            BACK TO RUNS
            </button>
        </div>
        );
    }

    return (
    <>
        <div className="hero">
            <div className="eyebrow"><span className="tag">ADMIN</span></div>
            <h1 className="h2">NOTIFY MEMBERS</h1>
            <p className="tagline">{ann.title}</p>
        </div>

        <div className="section" style={{ borderBottom: 0, maxWidth: 680 }}>
            <div className="field">
            <label className="field-label">SUBJECT</label>
            <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>

            <div className="field">
            <label className="field-label">MESSAGE</label>
            <textarea
                className="input"
                rows={12}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                style={{ resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }}
            />
            </div>

            <p className="row-meta" style={{ marginBottom: 24 }}>
            THIS GOES TO EVERY REGISTERED MEMBER. IT CANNOT BE UNSENT.
            </p>

            <button className="btn" onClick={handleSend} disabled={sending || !subject || !body}>
            {sending ? 'SENDING…' : 'SEND TO ALL MEMBERS  →'}
            </button>

            {error && <p className="state error" style={{ padding: '16px 0' }}>{error}</p>}
        </div>
        </>
    );
}