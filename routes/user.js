
var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/login', function(req, res) {
    res.render("pages/login", {templateData:{
        pageTitle:"Login",
        statusText:"",
        isLoggedIn:req.session.isLoggedIn
    }});
});

router.get('/register', function(req, res) {
    res.render("pages/register", {templateData:{
        pageTitle:"Registration",
        statusText:"",
        isLoggedIn:req.session.isLoggedIn
    }});
});

router.get('/profile', function(req, res) {
    User.findById(req.session.userId,(err,doc)=>{
        if(err || !doc){
            res.redirect("user/login");
        }
        
        res.render("pages/profile", {templateData:{
            pageTitle:"Manage Profile",
            name:doc.name,
            email:doc.email,
            isLoggedIn:req.session.isLoggedIn,
            statusText:""
        }});
    });
});

/* POST User Registration */
router.post('/register', function(req, res, next) {

    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;
    var cpassword=req.body.cpassword;
  
    if(name && email && password){
      //Passwords are equal
      if(password===cpassword){
        User.create({
          name: name,
          email: email,
          password: password
        }, (err, doc)=>{
          if(err){
            res.render('pages/register',{ templateData: {
                pageTitle:"Registration",
                statusText:"Failed to Register. Internal Error.", isLoggedIn:(req.session.isLoggedIn)?true:false
            }});
          } 
          else{
            res.render('pages/register',{ templateData: {
                pageTitle:"Registration",
                statusText:"Account Created", isLoggedIn:(req.session.isLoggedIn)?true:false
            }});
          }
        });
      }
      else{
        res.render('pages/register',{ templateData: {
            pageTitle:"Registration",
            statusText:"Passwords do not match", isLoggedIn:(req.session.isLoggedIn)?true:false
        }});
      }
    }
    //Fields are empty
    else{
        res.render('pages/register',{ templateData: {
            pageTitle:"Registration",
            statusText:"All Fields are required", isLoggedIn:(req.session.isLoggedIn)?true:false
        }});
    }
  });
  
    /* POST User Profile Update */
    router.post('/profile', function(req, res, next) {

    console.log("USER ID: "+req.session.userId);
    
    var name=req.body.name;
    var email=req.body.email;
    var cpassword=req.body.cpassword;
    var npassword=req.body.npassword;

    User.findById(req.session.userId, (err,doc)=>{
        if(doc.password==cpassword){
            User.findOneAndUpdate(req.session.userId, {
                name:name,
                email:email,
                password:(npassword)?npassword:cpassword
            }, (err, doc)=>{
                res.render("pages/profile", {templateData:{
                    pageTitle:"Manage Profile",
                    name:name,
                    email:email,
                    isLoggedIn:req.session.isLoggedIn,
                    statusText:"Changes Saved"
                }});
            })
        }
        else
        {
            res.render("pages/profile", {templateData:{
                pageTitle:"Manage Profile",
                name:name,
                email:email,
                isLoggedIn:req.session.isLoggedIn,
                statusText:"Enter the correct password to make changes"
            }});
        }
    });
  });

  /* POST User Login */
  router.post('/login', function(req, res, next) {
    var email=req.body.email;
    var password=req.body.password;
  
    User.findOne({
        email:email,
        password:password
    },(err, doc)=>{
        if(err || !doc){
            //Failed to Login
            res.render('pages/login',{ templateData: {
                pageTitle:"Login",
                statusText:"Credentials Invalid", isLoggedIn:(req.session.isLoggedIn)?true:false
                }
            });
        }
        else{
            //Logged In
            req.session.email=doc.email;
            req.session.isLoggedIn=true;
            req.session.userId=doc._id;
    
            req.session.save(()=>{
                res.redirect("/survey/manage");
            });
        }
        });
    });
  
  /* POST Logout */
    router.get('/logout', (req,res,next)=>{
        req.session.destroy(function(err) {
            res.redirect('/user/login');
        });
    });
  
module.exports = router;