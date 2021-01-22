var express = require('express');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var expressErrorHandler = require('express-error-handler');
var expressSession = require('express-session');
var crypto = require('crypto');


var passport = require('passport');
var flash = require('connect-flash');

var salt = '';
var pw = '';
crypto.randomBytes(64, (err, buf) => {
    if (err) throw err;
    salt = buf.toString('hex');
});
crypto.pbkdf2('password', salt, 100000, 64, 'sha512', (err, derivedKey) => {
    if (err) throw err;
    pw = derivedKey.toString('hex');
})

var app = express();

app.set('view engine', 'ejs');

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(static(path.join(__dirname,'views')));

app.use(expressSession({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized : true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var router = express.Router();

var configPassport = require('./config/passport');
configPassport(app, passport);

var userPassport = require('./routes/user_passport');
userPassport(router, passport);


app.use('/', router);

var ErrorHandler = expressErrorHandler({
    static: {
        '404': './views/404.html'
    }
});

app.use( expressErrorHandler.httpError(404) );
app.use( ErrorHandler );

app.listen(app.get('port'), function(){
    console.log('server start : ' + app.get('port'));
});