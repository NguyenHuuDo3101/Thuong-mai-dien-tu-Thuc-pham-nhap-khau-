import { OrderModel } from "../models/OrderModel.js";
import expressAsyncHandler from "express-async-handler";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const createOrder = expressAsyncHandler(async (req, res) => {
  if (req.body.orderItems.length === 0) {
    return res.status(400).send({ message: "Cart is empty" }); // Thêm return
  } else {
    const order = new OrderModel({
      order_code: "",
      to_ward_code: req.body.to_ward_code,
      to_district_id: req.body.to_district_id,
      cancelOrder: false,
      orderItems: req.body.orderItems,
      shippingAddress: {
        province: req.body.shippingAddress.province,
        district: req.body.shippingAddress.district,
        ward: req.body.shippingAddress.ward,
        detail: req.body.shippingAddress.more,
        name: req.body.shippingAddress.name,
        phone: req.body.shippingAddress.phone,
      },
      paymentMethod: req.body.paymentMethod,
      paymentResult: req.body.paymentResult
        ? {
            id: req.body.paymentResult.id,
            status: req.body.paymentResult.status,
            update_time: req.body.paymentResult.update_time,
            email_address: req.body.paymentResult.payer.email_address,
          }
        : "",
      totalPrice: req.body.totalPrice,
      status: req.body.status ? req.body.status : "pending",
      name: req.body.name,
      user: req.body.user,
    });

    const createOrder = await order.save();
    return res
      .status(201)
      .send({ message: "New order created", order: createOrder }); // Thêm return
  }
});

export const clientCancelOrder = expressAsyncHandler(async (req, res) => {
  const updateOrder = await OrderModel.findById({ _id: req.params.id });

  if (updateOrder) {
    updateOrder.cancelOrder = true;
    await updateOrder.save();
    return res.send(updateOrder); // Thêm return
  } else {
    return res.status(404).send({ message: "Order not found" }); // Thêm return
  }
});

export const updateOrder = expressAsyncHandler(async (req, res) => {
  console.log("updateOrder");
  let updateOrder = await OrderModel.findById({ _id: req.params.id });

  if (updateOrder) {
    let items = updateOrder.orderItems.map((x) => ({
      name: x.name,
      quantity: parseInt(x.qty),
      price: x.salePrice,
    }));

    const orderGhn = {
      payment_type_id: 2,
      note: "Tintest 123",
      from_name: "Tin",
      from_phone: "0909999999",
      from_address: "123 Đường 3/2",
      from_ward_name: "Phường 5",
      from_district_name: "Quận 11",
      from_province_name: "TP Hồ Chí Minh",
      required_note: "KHONGCHOXEMHANG",
      return_name: "Tin",
      return_phone: "0909999999",
      return_address: "123 Đường 3/2",
      return_ward_name: "Phường 5",
      return_district_name: "Quận 11",
      return_province_name: "TP Hồ Chí Minh",
      client_order_code: "",
      to_name: updateOrder.name,
      to_phone: updateOrder.shippingAddress.phone,
      to_address: `${updateOrder.shippingAddress.province}, ${updateOrder.shippingAddress.district}, ${updateOrder.shippingAddress.ward}, ${updateOrder.shippingAddress.detail}`,
      to_ward_name: updateOrder.shippingAddress.ward,
      to_district_name: updateOrder.shippingAddress.district,
      to_province_name: updateOrder.shippingAddress.province,
      cod_amount:
        updateOrder.paymentMethod === "payOnline" ? 0 : updateOrder.totalPrice,
      weight: 200,
      length: 1,
      width: 19,
      height: 10,
      items: items,
    };

    updateOrder.order_code = req.params.id;
    await updateOrder.save();

    try {
      console.log("-----", orderGhn);
      const { data } = await axios.post(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create",
        orderGhn,
        {
          headers: {
            "Content-Type": "application/json",
            shop_id: process.env.SHOP_ID,
            token: process.env.TOKEN_GHN,
          },
        }
      );
      console.log({ data });

      const order_code = data.data.order_code;
      updateOrder.order_code = order_code;
      await updateOrder.save();
      return res.send(updateOrder); // Thêm return
    } catch (error) {
      return res.status(500).send({ message: error.message }); // Xử lý lỗi và thêm return
    }
  } else {
    return res.status(404).send({ msg: "Order not found" }); // Thêm return
  }
});

export const PrintOrderGhn = expressAsyncHandler(async (req, res) => {
  const Order = await OrderModel.findById({ _id: req.params.id });
  if (Order) {
    let token;
    try {
      const { data } = await axios.get(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/a5/gen-token",
        {
          headers: {
            Token: process.env.TOKEN_GHN,
          },
          params: {
            order_codes: Order.order_code,
          },
        }
      );

      token = data.data.token;
      Order.token = token;
      await Order.save();

      const result = await axios.get(
        `https://dev-online-gateway.ghn.vn/a5/public-api/printA5?token=${token}`,
        {
          headers: {
            Token: process.env.TOKEN_GHN,
          },
        }
      );
      return res.send(result.config.url); // Thêm return
    } catch (error) {
      return res.status(500).send({ message: error.message }); // Xử lý lỗi và thêm return
    }
  } else {
    return res.status(404).send({ message: "Order not found" }); // Thêm return
  }
});

export const GetAllOrder = expressAsyncHandler(async (req, res) => {
  const userId = req.params.userId;

  let filter = {};
  if (userId) {
    filter.user = userId; // Nếu có userId trong URL thì lọc theo user
    console.log("Fetching orders for user ID: ", userId);
  } else {
    console.log("Fetching all orders"); // Nếu không có userId thì lấy tất cả đơn hàng
  }

  // Lấy đơn hàng dựa trên điều kiện lọc
  const orders = await OrderModel.find(filter).sort({ createdAt: -1 });

  if (orders && orders.length > 0) {
    return res.send(orders);
  } else {
    return res.status(404).send({ message: "No orders found" });
  }
});
export const GetAllOrderPaypal = expressAsyncHandler(async (req, res) => {
  const Order = await OrderModel.find({ paymentMethod: "payOnline" }).sort({
    createdAt: -1,
  });
  if (Order) {
    return res.send(Order); // Thêm return
  } else {
    return res.status(404).send({ message: "No orders found" }); // Thêm return
  }
});

export const GetAllOrderPendding = expressAsyncHandler(async (req, res) => {
  const Order = await OrderModel.find({
    $or: [{ status: "pending" }, { paymentMethod: "payOnline" }],
  }).sort({ createdAt: -1 });
  if (Order) {
    return res.send(Order); // Thêm return
  } else {
    return res.status(404).send({ message: "No orders found" }); // Thêm return
  }
});

export const GetAllOrderShipping = expressAsyncHandler(async (req, res) => {
  const Order = await OrderModel.find({ status: "shipping" }).sort({
    createdAt: -1,
  });
  if (Order) {
    return res.send(Order); // Thêm return
  } else {
    return res.status(404).send({ message: "No orders found" }); // Thêm return
  }
});
export const GetAllOrderComplete = expressAsyncHandler(async (req, res) => {
  const Order = await OrderModel.find({ status: "completed" }).sort({
    createdAt: -1,
  });
  if (Order) {
    return res.send(Order); // Thêm return
  } else {
    return res.status(404).send({ message: "No orders found" }); // Thêm return
  }
});
export const GetAllOrderPaid = expressAsyncHandler(async (req, res) => {
  const Order = await OrderModel.find({ status: "paid" }).sort({
    createdAt: -1,
  });
  if (Order) {
    return res.send(Order); // Thêm return
  } else {
    return res.status(404).send({ message: "No orders found" }); // Thêm return
  }
});

export const DeleteOrder = expressAsyncHandler(async (req, res) => {
  const deleteOrder = await OrderModel.findById({ _id: req.params.id });

  if (deleteOrder) {
    await deleteOrder.remove();
    return res.send({ message: "Order deleted" }); // Thêm return
  } else {
    return res.status(404).send({ message: "Order not found" }); // Thêm return
  }
});

export const ShippingProduct = expressAsyncHandler(async (req, res) => {
  const status = "shipping";
  const Order = await OrderModel.findById({ _id: req.params.id });
  if (Order) {
    Order.status = status;
    await Order.save();
    return res.send(Order); // Thêm return
  } else {
    return res.status(404).send({ message: "No orders found" }); // Thêm return
  }
});
export const CompletedProduct = expressAsyncHandler(async (req, res) => {
  const status = "completed";
  const Order = await OrderModel.findById({ _id: req.params.id });
  if (Order) {
    Order.status = status;
    await Order.save();
    return res.send(Order); // Thêm return
  } else {
    return res.status(404).send({ message: "No orders found" }); // Thêm return
  }
});
export const PaidProduct = expressAsyncHandler(async (req, res) => {
  const status = "paid";
  const Order = await OrderModel.findByIdAndUpdate(
    { _id: req.params.id },
    { status: status }
  );
  if (Order) {
    return res.send(Order); // Thêm return
  } else {
    return res.status(404).send({ message: "No orders found" }); // Thêm return
  }
});

// --------------------    user

export const GetOrderByUser = expressAsyncHandler(async (req, res) => {
  const Order = await OrderModel.find({ user: req.params.id }).sort({
    createdAt: -1,
  });
  if (Order) {
    return res.send(Order); // Thêm return
  } else {
    return res.status(404).send({ message: "No orders by user" }); // Thêm return
  }
});

export const GetOrderPaypalByUser = expressAsyncHandler(async (req, res) => {
  const Order = await OrderModel.find({
    user: req.params.id,
    paymentMethod: "payOnline",
  }).sort({ createdAt: -1 });
  if (Order) {
    return res.send(Order); // Thêm return
  } else {
    return res.status(404).send({ message: "No orders by user" }); // Thêm return
  }
});

export const GetOrderPenddingByUser = expressAsyncHandler(async (req, res) => {
  const Order = await OrderModel.find({
    user: req.params.id,
    status: "pendding",
  }).sort({ createdAt: -1 });
  if (Order) {
    return res.send(Order); // Thêm return
  } else {
    return res.status(404).send({ message: "No orders by user" }); // Thêm return
  }
});

export const GetOrderShippingByUser = expressAsyncHandler(async (req, res) => {
  const Order = await OrderModel.find({
    user: req.params.id,
    status: "shipping",
  }).sort({ createdAt: -1 });
  if (Order) {
    return res.send(Order); // Thêm return
  } else {
    return res.status(404).send({ message: "No orders by user" }); // Thêm return
  }
});

export const GetOrderPaidByUser = expressAsyncHandler(async (req, res) => {
  const Order = await OrderModel.find({
    user: req.params.id,
    status: "completed",
  }).sort({ createdAt: -1 });
  if (Order) {
    return res.send(Order); // Thêm return
  } else {
    return res.status(404).send({ message: "No orders by user" }); // Thêm return
  }
});

export const GetAllOrderInAMonth = expressAsyncHandler(async (req, res) => {
  const Order = await OrderModel.find({
    createdAt: {
      $gte: new Date(2021, 7, 11),
      $lt: new Date(2021, 7, 16),
    },
  });

  if (Order) {
    return res.send(Order); // Thêm return
  } else {
    return res.status(400).send({ message: "No products in a month" }); // Thêm return
  }
});
