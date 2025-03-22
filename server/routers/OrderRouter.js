import express from 'express'
import {
  createOrder,
  GetAllOrder,
  DeleteOrder,
  ShippingProduct,
  GetAllOrderPendding,
  GetAllOrderShipping,
  GetAllOrderPaid,
  PaidProduct,
  GetOrderPenddingByUser,
  GetOrderShippingByUser,
  GetOrderPaidByUser,
  GetAllOrderInAMonth,
  GetAllOrderPaypal,
  GetOrderPaypalByUser,
  updateOrder,
  PrintOrderGhn,
  clientCancelOrder,
  CompletedProduct,
  GetAllOrderComplete,
} from "../controllers/OrderController.js";
import { isAuth, isAdmin } from "../untils/until.js";

const OrderRouter = express.Router();

OrderRouter.post("/create", createOrder);
OrderRouter.post("/update/:id", updateOrder);
OrderRouter.post("/cancel/:id", clientCancelOrder);
OrderRouter.get("/print/:id", PrintOrderGhn);
OrderRouter.put("/shipping/:id", ShippingProduct);
OrderRouter.put("/paid/:id", PaidProduct);
OrderRouter.put("/completed/:id", CompletedProduct);
OrderRouter.delete('/delete/:id', DeleteOrder)

OrderRouter.get("/", GetAllOrder);
OrderRouter.get("/orderPaypal", GetAllOrderPaypal);
OrderRouter.get("/orderPendding", GetAllOrderPendding);
OrderRouter.get("/orderShipping", GetAllOrderShipping);
OrderRouter.get("/orderComplete", GetAllOrderComplete);
OrderRouter.get("/orderPaid", GetAllOrderPaid);

OrderRouter.get("/allOrderInAMonth", GetAllOrderInAMonth);

// --- user
OrderRouter.get('/:userId', GetAllOrder);
OrderRouter.get("/orderPaypal/:id", GetOrderPaypalByUser);
OrderRouter.get("/orderPendding/:id", GetOrderPenddingByUser);
OrderRouter.get("/orderShipping/:id", GetOrderShippingByUser);
OrderRouter.get("/orderpaid/:id", GetOrderPaidByUser);



export default OrderRouter