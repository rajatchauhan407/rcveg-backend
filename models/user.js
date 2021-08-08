const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const userSchema= new Schema({
  phoneNo:{type:String, 
          required:true}
});

module.exports = mongoose.model('User', userSchema);
// // const mongoConnect= require('../util/database');
// const getDb = require("../util/database").getDb;
// class User {
//   constructor(phoneNo) {
//     this.phoneNo = phoneNo;
//   }
//   save() {
//     const db = getDb();
//     return db
//       .collection("users")
//       .insertOne(this)
//       .then((result) => {
//         //console.log(result)
//         console.log("Data added successfully");
//       })
//       .catch((err) => {
//         // console.log(err);
//         console.log("Could not add Data");
//       });
//   }
//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection("users")
//       .find()
//       .toArray()
//       .then((users) => {
//         console.log(users);
//         return users;
//       })
//       .catch();
//   }
//   /*********** find something from database ***********/
//   findUser(phoneNo) {
//     const db = getDb();
//     const query = { phoneNo: phoneNo };
//     return db
//       .collection("users")
//       .findOne(query)
//       .then((user) => {
//             return user;
//       })
//       .catch((error) => {
//         return error;
//       });
//   }
// }
// module.exports = User;
