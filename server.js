const express = require('express');
const mongoose = require('mongoose');
const authRouters = require('./router/authRouters');
const userUpdateRouter = require('./router/userUpdateRouter');
process.on('uncaughtException',(err)=>{
    console.log("Uncaught Exception occured. Shutting down.......");
    process.exit(1);
});
const dotenv = require('dotenv');
const path = require('path');
const app = require('./app')
const petRouter = require('./router/petInfoRouter');
console.log(path.dirname);
dotenv.config({path: "./config.env"});
const cors = require('cors');
const customError = require('./utils/customError');
const errorController = require('./controller/errorController');
const { log } = require('console');


mongoose.connect('mongodb://localhost:27017/mypets').then((err)=>{
    console.log("connected to database.");
})
.catch((err)=>{
  console.log("error in connection with database!")
})
app.use(cors());
app.use(express.json());//  // used to get the data in request object.
app.use('/pets/user',authRouters);  // where it is 
app.use('/pets/login-form',petRouter);
app.use('/pets/user/info',userUpdateRouter);





app.all('*',function(req,resp,next){  // * means everything
    const err = new customError(`This ${req.originalUrl} url is not found!`,404);
    next(err);
 
})


app.use(errorController);

let port = process.env.PORT || 9000;

const server = app.listen(port,()=>{      // it will return a server object.
    console.log("server is created.");
})

process.on('unhandledRejection',(err)=>{
  console.log(err.name);
  server.close(()=>{
    process.exit(1);       // if 0 then successful if 1 then unhandled rejection.
  })
})
 
// process.on('uncaughtException',(err)=>{
//     console.log("Uncaught Exception occured . Shutting down.......");
//     process.exit(1);
// });
// error occur in syncronous code such type of error is called uncaught exception