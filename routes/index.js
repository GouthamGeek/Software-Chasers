var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.render("pages/homepage",{templateData:{
        pageTitle:"Homepage",
        isLoggedIn:req.session.isLoggedIn
    }});
});

module.exports = router;