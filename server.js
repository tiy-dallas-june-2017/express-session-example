const express = require('express');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.use(express.static('public'));

const mustEngine = mustache();
mustEngine.cache = null;
app.engine('mustache', mustEngine);
app.set('views', __dirname + '/views');
app.set('view engine', 'mustache');

app.use(session({
  secret: 'rare steak',
  saveUninitialized: true,
  resave: false
}));

app.get('/', function(req, res) {
  res.render('index', { errorMessage: '' });
});

app.post('/', function(req, res) {

  req.checkBody('name', 'You must supply a name').notEmpty();

  req.getValidationResult().then(function(result) {

    if (!result.isEmpty()) {
      res.render('index', { errorMessage: result.array()[0].msg });
      return;
    }
    else {
      req.session.username = req.body.name;
      req.session.isLoggedIn = true;
      res.redirect('/first');
    }

  });

});

app.use(function(req, res, next) {
  if (req.session.isLoggedIn) {
    next();
  }
  else {
    res.redirect('/');
  }
});

app.get('/first', function(req, res) {
  let pagesViewed = req.session.pages || [];
  pagesViewed.push('first');
  req.session.pages = pagesViewed;

  res.render('first', { name: req.session.username, pages: pagesViewed });
});

app.get('/second', function(req, res) {
  let pagesViewed = req.session.pages || [];
  pagesViewed.push('second');
  req.session.pages = pagesViewed;

  res.render('second', { name: req.session.username, pages: pagesViewed });
});

app.get('/third', function(req, res) {
  let pagesViewed = req.session.pages || [];
  pagesViewed.push('third');
  req.session.pages = pagesViewed;

  res.render('third', { name: req.session.username, pages: pagesViewed });
});

app.get('/pagelist', function(req, res) {
  let pagesViewed = req.session.pages || [];
  pagesViewed.push('pagelist');
  req.session.pages = pagesViewed;

  res.render('pagelist', { name: req.session.username, pages: pagesViewed });
});

app.listen(3000, function() {
  console.log('Listening on port 3000.');
});
