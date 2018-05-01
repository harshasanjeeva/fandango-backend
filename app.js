var express = require('express');
var path = require('path');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var session = require('client-sessions');
//var expressValidator = require('express-validator');
var mongoose=require('mongoose');
var index = require('./routes/index');
var operations = require('./routes/operations');
var logout = require('./routes/logout');
var app = express();
var passport = require('passport');




/*var mongoSessionURL = "mongodb://devfandango:fandango1@ds251819.mlab.com:51819/sessions";*/
var expressSessions = require("express-session");
require('./routes/mongodb/login')(passport);
var mongoStore = require('connect-mongo')(expressSessions);

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};


app.use(cors(corsOptions));
//app.use(expressValidator());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
/*

app.use(expressSessions({
    secret: "CMPE273_passport",
    resave: false,
    saveUninitialized: false,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 6 * 1000,
    store: new mongoStore({
        url: mongoSessionURL
    })
})
);
*/

app.use(passport.initialize());
app.use(passport.session())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/operations', operations);
app.listen(3001, function () {

    console.log('React App Listening on port 3k1!')

});








app.post('/login', function(req, res) {
    passport.authenticate('login', function(err, user) {
        if(err) {
            return res.send({
                status:500
            });
        }
        if(!user) {
            return res.send({
                status:401
            });
        }
        console.log(user)
        if(user) {
            req.session.user = user.Username;
            console.log("session initilized");
            console.log("Session is", req.session.user)
            return res.send({
                email: user.email,
                Username: user.Username,
                status: 200
            });
        }
})(req, res);
});



app.post('/logout',logout.logout);
module.exports = app;