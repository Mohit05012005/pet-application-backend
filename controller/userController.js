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
// const comparePassword = async function(userpass,dbpass){
//     return await bcrypt.compare(userpass,dbpass);
// }
 function signToken(id){
   return jwt.sign({id},process.env.SECRET_STR,{     // creating json web token
        expiresIn: process.env.LOGIN_EXPIRE     // extra payload // not added in the token
    });

}
exports.signUp = asyncErrorHandler(async(req,resp)=>{
        const userId = await usermodel.create(req.body);   // create an object in database and give a new object with unique id 
        var token = signToken(userId._id); // signToken is an method,which gives jwt token....

        resp.status(201).json({
            status:"success",
            token
        });
    });


    exports.log_in = asyncErrorHandler(async(req,resp,next)=>{
          const {email,password} = req.body;
           if(!email || !password){
             const err = new customError("please enter email and password!",400);
             return next(err);
          }

        const userdata =   await usermodel.findOne({email}).select('+password'); // for checking email
            //  const val  =  userdata.comparePassword(password,userdata.password); // for checking password
        
             if( !userdata || ! ( await userdata.comparePassword(password,userdata.password)) ){
                 const error  = new customError("Email id or password is incorrect!.please enter correctly.",400);
                 return next(error);
             }
            const token = signToken(userdata._id);
          resp.status(200).json({
            status: "success",
            token
          })
    })

exports.getdata = asyncErrorHandler(async(req,resp)=>{
        const userdata = await usermodel.find();
      
        resp.status(201).json({
            status:"success",
            userdata
        });
})

exports.deleteDataById = asyncErrorHandler(async(req,resp)=>{
    const id = req.params.id;    // route parameter and query string.
       const deleteD = await usermodel.findByIdAndDelete(id);
       resp.status(200).json({
        status: "success",
        deletedData
       });

})

exports.deletedData = asyncErrorHandler(async(req,resp)=>{
        await usermodel.deleteMany();
        resp.status(200).json({
           status: "success",
           message: "all the data is deleted"
          });
   
})

exports.protect = asyncErrorHandler(async(req,resp,next)=>{
     let testToken  = req.headers.authorization;
     let token;
     //1. read the token and check it is exist or not.
     if(testToken && testToken.startsWith('Bearer')){
        token =   testToken.split(' ')[1];
     }
     if(!token){      // bearer can be neglected. it is my choice!
        return next(new customError('Log in your profile to access!',401));  // to call global error handling middleware.
     }
     //2. validate the token
         const decodeToken = await util.promisify(jwt.verify)(token,process.env.SECRET_STR); // in decodedtoken there will be that user name id 
         //3. if the user exist or not
         const user  =  await usermodel.findById(decodeToken.id);
         if(!user){
          return next(new customError('The user with the given token does not exit!',401));
         }

            //4. if the user change password after token was issued.
         const answer = await user.isPasswordChange(decodeToken.iat); // calling instance method .......(we can apply on the given instance by the moongose)
        if(answer){
            const err = new customError('The user with the given token does not exit!',401);
            return next(err)
        }

        //5. for using it into restrict route.
         req.user = user;  
         console.log(req.user);    
     next();
})

exports.restrict = (role)=>{
    return asyncErrorHandler(async(req,resp,next)=>{
             if(req.user.role !== role){
                const err = new customError("you are not authourised to access this route!",403);
                next(err);
             }
             next();
    })
}

exports.forgetPassword = asyncErrorHandler(async(req,resp)=>{

    // 1.get user based on the posted email.
       const user = await usermodel.findOne({email:req.body.email});
         if(!user){
            const err  = new customError('This user does not have an account.',404);
         }
         // 2.generate random reset token  .....note) this should not be a jwt token
         const resetToken = user.createRandomToken();
        //  console.log(resetToken);
        await user.save({validateBeforeSave: false})
        //3. send token back to the user mail
        const resetUrl = `${req.protocol}://${req.get('host')}/pets/user/resetPassword/${resetToken}`;
        const message = `we have receive the password reset request,please click on the given link to reset your password \n\n ${resetUrl}\n\n This reset password link will be valid only for 10 minutes.`;
        try{
            await sendEmail({
                email:user.email,
                subject: "reset password request",
                text: message
             });

             resp.status(200).json({
                status: "success",
                message:"password reset link sent to the user mail!"
             })
        }catch(err){
           user.passwordResetToken = undefined;
           user.passwordResetTokenExpired = undefined
           user.save({validateBeforeSave: false});
           return next(new customError('there is an error in sending email.Please try again later!',500));// means internal server error.
        }
       
             
});

exports.resetPassword = asyncErrorHandler(async(req,resp,next)=>{

   // 1. take the user from database using given token..
   const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
   const user =  await usermodel.findOne({passwordResetToken:token,passwordResetTokenExpired:{$gt:Date.now()}});
   if(!user){
    const err = new customError('token expired or wrong token.Please try again later!',400);
    next(err);
   }

   // 2. Change the password according to the given password.
   user.password = req.body.password;
   user.confirmpassword = req.body.confirmpassword;
   user.passwordResetToken = undefined;
   user.passwordResetTokenExpired = undefined;
   user.passwordChangedAt = Date.now();

   // 3. automatic login 
   const loginToken = signToken(userdata._id);
   resp.status(200).json({
     status: "success",
     token: loginToken
   })
})
