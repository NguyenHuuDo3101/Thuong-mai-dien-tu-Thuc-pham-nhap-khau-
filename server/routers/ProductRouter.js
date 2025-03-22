import express from "express";
import {
  getAllProduct,
  filterProductByType,
  findProductById,
  AddProduct,
  DeleteProduct,
  CommentProduct,
  UpdateProduct,
  SearchProduct,
  paginationProduct,
  RateProduct,
  RepCommentProduct,
  BlogProduct,
  PinCommentProduct,
  filterProductByRandomField,
  paginationProductClient,
} from "../controllers/ProductController.js";
import { isAuth, isAdmin } from "../untils/until.js";
import { upload } from "../untils/until.js";

const ProductRouter = express.Router();

ProductRouter.get("/:type", filterProductByType);
ProductRouter.post("/filter/random", filterProductByRandomField);
ProductRouter.get("/detail/:id", findProductById);
ProductRouter.get("/", getAllProduct);
ProductRouter.get(`/pagination/:page`, paginationProduct);
ProductRouter.get(`/paginationClient/:page`, paginationProductClient);

ProductRouter.post("/rate/:id/:userId", RateProduct);

// Comment on a product with the product ID and user ID
ProductRouter.post("/comment/:id/:userId", CommentProduct);
ProductRouter.post("/pin/comment/:id", PinCommentProduct);
ProductRouter.post("/rep/comment/:id", RepCommentProduct);

ProductRouter.post(
  "/create",
  // isAuth,
  // isAdmin,
  upload.single("image"),
  AddProduct
);
ProductRouter.put(
  "/update",
  // isAuth,
  // isAdmin,
  upload.single("image"),
  UpdateProduct
);
ProductRouter.post(
  "/blog/:id",
  // isAuth,
  // isAdmin,
  BlogProduct
);
ProductRouter.delete(
  "/delete/:id",
  // isAuth,
  // isAdmin,
  upload.single("image"),
  DeleteProduct
);

ProductRouter.get("/search/product", SearchProduct);

export default ProductRouter;
