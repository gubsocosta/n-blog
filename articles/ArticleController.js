const express = require('express');
const router = express();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');
const pathname = '/admin/articles';

// index
router.get(pathname, (req, res) => {
    res.send('Index - Categoria');
});

// create
router.get(pathname + '/create', (req, res) => {
    Category.findAll()
        .then((categories) => {
            res.render('admin/articles/create', { categories });
        });
});

// store
router.post(pathname, (req, res) => {
    const title = req.body.title;
    const body = req.body.body;
    const categoryId = req.body.categoryId;

    Article.create({
        title,
        slug: slugify(title).toLowerCase(),
        body,
        categoryId,
    })
        .then(() => {
            res.redirect('admin/articles');
        });
});

module.exports = router;