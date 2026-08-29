import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../api/client.js';

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

export default function RunsList() {
    const [runs, setRuns] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        request('/runs')
        .then(setRuns)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="state">LOADING…</p>;
    if (error) return <p className="state error">{error}</p>;

    return (
        <>
        <div className="hero">
            <div className="eyebrow">
            <span className="dot" />
            <span>BENGALURU</span>
            <span className="muted">{runs.length} SCHEDULED</span>
            </div>
            <h1 className="h1">UPCOMING</h1>
            <div className="tagline">EVERY PACE HAS A PLACE.</div>
        </div>

        <div className="list">
            {runs.map((run, i) => {
            const d = new Date(run.date);
            return (
                <Link key={run._id} to={`/runs/${run._id}`} className="row">
                <div className="row-date">
                    <div className={`row-day${i === 0 ? ' next' : ''}`}>
                    {String(d.getDate()).padStart(2, '0')}
                    </div>
                    <div className="row-month">{MONTHS[d.getMonth()]}</div>
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
            })}
        </div>
        </>
    );
}