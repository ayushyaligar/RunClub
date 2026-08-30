const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function request(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`); 
  return data;
}
export const getRun        = (id, token)        => request(`/runs/${id}`, { token });
export const rsvpToRun     = (id, token)        => request(`/runs/${id}/rsvp`, { method: 'POST', token });
export const cancelRsvp    = (id, token)        => request(`/runs/${id}/rsvp`, { method: 'DELETE', token });
export const redeemCode    = (id, code, token)  => request(`/runs/${id}/attendance`, { method: 'POST', body: { code }, token });
export const generateCode  = (id, token)        => request(`/runs/${id}/attendance/code`, { method: 'POST', token });