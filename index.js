const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;

// Config view engine
app.set('view engine', 'ejs');

// Config static files path
app.use(expres.static('public'));


// Config receiving form contents
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(PORT, () => {
    console.log('Server is live');
});