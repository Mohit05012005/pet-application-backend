const usermodel = require('../models/userschema');
const customError = require('../utils/customError');
const bcrypt = require('bcrypt');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const sendEmail = require('../utils/email');
const util = require('util');   // util library // for accessing promisify funcition in validate route.
// const errorController = require('./errorController');
const jwt = require('jsonwebtoken');
const { decode } = require('punycode');
const crypto = require('crypto');

function signToken(id){
    return jwt.sign({id},process.env.SECRET_STR,{     // creating json web token
         expiresIn: process.env.LOGIN_EXPIRE     // extra payload // not added in the token
     });
 
 }

exports.updateMe = asyncErrorHandler(async(req,resp,next)=>{

});

exports.updatePassword = asyncErrorHandler(async function(req,resp,next){
    // 1. get the user from the data base who have logged in.
  const user =  await usermodel.findById(req.user._id).select('+password'); // means we also want password attribute in the field.
  const result = await user.comparePassword(req.body.currentPassword,user.password);
 
  // 2. now compare the current password with the given password.
  if(!result){
    return next(new customError('The current password is incorrect!',401));
  }

  // 3. update the password in the database.
  user.password = req.body.password;
  user.confirmpassword = req.body.confirmpassword;
  await user.save(); // validation : true as because we are providing password as well as confirm password.

  // 4. return the token to the user
  const token = signToken(user._id);
  resp.status(200).json({
    status: "success",
    token: token,
    data:{
        user
    }
  })
})