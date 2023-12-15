const express = require('express')
const adminroutes = require('./routes/adminRoutes')
const app = express()
const port = 3000
const mongoose = require("mongoose")
const userroutes = require('./routes/userRoutes')
const http = require('http');
const socketIO = require('socket.io');
const multer = require('multer');

const server = http.createServer(app);
const io = socketIO(server);

app.get('/', (req, res) => {
  res.send('Hello World!')
})
// app.use((req , res , next) => {
//     console.log("HTTP METHOD: " + req.method + ", URL: " + req.url);
//     next();
// });
app.use(express.json());
app.use('/users' , userroutes);
app.use('/admin' , adminroutes);

mongoose.connect('mongodb+srv://admin:admin123@cluster0.r6ybd84.mongodb.net/?retryWrites=true&w=majority')
.then((res)=>{
    app.listen(port, () => {
        console.log(` app listening on port ${port}`);
      })
})
.catch((error)=>{
    console.log(error);
})

