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
                res.redirect(pathname);
            });
    } else {
        res.redirect('/admin/categories/create');
    }
});

// destroy
router.delete(pathname + '/:id', (req, res) => {
    const id = req.params.id;
    let codeStatus = 500;
       
    try {
        if(id === undefined) {
            codeStatus = 404;
            throw new Error('O "id" informado não é numérico.');
        }

        Category.destroy({
            where: { id },
        })
            .then(() => {
                codeStatus = 200;
                res.status(codeStatus).json({
                    status: 'success',
                    message: 'A categoria foi excluida com sucesso.',
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