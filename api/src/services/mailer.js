const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.MAIL_FROM || 'RunClub <onboarding@resend.dev>';

const enabled = Boolean(process.env.RESEND_API_KEY);
if (!enabled) console.warn('RESEND_API_KEY not set — emails will be skipped.');

function toHtml(text) {
    return String(text)
        .split(/\n{2,}/)
        .map(block => `<p style="margin:0 0 16px;line-height:1.5">${escapeHtml(block).replace(/\n/g, '<br>')}</p>`)
        .join('');
}

function escapeHtml(s) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

async function sendOne({ to, subject, text }) {
    if (!enabled) return { skipped: true };
    try {
        const { data, error } = await resend.emails.send({
        from: FROM, to, subject, text, html: toHtml(text),
        });
        if (error) {
        console.error('sendOne failed:', error);
        return { error };
        }
        return { id: data?.id };
    } catch (err) {
        console.error('sendOne threw:', err);
        return { error: err };
    }
    }

async function sendBatch({ recipients, subject, text }) {
    if (!enabled) return { skipped: true, count: 0 };

    const html = toHtml(text);
    const chunks = [];
    for (let i = 0; i < recipients.length; i += 100) {
        chunks.push(recipients.slice(i, i + 100));
    }

    let sent = 0;
    for (const chunk of chunks) {
        try {
        const { data, error } = await resend.batch.send(
            chunk.map(to => ({ from: FROM, to, subject, text, html }))
        );
        if (error) console.error('batch chunk failed:', error);
        else sent += data?.data?.length ?? chunk.length;
        } catch (err) {
        console.error('batch chunk threw:', err);
        }
    }

    console.log(`Broadcast: ${sent}/${recipients.length} accepted`);
    return { count: sent };
}

module.exports = { sendOne, sendBatch };