 const path= require("path");
const express=require('express');
const app= express();
const userRoutes= require('./routes/userRoutes');
const vegRoutes= require('./routes/vegRoutes');
const adminRoutes = require('./routes/adminRoutes');
const mongoose = require('mongoose');
// const mongoConnect = require('./util/database').mongoConnect;
// mongoConnect();
mongoose.connect('mongodb+srv://rajat_veggi1304:' + process.env.MONGO_ATLAS_PW + '@veggies.znzgp.mongodb.net/users?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true}).then(
    result=>{
        console.log("Users connected");
    }
).catch(error=>{
    console.log(error);
});
app.use(express.json({extended:false}));
app.use(express.urlencoded({extended:false}));
app.use('/images',express.static(path.join('backend/images')));
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With, Content-Type, Accept,Authorization");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,DELETE,OPTIONS");
    next();
});


app.use(userRoutes);
app.use(vegRoutes);
app.use(adminRoutes);

// app.listen(3000);
module.exports=app;
