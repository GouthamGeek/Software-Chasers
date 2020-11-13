const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    type: 'string',
    question: 'string',
    activation: 'date',
    expiry: 'date',
    options: 'string'
});

const Question = new mongoose.model("questions", questionSchema);

module.exports=Question;
