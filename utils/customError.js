class customerror extends Error{
    constructor(message,statusCode){
        // console.log(message);
        // this.message = message;
        // if we want base class constructor then we use super keyword;
        super(message);
        this.statusCode = statusCode;
        this.status = this.statusCode>=400 && this.statusCode<500?'fail':'error';
        this.isOperational = true;
        Error.captureStackTrace(this,this.constructor);     // this represents current object and this.constructor represents custom error class.
    }
}
module.exports = customerror;