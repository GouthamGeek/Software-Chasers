
var express = require('express');
var router = express.Router();
var Question = require('../models/Question');

/**
 * Restrict if not logged in
 */
var restrict = (req, res, next) => {
    if(!req.session.isLoggedIn)
        res.redirect("/user/login");
    else
        next();
};

router.get('/', (req, res) => {
    res.render("pages/take_survey",{templateData:{
        pageTitle:"Take Survey",
        isLoggedIn:req.session.isLoggedIn
    }});
});

router.get('/manage', restrict, function(req, res) {

    let mcqQuestionData=[];
    let opinionQuestionData=[];
    Question.find({}, (err, result)=>{
        console.log(err);
        
        if(result){
            result.forEach((q, index)=>{
                let options=JSON.parse(q.options);
                
                console.log(q.type);
                switch(q.type){
                    case "mcq":
                        mcqQuestionData.push({
                            id: q._id,
                            question: q.question,
                            activation: new Date(q.activation).toISOString().split("T")[0],
                            expiry: new Date(q.expiry).toISOString().split("T")[0],
                            option1: options[0],
                            option2: options[1],
                            option3: options[2],
                            option4: options[3]
                        });
                        break;
                    
                    case "opinion":
                        opinionQuestionData.push({
                            id: q._id,
                            question: q.question,
                            activation: new Date(q.activation).toISOString().split("T")[0],
                            expiry: new Date(q.expiry).toISOString().split("T")[0]
                        });
                        break;
                }
                
            });
        }

        var templateData={
            "pageTitle":"Software Chasers",
            "mcqQuestionData":mcqQuestionData,
            "opinionQuestionData":opinionQuestionData,
            isLoggedIn:req.session.isLoggedIn
        };
        res.render('pages/index',{templateData:templateData});
    });
});

module.exports = router;