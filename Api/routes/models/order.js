const mongoose=require("mongoose");

const OrderSchema=mongoose.Schema({
     
    _id:mongoose.Schema.Types.ObjectId,
     product : {type:mongoose.Schema.Types.ObjectId, ref: 'Product',required:true},//make relation with product
     quantity: {type:Number, default: 1}    //validation at input
});

module.exports=mongoose.model('Order',OrderSchema);