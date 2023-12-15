const jwt = require("jsonwebtoken");
const secretkey = "NOTESAPI";

const auth = (req , res , next) => {
    try {
         let token = req.headers.authorization;
         if(token)
         {
            token = token.split(" ")[1];
            const user = jwt.verify(token , secretkey);
            req.userId = user.id;
         }
         else
         {
            console.log("unauthorised access");
            return res.status(401).json({messege:"unauthorized access"});
         }
         next(); 
        
    } catch (error) {
        console.log(error);
        return res.status(401).json({messege:"unauthorized access"});
        
    }
    
}
module.exports = auth;