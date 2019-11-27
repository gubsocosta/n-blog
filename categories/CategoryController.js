const express = require('express');
const slugify = require('slugify');
const router = express();
const Category = require('./Category');

router.get('/admin/categories/create', (req, res) => {
    res.render('admin/categories/create');
});

router.post('/admin/categories', (req, res) => {
    const title = req.body.title;

    if(title != undefined) {
        Category.create({
            title,
            slug: slugify(title).toLowerCase(),
        })
            .then(() => {
                res.redirect('/');
            });
    } else {
        res.redirect('/admin/categories/create');
    }
});

module.exports = router;