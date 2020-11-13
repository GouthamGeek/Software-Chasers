
const { json } = require('body-parser');
var express = require('express');
var Question = require('../models/Question');
var router = express.Router();

/**
 * GET ROUTES
 */
router.get('/create', function(req, res) {
    var templateData={
        "pageTitle":"Survey Master - Create Question",
        "formTitle":"Add Question",
        "question":""
    };
    res.render('pages/add_question',{templateData:templateData});
});

router.get('/update/:id', function(req, res) {

    Question.findOne({_id:req.params.id}, (err, q)=>{

        let options=JSON.parse(q.options);
        let question={
            id: q._id,
            question: q.question,
            option1: options[0],
            option2: options[1],
            option3: options[2],
            option4: options[3]
        };

        var templateData={
            "pageTitle":"Survey Master - Update Question",
            "formTitle":"Edit Question",
            "question":question
        };
    
        res.render('pages/add_question',{templateData:templateData});
    });
});

router.get('/delete/:id', function(req, res) {

    Question.findOneAndDelete({
        _id:req.params.id
    }, (err, document)=>{   
        res.redirect('/');
    });
});

/**
 * POST ROUTES
 */
router.post('/create', function(req, res) {
    let question=req.body.question;
    let options=[];
    options.push(req.body.option1);
    options.push(req.body.option2);
    options.push(req.body.option3);
    options.push(req.body.option4);

    Question.create({
        question:question,
        options:JSON.stringify(options)
    }, (err, document)=>{
        if(!err)
            res.redirect('/');
    });
});

router.post('/update/:id', function(req, res) {

    let question=req.body.question;
    let options=[];
    options.push(req.body.option1);
    options.push(req.body.option2);
    options.push(req.body.option3);
    options.push(req.body.option4);

    Question.findOneAndUpdate(
        {_id:req.params.id},
        {
            question:question,
            options:JSON.stringify(options)
        },(err, result)=>{
            res.redirect('/');
    });
});

module.exports = router;