const express = require('express');
const router = express();

router.get('/articles', (req, res) => {
    res.send('Artigos');
});

module.exports = router;