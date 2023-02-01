const express=require("express");
const router=express.Router();
const mongoose=require ("mongoose");
const Blog = require("./models/Blog");

const Blog =require('./models/Blog');
// const Product=require('./models/product');
//Route to fetch Blog
router.get('/',(req,res,next)=>{
   
    Blog.find()
    .select("name,body,author")
    // .populate('product', 'name')
    .exec()
    .then(docs=>{
        console.log(docs);
        res.status(200).json({
            count:docs.length,
            Blogs: docs.map(doc=>{
                return{
                    _id:doc._id,
                    name:doc.name,
                    body:doc.body,
                    author: doc.author,
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

//Route to add blog

router.post('/blogs',(req,res,next)=>{
   Blog.findById(req.body.blogId) 
   .then(blog=>{
    if(!blog){
        return res.status(200).json({
            message:"Blog not found!"
        });
    }
    const blog=new Blog({

    
        _id:mongoose.Types.ObjectId(),
        name: req.body.blogId,
        body: req.body.body,
        author: req.body.author
    
       });
      return blog
      .save()
       .then( result =>{
        console.log(result),
         res.status(201).json({
            message:"Blog Created successfully!",
            BlogDetails:{
                name: result._id,
                body:result.body,
                author:result.author
            },
            request:{
                Type:"GET",
                url: "https://localhost:8000/"
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

// //Route to fetch individual order

// router.get('/:orderId',(req,res,next)=>{

//     Order.findById(req.params.orderId)
//     .populate('product')
//     .exec()
//     .then(order=>{ 
//         res.status(200).json({
//             order: order,
//             request:{
//                 Type:"GET",
//                 URL:"https://localhost:8000/orders"
//             }
            
//         });
//     })
//     .catch(err=>{
//         console.log(err),
//         res.status(500).json({
//             error:err
//         });
//     })
//     // res.status(200).json  ({
//     //     message: "Order Details!",
//     //     orderId:req.params.orderId
//     // });
// });

// //Route to delete order

// router.delete('/:orderId',(req,res,next)=>{
//    Order.remove({_id:req.params.orderId}).exec()
//    .then(result=>{
//       res.status(200).json({
//         message:"Product deleted!",
//         request:{
//              Type:"POST",
//              URL:"https://localhost:8000/orders",
//              body:{product:"id",quantity:"Number"}
//         }
//       })
//    })
//    .catch(err=>{
//     console.log(err),
//     res.status(500).json({
//         error:err
//     });
// });
// });
module.exports=router;