import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../api/client.js';
import Board from '../components/Board.jsx';

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function Row({ run, i, dim }) {
    const d = new Date(run.date);
    return (
        <Link to={`/runs/${run._id}`} className={`row${dim ? ' past' : ''}`}>
        <div className="row-date">
            <div className={`row-day${i === 0 && !dim ? ' next' : ''}`}>
            {String(d.getDate()).padStart(2, '0')}
            </div>
            <div className="row-month">
            {MONTHS[d.getMonth()]}{dim ? ` ’${String(d.getFullYear()).slice(2)}` : ''}
            </div>
        </div>
        <div className="row-main">
            <div className="row-title">{run.title}</div>
            <div className="row-meta">{run.time}&nbsp; · &nbsp;{run.location}</div>
        </div>
        <div className="row-right">
            <span className="badge">{run.distanceKm} KM</span>
            <span className="arrow">→</span>
        </div>
        </Link>
    );
}

export default function RunsList() {
    const [data, setData] = useState({ upcoming: [], past: [] });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        request('/runs')
        .then(setData)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="state">LOADING…</p>;
    if (error) return <p className="state error">{error}</p>;

    return (
        <>
        <Board />
        <div className="hero">
            <div className="eyebrow">
            <span className="dot" />
            <span>HUBLI</span>
            <span className="muted">{data.upcoming.length} SCHEDULED</span>
            </div>
            <h1 className="h1">UPCOMING</h1>
            <div className="tagline">EVERY PACE HAS A PLACE.</div>
        </div>

        <div className="list">
            {data.upcoming.length === 0
            ? <p className="state">NOTHING SCHEDULED YET.</p>
            : data.upcoming.map((run, i) => <Row key={run._id} run={run} i={i} />)}
        </div>

        {data.past.length > 0 && (
            <>
            <div className="hero" style={{ paddingTop: 64, paddingBottom: 24 }}>
                <h2 className="h1" style={{ fontSize: 'clamp(36px, 5vw, 64px)', color: 'var(--grey)' }}>PAST</h2>
            </div>
            <div className="list">
                {data.past.map((run, i) => <Row key={run._id} run={run} i={i} dim />)}
            </div>
            </>
        )}
        </>
    );
}