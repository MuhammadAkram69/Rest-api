const express = require("express");
const router=express.Router();
const mongoose=require("mongoose");
const { response } = require("../../app");
const multer=require('multer');


const storage=multer.diskStorage({
    destination : function(req,file,cb){
        cb(null, '/uploads')
    },
    filename : function(req,file,cb){
        cb(null, new Date().toISOString()+ file.originalname )
    },
})

const filefilter=(req, file, cb)=>{
    if(file.mimetype==='image.jpeg' || file.mimetype==='image.png'){
        cb(null,true)
    }else{
        cb(null,false)
    }
};

const upload=multer({storage: storage,limits:{fileSize: 1024*1024*5},fileFilter:filefilter});
const Product =require('./models/product');

//GET product route
     
router.get('/',(req,res,next)=>{

    Product.find()
    .select("name price _id productImage")
    .exec()
    .then(docs=>{
       const response= {
            count:docs.length,
            products:docs.map(doc=>{
                 return{
                    name:doc.name,
                    price:doc.price,
                    // productImage:doc.productImage, 
                    _id:doc._id,
                    request:{
                        Type:'GET',
                        url:'http://localhost:8000/products/'+ doc._id,
                    }
                 }
            })

        }
        console.log(response);
        res.status(200).json(response);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
});

//POST product route
// upload.single('ProductImage')

router.post('/',(req,res,next)=>{
   console.log(req.file);
    const product= new Product({
        _id : mongoose.Types.ObjectId(), //special type of id provided by moongose
        name: req.body.name,
        price: req.body.price,
        author: req.body.author
        // productImage: req.file.path
    });

    product.save().then(result=>{
        console.log(result);
        res.status(201).json  ({
            message: "Product created Successfully!",
            Createdproduct : {
                name:result.name,
                price:result.price,
                _id:result._id,
                request:{
                    Type: "GET",
                    URL: "http://localhost:8000/products/" + result._id
                }
            }
        });
    }).catch(err=>{
        console.log(err),
        res.status(500).json({
            error:err
        })

    })     //This will save the product in database and show result/error on console
    
});

//To get specific product with specific id

router.get('/:productId',(req,res,next)=> { 
      const id=req.params.productId;
    Product.findById(id)
         .select("name price _id productImage")
        .exec()
        .then(doc=>{
            console.log("fetching from DB",doc);
            if(doc){
                res.status(200).json(doc);
            }else{
                res.status(404).json({
                    message: "No any product find against requested ID"
                });
            }
            res.status(200).json(doc);
        })
        .catch(err=> {
            console.log(err);
            res.status(500).json({error:err})
        });
});

//Route to update specific product

router.patch('/:productId',(req,res,next)=> { 
    const id=req.params.productId;
    const updateOps={};

    for(const ops of req.body){
        updateOps[ops.newname]=ops.value;
    }
    Product.updateMany({_id:id},{$set: updateOps})
    .exec()
    .then(result =>{
        console.log(result);
        res.status(200).json(result)
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    })
    
});

// Route To delete specific product
router.delete('/:productId',(req,res,next)=> { 
    
    const id=req.params.productId;
    Product.remove({_id:id})
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json(result)
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    })
    // res.status(200).json({
    //        message:"Product Deleted Successfully!"
    // });
});

module.exports = router;
