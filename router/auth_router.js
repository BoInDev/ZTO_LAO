//call express function
const { Router } = require('express');

//set router
const router = Router();

const authController = require('../src/auth_user/authUser_controller');
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

//export route to  server file
module.exports = router;