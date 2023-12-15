const userModel = require('../models/user')
const empModel = require('../models/employee')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const secretkey = "NOTESAPI";

const adduser = async (req , res) => {

    const {username , email , password} = req.body;
    

    try{
        const id = req.userId;
        const curuser = await userModel.findOne({_id:id});
        if(curuser.role !== "admin")
        {
                return res.status(401).json({messege:"unauthorised access"});
        } 
        const existinguser = await userModel.findOne({email:email});
        if(existinguser)
        {
            return res.status(400).json({messege:"user already exists"});
        }

        const hashedpassword = await bcrypt.hash(password , 10);
        const result = await userModel.create({
            email:email,
            password:hashedpassword,
            username:username,
            role:"regular"
        });

        const token = jwt.sign({email:result.email , id:result._id} , secretkey);
         res.status(200).json({user:result , token:token});   

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
       if(curuser.role !== "admin")
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

const deleteemployee = async (req , res) => {
    const {empid} = req.params;
    try
    {
        const id = req.userId;
        const curuser = await userModel.findOne({_id:id});
        if(curuser.role !== "admin")
        {
                return res.status(401).json({messege:"unauthorised access"});
        } 
        console.log(empid);
        const result = await empModel.deleteOne({empid:empid});
        if(result.deletedCount === 0)
        {
            return res.status(400).json({messege:"employee does not exist"});
        }

        return res.status(200).json({messege:"employee deleted successfully"});
        


    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({messege:"something went wrong"});
    }
}

const signinadmin = async (req , res) => {

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
        if(existinguser.role !== "admin")
        {
            return res.status(400).json({messege:"you are not admin"});
        }
        
        const token =  jwt.sign({email:existinguser.email , id:existinguser._id} , secretkey);
         return res.status(200).json({user:existinguser , token:token});

    }
    catch (error) {
        console.log(error);
       return  res.status(500).json({messege: "something went wrong"});

    }



}

module.exports = {adduser , getallemployee , deleteemployee , signinadmin};