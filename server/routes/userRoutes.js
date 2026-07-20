const express= require('express');
const Router =express.Router();
const auth = require('../middleware/auth');

const {registerUser, loginUser, getProfile, logoutUser} =require('../controllers/userController');

Router.post('/register', registerUser);
Router.post('/login', loginUser);
Router.get('/profile', auth, getProfile);
Router.post('/logout', auth, logoutUser);

module.exports=Router;