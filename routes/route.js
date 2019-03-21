const express = require('express');
const router = express.Router();

const userController = require('../controllers/UserController');

 

router.get('/', userController.checkApi) ;

router.post('/auth/register', userController.userRegistration) ;


router.post('/auth/login', userController.userLogin);

router.get('/profile', userController.userProfile) ;

router.post('/token', userController.tokenGenerate) ;







module.exports = router;