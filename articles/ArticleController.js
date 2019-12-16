const express = require('express');
const router = express();
const pathname = '/admin/articles'
const Category = require('../categories/Category')

// create
router.get(pathname + '/create', (req, res) => {
    Category.findAll()
        .then((categories) => {
            res.render('admin/articles/create', { categories });
        });
});

module.exports = router;