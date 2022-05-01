var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
const dotenv = require("dotenv")



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var contactRouter = require('./routes/contact');
var composantRouter = require('./routes/composant');
var pieceRouter = require('./routes/piece');
var itemRouter = require('./routes/items');
var paymentRouter = require('./routes/payment');
var besoinRouter = require('./routes/besoin');
var needRouter = require('./routes/need');
var authRouter = require('./routes/auth')

var livreurRouter = require('./routes/livreur');
var serviceRouter = require('./routes/services');


var app = express();
dotenv.config();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade', 'twig');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/contact', contactRouter);
app.use('/composant', composantRouter);
app.use('/piece', pieceRouter);
app.use('/items',itemRouter);
app.use('/livreur', livreurRouter);
app.use('/service', serviceRouter);
app.use('/api/payment',paymentRouter);
app.use('/besoin',besoinRouter);
app.use('/need', needRouter);


app.use('/auth', authRouter);




app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));
app.use(cors());






// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});




//import database 
var mongoose = require('mongoose');
var configDB = require('./database/mongodb.json');
//mongo config 
const connect = mongoose.connect(
    configDB.mongo.uri, {
        useNewurlParser: true,
        useUnifiedTopology: true

    },
    () => console.log("Connected to DB !!"));



module.exports = app;