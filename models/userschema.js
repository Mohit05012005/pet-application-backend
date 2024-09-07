const mongoose = require('mongoose');
const Validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        requried: [true,'name is required field!']
    },
    email:{
         type: String,
         unique: true,
         validate:[Validator.isEmail,'email should be correct!']
    },
    role:{
        type: String,
        enum: ['user','admin'], // only can have two thing user and admin for accessing a particular routes.
        default: 'user'
    },
    password:{
        type: String,
        required: [true,'password is required field!'],
        minlength: 8,
        select: false
       
    },
    confirmpassword:{
        type: String,
        required: [true,'confirm password is required field!'],
        minlength: 8,
        validate: {
            validator: function(val){
                return val === this.password ? true:false;
            },
            message: "password and confirm password are not same!"
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpired: Date
});

userSchema.index({ email: 1 }, { unique: true });
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    // encryption of password.......
   this.password = await bcrypt.hash(this.password,5);
   this.confirmpassword = undefined;
    next();
})


userSchema.methods.comparePassword = async function(userpass,dbpass){    // can be access from the instance of user model like user
    return await bcrypt.compare(userpass,dbpass);  
}

userSchema.methods.isPasswordChange = async function(JWTTimeStamp){
    if(this.passwordChangedAt){
        const timestamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        console.log(timestamp,JWTTimeStamp);
       return timestamp>JWTTimeStamp?true:false;
    }
  return false;
}

userSchema.methods.createRandomToken = function(){
    const Planetoken =  crypto.randomBytes(32).toString('hex');

    this.passwordResetToken =  crypto.createHash('sha256').update(Planetoken).digest('hex'); // where update used for which token have to be encripted and digest is used for in which form it should be encripted.
    this.passwordResetTokenExpired = Date.now() + 10*60*1000;
    // console.log(  this.passwordResetTokenExpired,this.passwordResetToken);
    return Planetoken ; // plane token is given to the user and encripted token is saved in data base using .save method and without validation.
    }

const usermodel = mongoose.model('user',userSchema);
module.exports = usermodel;