const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/******************Bucket Schema **********/
const bucketSchema = new Schema({
        vegId:{type:ObjectId, required:true },
        quantity:{type:Number, required:true},
        price: {type:Number, required:true},
        userId:{type:ObjectId, required:true},
        vegName:{type:String, required:true},
        imagePath:{type:String, required:true}
});
module.exports = mongoose.model('Bucket',bucketSchema);