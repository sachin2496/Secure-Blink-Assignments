const express = require('express');
const { adduser, getallemployee, deleteemployee, signinadmin } = require('../controllers/adminController');
const auth = require('../middlewares/auth');
const adminroutes = express.Router()


adminroutes.post('/signin' , signinadmin);

adminroutes.get('/getallemployee' , auth , getallemployee);

adminroutes.post('/' , (req , res)=>{
    res.send("admin login dashboard");
})

adminroutes.post("/adduser" ,  auth , adduser);


adminroutes.delete("/:id" , auth , deleteemployee);

module.exports = adminroutes;