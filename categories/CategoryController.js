const express = require('express');
const slugify = require('slugify');
const router = express();
const Category = require('./Category');
const pathname =  '/admin/categories';

// index
router.get(pathname, (req, res) => {
    Category.findAll()
        .then((categories) => {
            res.render('admin/categories/index', { categories });
        });
});

// create
router.get(pathname + '/create', (req, res) => {
    res.render('admin/categories/create');
});

// store
router.post(pathname, (req, res) => {
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