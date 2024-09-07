const customError = require("../utils/customError");

const devErrors = (resp,err)=>{
    resp.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stacktrace: err.stack,
        error: err
     });
}

const prodErrors = (resp,err)=>{
    // console.log(err.message);
    
    if(err.isOperational){
        resp.status(err.statusCode).json({
            status: err.status,
            message: err.message
         });
    }else{
        resp.status(500).json({
            status: 'fail',
            message: 'something went wrong. please try again later!'
        })
    }
  
}

const castErrorHandler = function(err){
  const msg = `this ${err.path}: ${err.value} is wrong!`;
 return  new customError(msg,400);
}


const duplicateerror = (error)=>{
    const name = error.keyValue.OwnerName;
 return new customError(`There is already a Owner with "${name}" name.Please try with different name!`,400);
}

const handleExpiredJWT = (error)=>{
  return new customError('JWT EXPIRED.Please Log In again!',401)
}

const handleJWTError = (error)=>{
    return new customError('Invalid Token.Please Log In again!',401);
}

module.exports = (err,req,resp,next)=>{         // global error handling middleware .for handling route errors.
    //   console.log(err);
    err.statusCode = err.statusCode || 400;
    err.status = err.status || 'error';
    if(process.env.NODE_ENV === 'development'){
        devErrors(resp,err);
    }
    
    else if(process.env.NODE_ENV === 'production'){
        if(err.name === 'CastError'){
            err = castErrorHandler(err);
            // console.log(err.message);
        }
        if(err.code === 11000){
          err =  duplicateerror(err);
        }
        if(err.name === 'TokenExpiredError') err = handleExpiredJWT(err);
        if(err.name === 'JsonWebTokenError') err = handleJWTError(err);
       prodErrors(resp,err);
    }

};


// note: when an error given by moongose then we have to send actual error not the generic error.


// unhandelled rejected promises when a promise return rejection. as global error handler can only handle the application errors but not the server errors.
// we use event handler function (process.on) for handling the rejected promise. in server.js file.