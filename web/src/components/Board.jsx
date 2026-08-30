import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getAnnouncements } from '../api/client.js';

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

export default function Board() {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [i, setI] = useState(0);

    useEffect(() => {
        getAnnouncements().then(setItems).catch(() => setItems([]));
    }, []);

    if (items.length === 0) return null;

    const a = items[i];
    const d = a.date ? new Date(a.date) : null;
    const go = (n) => setI((n + items.length) % items.length);

    return (
        <section className="carousel">
        <div className="carousel-top">
            <div className="eyebrow" style={{ color: 'var(--paper)' }}>
            <span className="dot" />
            <span>{d ? 'UPCOMING EVENT' : 'NOTICE'}</span>
            {user?.role === 'admin' && (
                <Link to="/admin/announcements/new" className="carousel-new">+ NEW</Link>
            )}
            </div>

            {items.length > 1 && (
            <div className="carousel-nav">
                <button onClick={() => go(i - 1)} aria-label="Previous">←</button>
                <span className="carousel-count">{i + 1} / {items.length}</span>
                <button onClick={() => go(i + 1)} aria-label="Next">→</button>
            </div>
            )}
        </div>

        <div className="carousel-body">
            {d && (
            <div className="carousel-date">
                {String(d.getDate()).padStart(2, '0')} {MONTHS[d.getMonth()]}
                {a.time && <span className="carousel-time">{a.time}</span>}
            </div>
            )}

            <h2 className="carousel-title">{a.title}</h2>
            <p className="carousel-desc">{a.description}</p>

            <div className="carousel-foot">
            {a.location && <span className="carousel-where">{a.location.toUpperCase()}</span>}
            {user?.role === 'admin' && (
                <Link to={`/admin/announcements/${a._id}/edit`} className="carousel-edit">EDIT</Link>
            )}
            </div>
        </div>

        {items.length > 1 && (
            <div className="carousel-dots">
            {items.map((item, n) => (
                <button
                key={item._id}
                className={n === i ? 'on' : ''}
                onClick={() => setI(n)}
                aria-label={`Go to ${n + 1}`}
                />
            ))}
            </div>
        )}
        </section>
    );
}