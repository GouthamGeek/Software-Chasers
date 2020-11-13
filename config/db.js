const mongoose=require('mongoose');

const mongodb=mongoose.connect('mongodb+srv://admin:Qwerty20@cluster0.lxcxp.mongodb.net/Survey', {
    connectTimeoutMS: 1000,
    useUnifiedTopology: true,
    useNewUrlParser: true
});

module.exports=mongodb;