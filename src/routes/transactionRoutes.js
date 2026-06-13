import express from "express";
import{
   createTransaction,
   getAllTransactions,
   getTransactionById,
   updateTransaction,
   deleteTransaction,
   getSummary,
   getMonthlySummary,
   getCategorySummary
} from "../controllers/transactionController.js";

const router=express.Router();

router.get("/summary",getSummary);
router.get("/summary/monthly",getMonthlySummary);
router.get("/summary/categories",getCategorySummary);

router.route("/")
.post(createTransaction)
.get(getAllTransactions);

router.route("/:id")
.get(getTransactionById)
.patch(updateTransaction)
.delete(deleteTransaction);

export default router;