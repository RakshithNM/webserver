const express = require('express');
const port = process.env.PORT || 3000;

var app = express();

app.use(express.static(__dirname));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  var now = new Date().toString();
  console.log(`${now} ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/', (req, res) => {
  res.render('home.ejs', {
    pageTitle: "The home page",
    welcomeMessage: "oh hi, welcome, welcome"
  });
});

app.get('/about', (req, res) => {
  res.render('about.ejs', {
    pageTitle: "The about page",
  });
});

app.get('/projects', (req, res) => {
  res.render('project.ejs', {
    projectsPageMessage: "this is my projects page"
  });
});

app.get('/sw.js', (req, res) => {
  res.sendFile('sw.js');
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: "this is a invalid route"
  });
});

app.listen(port, () => {
  console.log(`Server running on the port ${port}`); 
})
