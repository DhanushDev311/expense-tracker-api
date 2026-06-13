import express from "express";
import categoryRoutes from "./routes/categoryRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import notFound from "./middlewares/notFoundMiddleware.js";

const app=express();
app.use(express.json());

app.get("/",(req,res) =>{
    res.status(200).json(
        {
            success:true,
            message:"Expense Tracker API is running"
        }
    );
});

app.use("/api/categories",categoryRoutes);
app.use("/api/transactions",transactionRoutes);

app.use(notFound);
app.use(errorHandler);


export default app;
