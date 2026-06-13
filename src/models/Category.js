import mongoose from "mongoose";

const categorySchema= new mongoose.Schema(
    {   
        userId:{
        type:String,
        required:[true,"User ID is required"],
        trim:true
        },

        name:{
            type: String,
            required: [true,"Category name is required"],
            trim: true,
            maxlength: [50,"Category name cannot exceed 50 characters"]
        },

        type:{
            type:String,
            enum:["income","expense"],
            required:[true,"Category type is required"]
        }
    },
    {
        timestamps: true
    }
);


categorySchema.index({userId:1,name:1,type:1},{unique:true});

const Category=mongoose.model("Category",categorySchema);

export default Category;