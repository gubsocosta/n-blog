const express = require('express');
const router = express();

router.get('/admin/categories/create', (req, res) => {
    res.render('admin/categories/create');
});

module.exports = router;