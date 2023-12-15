const userModel = require("../models/user")
const empModel = require("../models/employee")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const secretkey = "NOTESAPI";
const http = require('http');
const socketIO = require('socket.io');
const express =  require('express')
const app = express()
const server = http.createServer(app);
const io = socketIO(server);

const signinuser = async (req , res) => {

    const {email , password} = req.body;

    try{

        const existinguser = await userModel.findOne({email:email});
        if(!existinguser)
        {
            return res.status(400).json({messege:"user does not exists"});
        }

        const matchpassword = await bcrypt.compare(password , existinguser.password);
        if(!matchpassword)
        {
            return res.status(400).json({messege:"incorrect credentials"});
        } 
        
        const token =  jwt.sign({email:existinguser.email , id:existinguser._id} , secretkey);
         return res.status(200).json({user:existinguser , token:token});

    }
    catch (error) {
        console.log(error);
       return  res.status(500).json({messege: "something went wrong"});

    }

}

const addemployee = async (req , res) => {
    console.log(req.userId);
    const {empid , empname , dept , userid} = req.body;
    try{

        const id = req.userId;
        const curuser = await userModel.findOne({_id:id});
        if(curuser.role !== "regular")
        {
                return res.status(401).json({messege:"unauthorised access"});
        } 

        const existingemp = await empModel.findOne({empid:empid});
        if(existingemp)
        {
            return res.status(400).json({messege:"employee already exists"});
        }

        const result = await empModel.create({
            empid:empid,
            empname:empname,
            dept:dept,
            userId:req.userId
        });

        io.emit('new employee', {employeeid:result});
        return res.status(200).json({employee:result});
       

    }
    catch (error) {
        console.log(error);
        res.status(500).json({messege: "something went wrong"});

    }


}
const getallemployee = async (req , res) => {
 try
 {
    const id = req.userId;
    const curuser = await userModel.findOne({_id:id});
    if(curuser.role !== "regular")
    {
            return res.status(401).json({messege:"unauthorised access"});
    } 
    const result = await empModel.find();
    return res.status(200).json(result);
 }
  catch(error)
  {
    console.log(error);
    return res.status(400).json({messege:"something went wrong"});
  }  
}

const updateemployee = async (req , res) => {
    const {empid} = req.params;
    const {empname , dept} = req.body;
    try
    {
        const id = req.userId;
        const curuser = await userModel.findOne({_id:id});
        if(curuser.role !== "regular")
        {
                return res.status(401).json({messege:"unauthorised access"});
        } 
        
        const result = await Employee.updateOne({ _id: empid }, { $set: { empname, dept } });

        if (result.nModified === 0) {
          return res.status(404).json({ message: 'Employee not found or no changes made' });
        }
    
      return  res.json({ message: 'Employee updated successfully' });

    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({messege:"something went wrong"});
    }
}


module.exports = {signinuser , addemployee , getallemployee};