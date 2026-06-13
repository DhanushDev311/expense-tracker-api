import mongoose from "mongoose";
const transactionSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:[true,"User ID is required"],
        trim:true
    },

    title:{
        type:String,
        required:[true,"Transaction title is required"],
        trim:true,
        maxlength:[100,"Title cannot exceed 100 characters"]
    },

    amount:{
        type:Number,
        required:[true,"Amount is required"],
        min:[1,"Amount must be greater than 0"]
    },

    type:{
        type:String,
        enum:["income","expense"],
        required:[true,"Transaction type is required"]
    },

    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:[true,"Category is required"]
    },

    note:{
        type:String,
        trim:true,
        maxlength:[300,"Note cannot exceed 300 characters"]
    },

    transactionDate:{
        type:Date,
        required:[true,"Transaction date is required"],
        default:Date.now
    }
},{
    timestamps:true
});


const Transaction=mongoose.model("Transaction",transactionSchema);

export default Transaction;