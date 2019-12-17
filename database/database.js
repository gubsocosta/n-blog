const Sequelize = require('sequelize');
const database = 'nblog_local';
const user = 'nblog_local';
const password = 'secret';
const host = 'localhost';
const dialect = 'mysql';
const timezone = '-03:00';
const port = 3306;

const connection = new Sequelize(database, user, password, {
    host,
    dialect,
    timezone,
});

module.exports = connection;