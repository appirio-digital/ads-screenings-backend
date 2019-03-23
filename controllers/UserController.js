/**
**   All the imports are here.
**/
const {User,validate}= require('../models/UserModel');
const config = require('../configurations');
const jwt = require('jsonwebtoken')


/**
**   This is starting route for developed node apis.
**/
exports.checkApi = function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.send({"message" :'Hello World!' ,"status" : 1});
};

/**
**  Function to handle user registration request
**/
exports.userRegistration =  async function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  var userObject = {
    "firstName" : req.body.first_name,
    "lastName" : req.body.last_name,
    "email" : req.body.email
  }
     const email= req.body.email;
     const firstName = req.body.first_name;
     const lastName = req.body.last_name;
     // First Validate The Request
     console.log(userObject);
     const { error } = validate(userObject);
     if (error) {

         return res.status(400).json({"message" : error.details[0].message ,"status" : 0});
     }
     // Check if this user already exisits
    let user =  await User.findOne({ email: req.body.email});
    if (user) {
        return res.status(400).json({"message" : 'This user already exists!' ,"status" : 0});
    } else {
        // Insert the new user if they do not exist 
        user = new User({
            firstName: req.body.first_name,
            lastName  : req.body.last_name,
            email: req.body.email,
        });

        // call setPassword function to hash password 
        user.setPassword(req.body.password); 
        
        await user.save(function (err ,User) {
           if(err){
            console.log("Error",err);
            res.status(200).json(err);
           }else {
            console.log("User",User);
            const userJson = {
          "email": req.body.email
        }
     const token = jwt.sign(userJson, config.secret, { expiresIn: config.tokenLife})
     const refreshToken = jwt.sign(userJson, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife})
     const response = {
        "message": "User registerred successfully",
        "status" : 1 ,
        "token": token,
        "refreshToken": refreshToken,
        "email" : email ,
        "first_name" : firstName,
        "last_name" : lastName
    }
    
    res.status(200).json(response);
           }
        });
     
     
    }
     
   

  
};

/**
**  Function to handle login api.
**/
exports.userLogin = async function (req, res) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      
     if (!req.body.email || !req.body.password) {
      return res.status(400).json({"message" : "You must send the email and the password for login" , "status" : 0});
    }


    let user =  await User.findOne({ email: req.body.email});
    if(user){
      if (user.validPassword(req.body.password)) { 
                 const userJson = {
          "email": req.body.email
        }
    const token = jwt.sign(userJson, config.secret, { expiresIn: config.tokenLife})
    const refreshToken = jwt.sign(userJson, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife})
    const response = {
        "message": "User Logged in successfully",
         "status" : 1,
        "token": token,
        "refreshToken": refreshToken,
        }
    
    res.status(200).json(response);
            }
            else {
               return res.status(400).send({ 
                    "message" : "Password doesn't match with email",
                    "status" : 0
                }); 

            }
    
    }
    else {
    return res.status(400).send({"message" : "This user doesn't exist!" , "status" : 0});
    }



};

/**
**  Function to handle get profile api.
**/
exports.userProfile =  function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const token = req.headers['token'];

  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
          console.log(err)
            return res.status(401).json({"status": 0, "message": 'Unauthorized access.' });
        }
      console.log("decoded" ,decoded)
        let user =  User.findOne({ email: decoded.email},function (err,user) {
          if(err){
            console.log(err)
            res.status(200).json(err);
          } else{
               console.log(user)
               const response = {
                "email" : user.email ,
                 "status" : 1,
                "first_name" : user.firstName,
                "last_name" : user.lastName
    }
              return res.status(200).json(response);
          }
        });
      
      
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        "status": 0,
        "message": 'No token provided.'
    });
  }
}

/**
**   Function to implement login to generate token from refresh token.
**/
exports.tokenGenerate = function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     const postData = req.body
    // if refresh token exists
    if((postData.refreshToken)) {
        const user = {
            "email": postData.email,
            "name": postData.name
        }

        const refreshToken=postData.refreshToken;

        jwt.verify(refreshToken, config.refreshTokenSecret, function(err, decoded) {
        if (err) {
          console.log(err)
            return res.status(401).json({"status": 0, "message": 'Unauthorized access.' });
        }
   
        console.log("decoded" ,decoded)
        const user ={
          "name" : decoded.name,
          "email" : decoded.email
        }
        const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife})
        const response = {
            "token": token,
        }
        
        res.status(200).json(response);  
        return res.status(200).json({"error": false, "message": 'Authorized.' ,"token" : token });
      });

             
    } else {
        res.status(404).send({"message" : 'Invalid request' , "status" : 0})
    }



};








