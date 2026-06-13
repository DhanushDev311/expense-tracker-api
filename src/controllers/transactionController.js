import Category from "../models/Category.js";
import Transaction from "../models/Transaction.js";

const buildDateFilter=(startDate,endDate)=>{
    if(!startDate && !endDate) return null;

    const dateFilter={};

    if(startDate){
        const start=new Date(startDate);

        if(Number.isNaN(start.getTime())) return "INVALID_START_DATE";

        dateFilter.$gte=start;
    }

    if(endDate){
        const end=new Date(endDate);

        if(Number.isNaN(end.getTime())) return "INVALID_END_DATE";

        end.setHours(23,59,59,999);
        dateFilter.$lte=end;
    }

    return dateFilter;
}

export const createTransaction=async (req,res,next) => {
    try {
        const {userId,title,amount,type,category,note,transactionDate}=req.body;

        const categoryExists=await Category.findOne({
            _id:category,
            userId,
            type
        });

        if(!categoryExists){
            return res.status(404).json({
                success:false,
                message:"Category not found for this user and transaction type"
            })
        }

        const transaction=await Transaction.create({
            userId,title,amount,type,category,note,transactionDate
        })

        const populatedTransaction=await Transaction.findById(transaction._id).populate("category","name type");

        res.status(201).json({
            success:true,
            message:"Transaction created successfully",
            data:populatedTransaction
        })
    } catch (error) {
        next(error);
    }
}


export const getAllTransactions=async (req,res,next) => {
    try {
        const {userId,type,category,startDate,endDate,
            page=1,limit=10,sortBy="transactionDate",order="desc"
        }=req.query;

        const filter={};

        if(userId) filter.userId=userId;

        if(type) filter.type=type;

        if(category) filter.category=category;

        const dateFilter=buildDateFilter(startDate,endDate);

        if(dateFilter==="INVALID_START_DATE"){
            return res.status(400).json({
                success:false,
                message:"Invalid start Date"
            })
        }

        if(dateFilter==="INVALID_END_DATE"){
            return res.status(400).json({
                success:false,
                message:"Invalid end Date"
            })
        }

        if(dateFilter){
            filter.transactionDate=dateFilter;
        }

        const allowedSortFields=["transactionDate","createdAt","amount","title"];
        const safeSortBy=allowedSortFields.includes(sortBy)?sortBy:"transactionDate";
        const safeOrder=(order==="asc")?1:-1;

        const pageNumber=Math.max(Number(page)||1,1);
        const limitNumber=Math.min(Math.max(Number(limit)||10,1),50);
        const skip=(pageNumber-1)*limitNumber;

        const transactions=await Transaction.find(filter)
        .populate("category","name type")
        .sort({[safeSortBy]:safeOrder})
        .skip(skip)
        .limit(limitNumber)

        const totalTransactions=await Transaction.countDocuments(filter);
        const totalPages=Math.ceil(totalTransactions/limitNumber);

        res.status(200).json({
            success:true,
            currentpage:pageNumber,
            totalPages,
            totalTransactions,
            count:transactions.length,
            data:transactions
        })
    } catch (error) {
        next(error);
    }
}

export const getTransactionById=async (req,res,next) => {
    try {
        const transaction=await Transaction.findById(req.params.id).populate("category","name type");

        if(!transaction){
            return res.status(404).json({
                success:false,
                message:"Transaction not found"
            })
        }

        res.status(200).json({
            success:true,
            data:transaction
        })
    } catch (error) {
        next(error);
    }
}


export const updateTransaction=async (req,res,next) => {
    try {
        const existingTransaction=await Transaction.findById(req.params.id);

        if(!existingTransaction){
            return res.status(404).json({
                success:false,
                message:"Transaction not found"
            })
        }

         const {title,amount,type,category,note,transactionDate}=req.body;
         const updateData={};

         if(title!==undefined) updateData.title=title;
         if(amount!==undefined) updateData.amount=amount;
         if(type!==undefined) updateData.type=type;

         if(category!==undefined) updateData.category=category;
         if(note!==undefined) updateData.note=note;
         if(transactionDate!==undefined){
            const parsedDate=new Date(transactionDate);
            if(Number.isNaN(parsedDate.getTime())){
                return res.status(400).json({
                    success:false,
                    messsage:"Invalid transaction Date"
                })
            }
            updateData.transactionDate=parsedDate;
        }

        if(Object.keys(updateData).length===0){
            return res.status(400).json({
                success:false,
                message:"No valid fields provided for updation"
            })
        }

        const nextType=updateData.type || existingTransaction.type;
        const nextCategory=updateData.category || existingTransaction.category;

        const categoryExists=await Category.findOne({
            _id:nextCategory,
            userId:existingTransaction.userId,
            type:nextType
        })

        if(!categoryExists){
            return res.status(404).json({
                success:false,
                message:"Category not found for this user and transaction type"
            })
        }

        const updatedTransaction=await Transaction.findByIdAndUpdate(req.params.id,updateData,
        {
            new:true,
            runValidators:true
        }
    ).populate("category","name type")

    res.status(200).json({
        success:true,
        message:"Transaction updated successfully",
        data:updatedTransaction
    })
    } catch (error) {
        next(error);
    }
}

export const deleteTransaction=async (req,res,next) => {
    try {
        const transaction=await Transaction.findByIdAndDelete(req.params.id);
        if(!transaction){
            return res.status(404).json({
                success:false,
                message:"Transaction not found"
            })
        }

        res.status(200).json({
            success:true,
            messsage:"Transaction deleted successfully"
        })
    } catch (error) {
        next(error);
    }
}

export const getSummary=async (req,res,next) => {
    try {
        const {userId,startDate,endDate}=req.query;

        if(!userId){
            return res.status(400).json({
                success:false,
                message:"user ID is required"
            })
        }

        const matchStage={userId};
        const dateFilter=buildDateFilter(startDate,endDate);

        if(dateFilter==="INVALID_START_DATE"){
            return res.status(400).json({
                success:false,
                message:"Invalid start date"
            })
        }

        if(dateFilter==="INVALID_END_DATE"){
            return res.status(400).json({
                success:false,
                message:"Invalid end date"
            })
        }

        if(dateFilter){
            matchStage.transactionDate=dateFilter;
        }

        const summary=await Transaction.aggregate(
        [
            {$match:matchStage},
            {
                $group:{
                    _id:"$type",
                    totalAmount:{$sum:"$amount"},
                    count:{$sum:1}
                }
            }
        ])

        const income=summary.find((item)=>item._id==="income")?.totalAmount||0;
        const expense=summary.find((item)=>item._id==="expense")?.totalAmount||0;

        res.status(200).json({
            success:true,
            data:{
                income,
                expense,
                balance:income-expense,
                summary
            }
        })
    } catch (error) {
        next(error);
    }
}


export const getMonthlySummary=async (req,res,next) => {
    try {
        const {userId,year}=req.query;

        if(!userId || !year){
            return res.status(400).json({
                success:false,
                message:"user ID and year are required"
            })
        }

        const parsedYear=Number(year);

        if(!Number.isInteger(parsedYear) || parsedYear<1900){
            return res.status(400).json({
                success:false,
                message:"Invalid year"
            })
        }

        const startOfYear=new Date(`${parsedYear}-01-01T00:00:00.000Z`);
        const endOfYear=new Date(`${parsedYear+1}-01-01T00:00:00.000Z`);

        const monthlySummary=await Transaction.aggregate(
        [
            {
                $match:{
                    userId,
                    transactionDate:{
                        $gte:startOfYear,
                        $lt:endOfYear
                    }
                }
            },
            {
                $group:{
                    _id:{
                        month:{$month: "$transactionDate"},
                        type:"$type"
                    },
                    totalAmount:{$sum:"$amount"},
                    count:{$sum:1}
                }
            },
            {
                $sort:{
                    "_id.month":1
                }
            }
        ])


        const data=Array.from({length:12},(_,index)=>{
            const month=index+1;
            const incomeData=monthlySummary.find((item)=>item._id.month===month && item._id.type==="income");
            const expenseData=monthlySummary.find((item)=>item._id.month===month && item._id.type==="expense");

            const income=incomeData?.totalAmount||0;
            const expense=expenseData?.totalAmount||0;

            return{
                month,
                income,
                expense,
                balance:income-expense
            }
        })

        return res.status(200).json({
            success:true,
            year:parsedYear,
            data
        })
    } catch (error) {
        next(error);
    }
}


export const getCategorySummary=async (req,res,next) => {
    try {
        const {userId,type,startDate,endDate}=req.query;

        if(!userId){
            return res.status(400).json({
                success:false,
                message:"user ID is required"
            })
        }

        const matchStage={userId};

        if(type) matchStage.type=type;

        const dateFilter=buildDateFilter(startDate,endDate);

        if(dateFilter==="INVALID_START_DATE"){
            return res.status(400).json({
                success:false,
                message:"Invalid start Date"
            })
        }

        if(dateFilter==="INVALID_END_DATE"){
            return res.status(400).json({
                success:false,
                message:"Invalid end Date"
            })
        }

        if(dateFilter){
            matchStage.transactionDate=dateFilter;
        }

        const categorySummary=await Transaction.aggregate(
            [
                {$match:matchStage},
                {
                    $group:{
                        _id:"$category",
                        totalAmount:{$sum:"$amount"},
                        count:{$sum:1}
                    }
                },
                {
                    $lookup:{
                        from:"categories",
                        localField:"_id",
                        foreignField:"_id",
                        as:"category"
                    }
                },
                {$unwind:"$category"},
                {
                    $project:{
                        _id:0,
                        categoryId:"$category._id",
                        categoryName:"$category.name",
                        categoryType:"$category.type",
                        totalAmount:1,
                        count:1
                    }
                },
                {
                    $sort:{
                        totalAmount:-1
                    }
                }
            ]
        )

        res.status(200).json({
            success:true,
            count:categorySummary.length,
            data:categorySummary
        })
    } catch (error) {
        next(error);
    }
}
