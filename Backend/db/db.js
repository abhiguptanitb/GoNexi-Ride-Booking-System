const mongoose = require('mongoose');

function connectToDb() {
    const options = {
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    mongoose.connect(process.env.DB_CONNECT, options)
        .then(() => {
            console.log('Connected to DB');
        })
        .catch(err => {
            console.error('Database connection error:', err);
            process.exit(1); // Exit the process if database connection fails
        });
}

module.exports = connectToDb;