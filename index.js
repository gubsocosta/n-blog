const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database')
const PORT = 3000;

// Config view engine
app.set('view engine', 'ejs');

// Config static files path
app.use(express.static('public'));

// Config receiving form contents
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Confgi databse connection
connection.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch((error) => console.log('Unable to connect to the database', error));

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(PORT, () => {
    console.log('Server is live');
});