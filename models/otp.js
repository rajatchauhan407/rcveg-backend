const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const otpSchema = new Schema({
    otpHash:{type:String, required:true},
    userId:{type:String, required:true},
    expiresIn:{type:Date,required:true},
    used:{type:Boolean, required:true},
    contact:{type:Number, required:true}
});


module.exports = mongoose.model('Otp',otpSchema);