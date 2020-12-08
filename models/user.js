let mongoose = require('mongoose');

let userAccountModel = mongoose.Schema({
    name: String,
    email: String,
    password: String
},
{
    collection: "UserAccount"
});

module.exports = mongoose.model('UserAccount', userAccountModel);