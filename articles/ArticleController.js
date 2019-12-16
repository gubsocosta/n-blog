const express = require('express');
const router = express();
const pathname = '/admin/articles'

// create
router.get(pathname + '/create', (req, res) => {
    res.render('admin/articles/create');
});

module.exports = router;