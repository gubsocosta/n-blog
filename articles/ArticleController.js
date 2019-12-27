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

// paginate
router.get(pathname + '/page/:num', (req, res) => {
    const { num } = req.params;
    const limit = 5;
    let offset = 0;

    if(isNaN(num) || num === 1) {
        offset = 0;
    } else {
        offset = parseInt(num) * limit;
    }

    Article.findAndCountAll({
        limit,
        offset,
    })
        .then((articles) => {
            const next = offset + limit <= articles.count;

            res.json({ next, articles });
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
    const { title, body, categoryId } = req.body;

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

// edit
router.get(pathname + '/:id/edit', (req, res) => {
    const { id } = req.params;

    try {
        if(isNaN(id)) {
            throw new Error('O "id" informado não é numérico.');
        }
        Article.findByPk(id)
            .then((article) => {
                if(article !=  undefined) {
                    Category.findAll()
                        .then((categories) => {
                            res.render('admin/articles/edit', { article, categories });
                        });
                } else {
                    throw new Error('O artigo não foi encontrado.');
                }
            })
            .catch((error) => {
                throw new Error('Oops... ocorreu um erro interno.')
            })
    } catch (error) {
        console.log(error);
        res.redirect(pathname);
    }
});

// update
router.post(pathname + '/:id', (req, res) => {
    const { id } = req.params;
    
    try {
        if(isNaN(id)) {
            throw new Error('O "id" informado não é numérico.');
        }

        const { title, categoryId, body } = req.body;
        
        if((title === '') || (title === undefined) || (title === null)) {
            throw new Error('O titulo nao foi definido.')
        }

        if((categoryId === '') || (categoryId === undefined) || (categoryId === null)) {
            throw new Error('Nenhuma categoria foi selecionada.')
        }

        Article.update(
            {
                title,
                categoryId,
                body,
                slug: slugify(title).toLowerCase(),
            },
            { where: { id }}
        )
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
            message: error,
        });
    }
});

module.exports = router;