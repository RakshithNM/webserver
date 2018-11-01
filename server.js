const express = require('express');
const hbs = require('hbs');

const port = process.env.PORT || 3000;


var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'hbs');

app.use((req, res, next) => {
  var now = new Date().toString();
  console.log(`${now} ${req.method} ${req.originalUrl}`);
  next();
});

//app.use((req, res, next) => {
//  res.render('maintenance.hbs');
//});

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('uc', (inText) => {
  return inText.toUpperCase(); 
});

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: "The home page",
    welcomeMessage: "oh hi, welcome, welcome"
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: "The about page",
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    projectsPageMessage: "this is my projects page"
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: "this is a invalid route"
  });
});

app.listen(port, () => {
  console.log(`Server running on the port ${port}`); 
});
