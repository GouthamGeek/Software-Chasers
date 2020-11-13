const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: 'string',
    options: 'string'
});

const Question = new mongoose.model("questions", questionSchema);

module.exports=Question;
