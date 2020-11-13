var port=process.env.PORT || 3000;
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
const mongodb=require('./config/db');

var router=require('./routes/index');
var questionsRouter=require('./routes/question')
app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({ extended: false }));
app.use("/",router);
app.use("/question/",questionsRouter);
app.use("/public", express.static(__dirname + '/public'));

app.listen(port);
console.log('Server is up and running at localhost:'+port);

module.exports=app