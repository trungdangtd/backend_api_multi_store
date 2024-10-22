//omport express module
const express = require('express');

const helloRouter = require('./route/hello');

const mongoose = require('mongoose');

//defind the port number the sever listen to
const PORT = 3000;

//create an express application
const app = express();
//mongodb string 
const DB = "mongodb+srv://trungdang1301:Abc13012003@cluster0.hqygj.mongodb.net/"


//middleware - to register routes or to mount the routes
app.use(helloRouter);

mongoose.connect(DB).then(()=>{
    console.log("Connection successful");
}).catch((err)=>console.log("No connection"));

app.listen(PORT,"0.0.0.0", function(){
    console.log(`Server is running on port ${PORT}`);
})