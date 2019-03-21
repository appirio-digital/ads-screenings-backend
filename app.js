const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const router = express.Router()
const app = express()
const config = require('./configurations')
const mongoose = require('mongoose');
var MongoClient =  mongoose.MongoClient;
mongoose.connect('mongodb://localhost/myappdatabase');



router.get('/', (req,res) => {

	  res.send('Hello World');
})

router.post('/auth/register', (req,res) => {
	const requestPostData = req.body;
	console.log(requestPostData)	
	const email = requestPostData.email;
	const password = requestPostData.password;
	const firstName = requestPostData.first_name;
	const lastName = requestPostData.last_name;
	const user = {
        "email": requestPostData.email,
        "name": requestPostData.first_name
    }
	const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife})
    const refreshToken = jwt.sign(user, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife})
    const response = {
        "status": "User registerred successfully",
        "token": token,
        "refreshToken": refreshToken,
        "email" : email ,
        "first_name" : firstName,
        "last_name" : lastName
    }
    //tokenList[refreshToken] = response
    res.status(200).json(response);
    res.send('Hello World');
})

router.post('/auth/login', (req,res) => {
	if (!req.body.username || !req.body.password) {
    	return res.status(400).send("You must send the username and the password for login");
  	}
	const requestPostData = req.body;
	const email = requestPostData.email;
    res.send('Hello World');
})

router.post('/token', (req,res) => {
    // refresh the damn token
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
            return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
        }
  //       decoded { email: 'nishant.lnmiit2k10@gmail.com',
  // name: 'Nishant',
  // iat: 1553017892,
  // exp: 1553018192 }
        console.log("decoded" ,decoded)
        const user ={
        	"name" : decoded.name,
        	"email" : decoded.email
        }
        const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife})
        const response = {
            "token": token,
        }
        // update the token in the list
        //tokenList[postData.refreshToken].token = token
        res.status(200).json(response);  
        return res.status(200).json({"error": false, "message": 'Authorized.' ,"token" : token });
      // req.decoded = decoded;
      // next();
    });

             
    } else {
        res.status(404).send('Invalid request')
    }
})

router.get('/profile', (req,res) => {
	const token = req.headers['token'];
	if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
        	console.log(err)
            return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
        }
  //       decoded { email: 'nishant.lnmiit2k10@gmail.com',
  // name: 'Nishant',
  // iat: 1553017892,
  // exp: 1553018192 }
        console.log("decoded" ,decoded)
        return res.status(200).json({"error": false, "message": 'Authorized.' });
      // req.decoded = decoded;
      // next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        "error": true,
        "message": 'No token provided.'
    });
  }

    //res.send('Hello World');
})



app.use(bodyParser.json())
app.use('/api', router)
app.listen(process.env.port || 3000 ,'0.0.0.0');
 
