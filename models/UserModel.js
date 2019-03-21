const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;
const crypto = require('crypto');

const UserSchema = new Schema({
    firstName: {type: String, required: true, minlength : 3 , maxlength: 40},
    lastName: {type: String, required: true, minlength : 3 , maxlength: 40},
    email: {type: String, required: true,minlength: 5,
        maxlength: 50,
        unique: true},
    hash : {type: String}, 
    salt : {type: String}  
});

UserSchema.methods.setPassword = function(password) { 
     
    // Creation of unique salt for user
    this.salt = crypto.randomBytes(16).toString('hex'); 
  
    // hashing user's salt and password with 1000 iterations, 
    //64 length and sha512 digest 
    this.hash = crypto.pbkdf2Sync(password, this.salt,  
    1000, 64, `sha512`).toString(`hex`); 
}; 

UserSchema.methods.validPassword = function(password) { 
    var hash = crypto.pbkdf2Sync(password,  
    this.salt, 1000, 64, `sha512`).toString('hex'); 
    return this.hash === hash; 
}; 


 

 
const User = mongoose.model('User', UserSchema);


/**
** This function is used for validation user by joi library of validation
**/
function validateUser(user) {
    const schema = {
        firstName: Joi.string().min(3).max(40).required(),
        lastName: Joi.string().min(3).max(40).required(),
        email: Joi.string().min(5).max(50).required().email()
        
    };
    return Joi.validate(user, schema);
}





// Export the model

exports.User = User;
exports.validate = validateUser;
 