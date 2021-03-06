const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');



mongoose.connect('mongodb://localhost/expressTest');
let db = mongoose.connection;

//Check connection
db.once('open', () => {
    console.log('Connected to MongoDB');
})

//Check for DB errors
db.on('error', (err) => {
    console.log(err);
})

const app = express();
const port = 3000;

// Bring in Models
let Article = require('./models/article');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Home Route
app.get('/', function(req, res){
    Article.find({},(err, articles) => {
        if(err){
            console.log(err);
        }else{
            res.render('index',{
                title: "Articles",
                articles: articles
            });
        }
    });
});

//Get single article
app.get('/article/:id', (req, res) => {
    Article.findById(req.params.id, (err,article) => {
        if(err){
            console.log(err);
        } else{
            res.render('article',{
                article:article
            });
        }
    })
});

//Load edit form
app.get('/article/edit/:id', (req, res) => {
    Article.findById(req.params.id, (err,article) => {
        if(err){
            console.log(err);
        } else{
            res.render('edit_article',{
                title:'Edit Article',
                article:article
            });
        }
    })
});


// Update Submit POST Route
app.post('/article/edit/:id', (req,res) => {
    let article = new Article();
    article.save({_id:req.params.id, 
                    title:req.body.title, 
                    author: req.body.author, 
                    body:req.body.body}, (err) => {
                        if(err){
                            console.log(err);
                        } else{
                            res.redirect('/');
                        }
                    });
});

// Add Route
app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    });
});


// Add Submit POST Route
app.post('/articles/add', (req,res) => {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save((err) => {
        if(err){
            console.log(err);
        } else{
            res.redirect('/');
        }
    });
});

//Start Server
app.listen(port, () => {
    console.log('Server started on port ' + port);
});