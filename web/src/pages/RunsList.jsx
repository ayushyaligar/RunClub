import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../api/client.js';

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

    if (loading) return <p>Loading…</p>;
    if (error) return <p style={{ color: 'crimson' }}>{error}</p>;
    if (runs.length === 0) return <p>No runs scheduled.</p>;

    return (
        <div>
        <h2>Upcoming runs</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
            {runs.map((run) => (
            <li key={run._id} style={{ border: '1px solid #ddd', padding: '0.75rem', marginBottom: '0.5rem' }}>
                <Link to={`/runs/${run._id}`}>
                <strong>{run.title}</strong>
                </Link>
                <div style={{ fontSize: '0.9em', color: '#555' }}>
                {new Date(run.date).toLocaleDateString()} at {run.time} · {run.location} · {run.distanceKm}km
                </div>
            </li>
            ))}
        </ul>
        </div>
    );
}