require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const [, , email, role] = process.argv;

if (!email || !role) {
    console.error('Usage: node src/scripts/set-role.js <email> <admin|member>');
    process.exit(1);
    }

    (async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOneAndUpdate(
        { email },
        { role },
        { new: true, runValidators: true }
    ).select('name email role');

    if (!user) {
        console.error(`No user with email ${email}`);
    } else {
        console.log(`Updated:`, user.toObject());
        console.log('Token claims are frozen at signing time — log in again.');
    }

    await mongoose.connection.close();
})();