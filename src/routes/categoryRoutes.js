import express from "express";
import{
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from "../controllers/categoryController.js"

const router=express.Router();

router.route("/")
.post(createCategory)
.get(getAllCategories)

router.route("/:id")
.get(getCategoryById)
.patch(updateCategory)
.delete(deleteCategory)

export default router;