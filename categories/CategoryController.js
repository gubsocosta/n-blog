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
router.get(`${pathname}/create`, (req, res) => {
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

// edit
router.get(`${pathname}/:id/edit`,(req, res) => {
    const id = req.params.id;

    try {
        if(isNaN(id)) {
            throw new Error('O "id" informado não é numérico.');
        }
        Category.findByPk(id)
            .then((category) => {
                if(category != undefined) {
                    res.render('admin/categories/edit', { category });
                } else {
                    throw new Error('A categoria não foi encontrada');
                }
            })
            .catch((error) => {
                throw new Error('Ocorreu um erro interno');
            });
    } catch (error) {
        console.log(error);
        res.redirect(pathname);
    }
});

// update
router.post(`${pathname}/:id`, (req, res) => {
    const { id } = req.params;
    
    try {
        if(isNaN(id)) {
            throw new Error('O "id" informado não é numerico.');
        }
        const { title } = req.body;

        if((title === '') || (title === undefined) || (title === null)) {
            throw new Error('O titulo nao foi definido.')
        }

        Category.update({
            title,
            slug: slugify(title).toLowerCase(),
        }, {
            where: { id }
        })
            .catch((error) => {
                throw new Error(error)
            });
    } catch (error) {
        console.log(error);
    }
    res.redirect(pathname);
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
            message: error,
        });
    }
});

module.exports = router;