const mongoose = require('mongoose');

const sResponseSchema = new mongoose.Schema({
    type: '',
    response: '',
    date: ''
});

const sResponse = new mongoose.model("survey_response", sResponseSchema);

module.exports=sResponse;
