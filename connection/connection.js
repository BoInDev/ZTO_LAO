const { createPool } = require("mysql");



const connected = createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gold_3cw3'
});

module.exports = connected;