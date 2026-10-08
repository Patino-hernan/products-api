import { ProductsController } from "../controllers/products.controller.ts";
import { Router } from "express";

const router = Router();
const productsController = new ProductsController();


router.get('/getAll', productsController.getAllProducts);
router.get('/getById/:id', productsController.getProductsById);
router.post("/create", productsController.createProduct);
router.put('/update/:id', productsController.updateProduct);
router.patch('/change-price/:id', productsController.updatePrice);
router.delete('/delete/:id', productsController.deleteProduct);

export default router;