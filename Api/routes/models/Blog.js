const mongoose=require("mongoose");

const BlogSchema=mongoose.Schema({
     
    _id:mongoose.Schema.Types.ObjectId,
     title : {type:String,  Required: true} ,
     body: {type:String,  Required: true} , //validation at input
     author: {type:String, Required: true} 
});

module.exports=mongoose.model('Blog',BlogSchema);