
const { response } = require('express');
var express = require('express');
var router = express.Router();
var Question = require('../models/Question');
const sResponse = require('../models/SurveyResponse');
var surveyResponse = require('../models/SurveyResponse');

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

    var surveysAvailable=[
        {name: "MCQ Survey", route: "/survey/take/mcq"},
        {name: "Opinion Survey", route: "/survey/take/opinion"}
    ];

    res.render("pages/take_survey",{
        templateData:{
            pageTitle:"Take Survey",
            isLoggedIn:req.session.isLoggedIn,
        },
        surveysAvailable:surveysAvailable
    });
});

router.get('/analysis/:type', restrict, (req, res)=>{
    var surveyType=req.params.type;
    var responses=[];
    var possibleResponses={};
    var options;
    
    // Get all possible questions and options
    Question.find({type: surveyType}, (err, results)=>{
        results.forEach((question, index)=>{
            if(!possibleResponses.hasOwnProperty(question.question))
            {
                possibleResponses[question.question]={};
                possibleResponses[question.question].totalCount=0;
                if(surveyType=="mcq")
                {
                    options={};
                    JSON.parse(question.options).forEach((option, index)=>{
                        if(option)
                            options[option]=0;
                    });

                    possibleResponses[question.question].options=options;
                }
                else
                {
                    possibleResponses[question.question].options={
                        "agree":0,
                        "neutral":0,
                        "disagree":0
                    }
                }
            }
        });

        // See how many responses out of total possible responses were received
        sResponse.find({type: surveyType}, (err, results)=>{

            results.forEach((result, index1)=>{
                var responseSet=JSON.parse(result.response);

                console.log(responseSet);
                for(var question in responseSet){
                    if(possibleResponses.hasOwnProperty(question)){
                        possibleResponses[question].totalCount+=1;

                        if(Array.isArray(responseSet[question])){
                            responseSet[question].forEach((option, index3)=>{
                                if(possibleResponses[question].options.hasOwnProperty(option))
                                    possibleResponses[question].options[option]+=1;
                            });
                        }
                        else
                        {
                            possibleResponses[question].options[responseSet[question]]+=1;
                        }
                    }
                }
            });

            console.log(possibleResponses);

            res.render("pages/analysis",{
                templateData:{
                    pageTitle:"Survey Analysis",
                    isLoggedIn:req.session.isLoggedIn,
                },
                surveyResponses: possibleResponses
            });
    
        });
    });
});

router.post('/process/:type', (req, res)=>{
    var response = new sResponse({
        type:req.params.type,
        response: JSON.stringify(req.body),
        date: new Date()
    });

    let msg=(!req.body)?"No response was submitted":"Your response has been submitted!";
    if(!req.body){
        res.render("pages/thank",{
            templateData:{
                pageTitle:"Try Again",
            },
            message:msg
        }).end();
    }

    response.save((err)=>{
        if(!err){
            res.render("pages/thank",{
                templateData:{
                    pageTitle:"Thank You!",
                },
                message:msg
            });
        }
    });
});

router.get('/take/:type', function(req, res){

    var surveyType=req.params.type;
    var questions=[];
    
    Question.find({type: surveyType}, (err, result)=>{

        result.forEach((question)=>{
            if(new Date(question.expiry).getTime() > new Date().getTime())
            {
                questions.push({
                    q: question.question,
                    type: question.type,
                    options: JSON.parse(question.options)
                });
            }  
        });

        res.render("pages/take_survey_main",{
            templateData:{
                pageTitle:surveyType+" Survey",
                isLoggedIn:req.session.isLoggedIn,
            },
            questions: questions,
            action: "/survey/process/"+surveyType
        });

    });
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