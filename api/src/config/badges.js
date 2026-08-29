const BADGES = [
    { key: 'first-run', label: 'First Run', threshold: 1 },
    { key: 'five-runs', label: 'Five Runs', threshold: 5 },
    { key: 'ten-runs',  label: 'Ten Runs',  threshold: 10 },
]

const badgesFor = (totalRuns) =>
    BADGES.filter(b => b.threshold <= totalRuns).map(b => b.key)

module.exports = { BADGES, badgesFor }