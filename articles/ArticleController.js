const express = require('express');
const router = express();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');
const pathname = '/admin/articles';

// index
router.get(pathname, (req, res) => {
    Article.findAll({
        include: [{ model: Category }]
    })
        .then((articles) => {
            res.render('admin/articles/index', { articles });
        });
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
            res.redirect(pathname);
        });
});

// destroy
router.delete(`${pathname}/:id`, (req, res) => {
    const id = req.params.id;
    let codeStatus = 500;
       
    try {
        if(id === undefined) {
            codeStatus = 404;
            throw new Error('O "id" informado não é numérico.');
        }

        Article.destroy({
            where: { id },
        })
            .then(() => {
                codeStatus = 200;
                res.status(codeStatus).json({
                    status: 'success',
                    message: 'O artigo foi excluído com sucesso.',
                });
            });
        
    } catch (error) {
        res.status(codeStatus).json({
            status: 'error',
            message: error.message,
        });
    }
});

module.exports = router;