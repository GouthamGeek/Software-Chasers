
var express = require('express');
var router = express.Router();
var Question = require('../models/Question');

router.get('/', function(req, res) {

    let questionData=[];
    Question.find({}, (err, result)=>{
        console.log(err);
        
        if(result){
            result.forEach((q, index)=>{
                let options=JSON.parse(q.options);
                questionData.push({
                    id: q._id,
                    question: q.question,
                    option1: options[0],
                    option2: options[1],
                    option3: options[2],
                    option4: options[3]
                });
            });
        }

        console.log(questionData);
        var templateData={
            "pageTitle":"Survey Master",
            "questions":questionData
        };
        res.render('pages/index',{templateData:templateData});
    });
});

module.exports = router;