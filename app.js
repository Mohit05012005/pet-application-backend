const express = require('express');
const app = express();
const petRouter = require('./router/petInfoRouter');
 console.log("here in app");
// app.use(express.json());
// app.use('/pets/login-form',petRouter);



module.exports = app;