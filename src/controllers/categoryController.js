import Category from "../models/Category.js";
import Transaction from "../models/Transaction.js";

export const createCategory=async (req,res,next) => {
    try {
        const {userId,name,type}=req.body;

        const category=await Category.create({
            userId,
            name:String(name).trim(),
            type
        })

        res.status(201).json({
            success:true,
            message:"Category created successfully",
            data:category
        })
    } catch (error) {
        next(error);
    }
}

export const getAllCategories=async (req,res,next) => {
    try {
        const {userId,type}=req.query;
        const filter={};

        if(userId){
            filter.userId=userId;
        }

        if(type){
            filter.type=type;
        }

        const categories=await Category.find(filter).sort({createdAt:-1});

        res.status(200).json({
            success:true,
            count:categories.length,
            data:categories
        })
    } catch (error) {
        next(error);
    }
}


export const getCategoryById=async (req,res,next) => {
    try {
        const category=await Category.findById(req.params.id);

        if(!category){
            return res.status(404).json({
                success:false,
                message:"Category not found"
            })
        }

        res.status(200).json({
            success:true,
            data:category
        })
    } catch (error) {
        next(error);
    }
}

export const updateCategory=async (req,res,next) => {
    try {
        const {name,type}=req.body;
        const updateData={};

        if(name!==undefined){
            const trimmedName=String(name).trim();

            if(!trimmedName){
                return res.status(400).json({
                    success:false,
                    message:"Category name cannot be empty"
                })
            }

            updateData.name=trimmedName;
        }

        if(type!==undefined){
            updateData.type=type;
        }

        if(Object.keys(updateData).length===0){
            return res.status(400).json({
                success:false,
                message:"No valid fields provided for update"
            })
        }

        const linkedTransactions=await Transaction.countDocuments({category:req.params.id});

        if(linkedTransactions>0 && updateData.type){
            return res.status(400).json({
                success:false,
                message:"Cannot change category type because transactions are using it"
            })
        }

        const category=await Category.findByIdAndUpdate(req.params.id,updateData,{
            new: true, runValidators:true
        })

        if(!category){
            return res.status(404).json({
                success:false,
                message:"Category not found"
            })
        }

        res.status(200).json({
            success:true,
            message:"Category updated successfully",
            data:category
        })
    } catch (error) {
        next(error);
    }
}


export const deleteCategory=async (req,res,next) => {
    try {
        const linkedTransactions=await Transaction.countDocuments({category:req.params.id})
        if(linkedTransactions>0){
          return res.status(400).json({
            success:false,
            message:"Cannot delete category because transactions are using it"
          })
        }

        const category=await Category.findByIdAndDelete(req.params.id);

        if(!category){
            return res.status(404).json({
                success:false,
                message:"Category not found"
            })
        }

        res.status(200).json({
            success:false,
            message:"Category deleted successfully"
        })
    } catch (error) {
        next(error);
    }
}