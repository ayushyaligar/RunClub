require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB:', mongoose.connection.name);

    const users = await User.find({}, 'name email role').lean();
    console.table(users);

    await mongoose.connection.close();
})();