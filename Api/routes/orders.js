const express=require("express");
const router=express.Router();
const mongoose=require ("mongoose");
const order = require("./models/order");

// const Order =require('./models/order');
const Product=require('./models/product');
//Route to fetch order
router.get('/',(req,res,next)=>{
   
    Order.find()
    .select("product,quantity, _id")
    .populate('product', 'name')
    .exec()
    .then(docs=>{
        console.log(docs);
        res.status(200).json({
            count:docs.length,
            orders: docs.map(doc=>{
                return{
                    _id:doc._id,
                    product:doc.product,
                    quantity:doc.quantity,
                    request:{
                        Type :"GET",
                        url: "https://localhost:8000/" + doc._id
                    }
                    
                }
            })
        });
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
        
    });
});

//Route to create order

router.post('/',(req,res,next)=>{
   Product.findById(req.body.productId) 
   .then(product=>{
    if(!product){
        return res.status(200).json({
            message:"Product not found!"
        });
    }
    const order=new Order({

    
        _id:mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
    
       });
      return order
      .save()
       .then( result =>{
        console.log(result),
         res.status(201).json({
            message:"Order stored successfully!",
            createdOrder:{
                _id: result._id,
                product:result.product,
                quantity:result.quantity
            },
            request:{
                Type:"GET",
                url: "https://localhost:8000/" + result._id
            }
         });
       })
       .catch(err=>{
          console.log(err),
          res.status(500).json({
            error:err
          });
       });
   });    
});

//Route to fetch individual order

router.get('/:orderId',(req,res,next)=>{

    Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order=>{ 
        res.status(200).json({
            order: order,
            request:{
                Type:"GET",
                URL:"https://localhost:8000/orders"
            }
            
        });
    })
    .catch(err=>{
        console.log(err),
        res.status(500).json({
            error:err
        });
    })
    // res.status(200).json  ({
    //     message: "Order Details!",
    //     orderId:req.params.orderId
    // });
});

//Route to delete order

router.delete('/:orderId',(req,res,next)=>{
   Order.remove({_id:req.params.orderId}).exec()
   .then(result=>{
      res.status(200).json({
        message:"Product deleted!",
        request:{
             Type:"POST",
             URL:"https://localhost:8000/orders",
             body:{product:"id",quantity:"Number"}
        }
      })
   })
   .catch(err=>{
    console.log(err),
    res.status(500).json({
        error:err
    });
});
});
module.exports=router;