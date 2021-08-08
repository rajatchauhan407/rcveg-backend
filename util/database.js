// const mongodb= require('mongodb');
// const MongoClient= mongodb.MongoClient;
// let _db;
// const mongoConnect=(callback)=>{
//     MongoClient.connect('mongodb+srv://rajat_veggi1304:' + process.env.MONGO_ATLAS_PW + '@veggies.znzgp.mongodb.net/users?retryWrites=true&w=majority',{ useUnifiedTopology: true }).then(
//     client=>{
//         console.log('Connected');
//         _db= client.db();
//         // callback();
//     }
// ).catch((err)=>{
//     console.log("Not Connected");
//     // throw err;
// });
// };

// const getDb=()=>{
//     if(_db){
//         return _db;
//     }
//     throw 'No Database Found!';
// };
// exports.mongoConnect=mongoConnect;
// exports.getDb=getDb;