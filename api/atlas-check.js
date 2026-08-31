// api/atlas-check.js — diagnostic only, delete once Atlas connects
// usage: node atlas-check.js cluster0.xxxxx.mongodb.net

const dns = require('dns');
const { Resolver } = require('dns').promises;

const host = process.argv[2];
if (!host) {
    console.error('usage: node atlas-check.js <cluster-host>');
    process.exit(1);
}

console.log('node:', process.version);
console.log('dns.getServers():', dns.getServers());

(async () => {
    const system = new Resolver();
    try {
        console.log('SRV via system resolver:', await system.resolveSrv(`_mongodb._tcp.${host}`));
    } catch (e) {
        console.error('SRV via system resolver FAILED:', e.code, e.message);
    }
    try {
        console.log('TXT via system resolver:', await system.resolveTxt(host));
    } catch (e) {
        console.error('TXT via system resolver FAILED:', e.code, e.message);
    }

    const pub = new Resolver();
    pub.setServers(['8.8.8.8', '1.1.1.1']);
    try {
        console.log('SRV via 8.8.8.8:', await pub.resolveSrv(`_mongodb._tcp.${host}`));
    } catch (e) {
        console.error('SRV via 8.8.8.8 FAILED:', e.code, e.message);
    }
    try {
        console.log('TXT via 8.8.8.8:', await pub.resolveTxt(host));
    } catch (e) {
        console.error('TXT via 8.8.8.8 FAILED:', e.code, e.message);
    }
})();