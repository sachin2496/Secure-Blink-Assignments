const mongoose = require('mongoose');
const user = require('./user');

const empSchema = mongoose.Schema({

empid :{
    type:String ,
    required:true
},

empname : {
    type: String ,
    required: true

},

dept :{
    type:String ,
    required: true
} ,

userId :{
    type:mongoose.Types.ObjectId,
    ref:user,
    required:true
}




} , 
{timestamps:true}

);

module.exports = mongoose.model("Employee" , empSchema);

