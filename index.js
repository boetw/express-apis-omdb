var express = require('express');
var app = express();
var ejsLayouts = require('express-ejs-layouts');
var request = require('request')



app.use(require('morgan')('dev'));
app.set('view engine', 'ejs');
app.use(ejsLayouts);

app.use(express.static('public'));


app.get('/', function (req, res) {
    res.render('site/index');
});

app.get('/raw', function (req, res) {
    var qs = {
        s: 'star wars'
    };

    request({
        url: 'http://www.omdbapi.com',
        qs: qs
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var dataObj = JSON.parse(body);
            res.send(dataObj.Search);
        }
    });
});

app.get('/results', function (req, res) {
    var searchTerm = req.query.searchTerm;
    var qs = {
        s: searchTerm
    };

    request({
        url: 'http://www.omdbapi.com',
        qs: qs
    }, function (error, response, body) {

        if (!error && response.statusCode == 200) {

            var dataObj = JSON.parse(body);
            res.render("site/results", { results: dataObj.Search });
        }
    });
});


app.get('/:imdbID', function (req, res) {

    var qs = {
        i: req.params.imdbID,
        plot: 'full',
        r: 'json'
    }
    console.log('MOVIE ' + qs);
    request({
        url: 'http://www.omdbapi.com/',
        qs: qs
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            var dataObj = JSON.parse(body);
            console.log(dataObj);
            res.render("site/movie", { movieData: dataObj });
        }

    });

});

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
