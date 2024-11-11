const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'HR',
    password: 'utmach123',
    port: 5432,
});

module.exports = pool;