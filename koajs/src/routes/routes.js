import Router from "koa-router";
import bookHandler from "../handlers/books/bookHandlers.js";
import productHandler from "../handlers/product/productHandlers.js";
import productInputMiddleware from "../middleware/productInputMiddleware.js";

// Prefix all routes with /books
const router = new Router({
  prefix: "/api",
});
router.get("/books", bookHandler.getBooks);
router.get("/books/:id", bookHandler.getBook);
router.post("/book", bookHandler.save);

router.get("/products", productHandler.getProducts);
router.post("/product", productInputMiddleware, productHandler.save);
router.put("/product/:id", productHandler.updatedProductById);
router.delete("/product/:id", productHandler.deleteProduct);
router.get("/product/:id", productHandler.getProductsById);

export default router;
