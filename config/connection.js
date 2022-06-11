const { connect, connection } = require('mongoose');

// Heroku/Local connection
const connectionString =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialNetworkAPIDB';

connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true, // display error, no warnings
});

module.exports = connection;