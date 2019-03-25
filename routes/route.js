/**
 **	 All the imports are here.
 **/
const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

/**
 **	 All the api routes are defined here along with their attached controller methods.
 **/

router.get('/', userController.checkApi);

router.post('/auth/register', userController.userRegistration);


router.post('/auth/login', userController.userLogin);

router.get('/profile', userController.userProfile);

router.post('/token', userController.tokenGenerate);

/**
 **	export all these routes attached with router.
 **/
module.exports = router;