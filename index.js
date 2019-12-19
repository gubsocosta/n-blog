const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database')
const Article = require('./articles/Article');
const Category = require('./categories/Category');
const ArticleController = require('./articles/ArticleController');
const CategoriaController = require('./categories/CategoryController');
const PORT = 3000;

// Config view engine
app.set('view engine', 'ejs');

// Config static files path
app.use(express.static('public'));

// Config receiving form contents
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Config databse connection
connection.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch((error) => console.log('Unable to connect to the database', error));

// Routes
app.use('/', CategoriaController);
app.use('/', ArticleController);
app.get('/', (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC'],
        ],
    })
        .then((articles) => {
            Category.findAll()
                .then((categories) => {
                    res.render('site/index', { articles, categories });
                })
        })
});
app.get('/articles/:slug', (req, res) => {
    const { slug } = req.params;

    Article.findOne({
        where: { slug },
    })
        .then((article) => {
            if(article != undefined) {
                Category.findAll()
                .then((categories) => {
                    res.render('site/articles/show', { article, categories });
                })
            } else {
                res.redirect('/');
            }
        })
        .catch((error) => {
            console.warn(error);
            res.redirect('/');
        });
});
app.get('/categories/:slug', (req, res) => {
    const { slug } = req.params;

    Category.findOne({
        where: { slug },
        include: [ { model: Article } ],
    })
        .then((category) => {
            if(category != undefined) {
                Category.findAll()
                    .then((categories) => {
                        res.render('site/categories/show', { category, categories, articles: category.articles });
                    })
            } else {
                res.redirect('/');
            }
        })
        .catch((error) => {
            console.warn(error);
            res.redirect('/');
        });
});

app.listen(PORT, () => {
    console.log('Server is live');
});