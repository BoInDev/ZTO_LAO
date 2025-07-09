const { createPool } = require("mysql");



const connected = createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'naphalai'
});

module.exports = connected;