const express = require('express');

const fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey = fs.readFileSync('server.key', 'utf8');
var certificate = fs.readFileSync('server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

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

//Redirects for http request
app.get("*", function(req, res) {
  res.redirect('https://' + req.headers.host + req.url);
})

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(process.env.PORT || 8080);
//httpsServer.listen(process.env.PORT || 8443);
