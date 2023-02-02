const { Router } = require("express");
const express=require("express");
const morgan=require("morgan");
const BodyParser = require("body-parser");
const mongoose =require("mongoose");
global.TextEncoder = require("util").TextEncoder; global.TextDecoder = require("util").TextDecoder;

const app = express();

app.use(morgan('dev'));
app.use(BodyParser.urlencoded({extended: false}));
app.use(BodyParser.json());
app.use('/uploads',express.static('uploads')); //This will make the folder "uploads" publically available.

mongoose.Promise=global.Promise;
//Connectiong database

//Method to Connect DB locally installed
mongoose.connect('mongodb://localhost:27017/Rest-Api')
.then(()=> {console.log("Mongodb connected..")})


//Method to connect mongdb atlas

//  mongoose.connect('mongodb+srv://Node-shop:Node-shop@node-shop.uatkmer.mongodb.net/?retryWrites=true&w=majority/Rest-Api')
//  .then(()=> {console.log("Mongodb connected..")});


//Handling CORS by sending headers in json form
app.use((req,res,next)=>{
     res.header('Access-Control-Allow-Origin','*'),
     res.header('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type, Accept,Authorization")
     
     if(req==='OPTIONS')
     {
        res.header("Access-Control-Allow-Methods","GET,POST,PUT,PATCH,DELETE")
        return res.status(200).json({});
     }
     next();
});

const productRoutes = require('./Api/routes/products');
const orderRoutes = require('./Api/routes/orders');
const userRoutes = require('./Api/routes/users');
const blogRoutes = require('./Api/routes/Blogs');

//Routes which will handle requests
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/users',userRoutes);
app.use('/blogs',blogRoutes);

//Error Handling

//This will sends error to middleware
app.use((req,res,next) => {
    const error=new Error("Not found");
    error.status=404;
    next(error);
});

//Handling errors
app.use((error,req,res,next)=> {
    res.status(error.status ||500)
        
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;