const mongoose=require("mongoose");

const ProductSchema=mongoose.Schema({
     
    _id:mongoose.Schema.Types.ObjectId,
     title : {type:String, Required: true},
     body: {type:Number, Required: true}, 
     author: {type: String, Required: true}   //validation at input
    //  productImage:{type:String}
});

module.exports=mongoose.model('Product',ProductSchema);