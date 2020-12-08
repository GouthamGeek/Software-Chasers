var port=process.env.PORT || 3000;
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
const mongodb=require('./config/db');
const session = require('express-session');

var indexRouter=require('./routes/index');
var surveyRouter=require('./routes/survey');
var userRouter=require('./routes/user');
var questionsRouter=require('./routes/question');
app.set('view engine', 'ejs');

app.use(session({
    secret: 'bigblackbob',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(bodyparser.urlencoded({ extended: false }));
app.use("/",indexRouter);
app.use("/survey",surveyRouter);
app.use("/question/",questionsRouter);
app.use("/user/",userRouter);
app.use("/public", express.static(__dirname + '/public'));

app.listen(port);
console.log('Server is up and running at localhost:'+port);

module.exports=app