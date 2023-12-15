const express = require('express');
const { signinuser, addemployee, getallemployee } = require('../controllers/userController');
const auth = require('../middlewares/auth');
const userroutes = express.Router()


userroutes.post('/signin' , signinuser);

userroutes.get('/getallemployee' , auth , getallemployee);

userroutes.post('/addemployee' , auth , addemployee);

userroutes.put("/:id" , auth);


module.exports = userroutes;