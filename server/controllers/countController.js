import expressAsyncHandler from "express-async-handler";
import { UserModel } from "../models/UserModel.js";
import { ProductModel } from "../models/ProductModel.js";
import { OrderModel } from "../models/OrderModel.js";

export const getCounts = expressAsyncHandler(async (req, res) => {
  try {
    // Đếm số lượng người dùng
    const userCount = await UserModel.countDocuments({});

    // Đếm số lượng sản phẩm
    const productCount = await ProductModel.countDocuments({});

    // Đếm số lượng đơn hàng
    const orderCount = await OrderModel.countDocuments({});

    // Tính tổng giá trị của tất cả đơn hàng
    const totalRevenue = await OrderModel.aggregate([
      {
        $group: {
          _id: null, // Nhóm theo null để tính tổng cho toàn bộ
          total: { $sum: "$totalPrice" }, // Tính tổng giá trị của totalPrice
        },
      },
    ]);

    // Lấy tổng doanh thu
    const totalPrice = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    // Trả về kết quả
    res.status(200).json({
      users: userCount,
      products: productCount,
      orders: orderCount,
      totalPrice: totalPrice, // Thêm tổng giá trị đơn hàng
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi đếm dữ liệu", error });
  }
});
export const getRevenueByDate = expressAsyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  // Kiểm tra nếu startDate và endDate được cung cấp
  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp startDate và endDate" });
  }

  try {
    // Tính tổng doanh thu trong khoảng thời gian
    const revenue = await OrderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate), // Ngày bắt đầu
            $lte: new Date(endDate), // Ngày kết thúc
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Nhóm theo ngày
          totalRevenue: { $sum: "$totalPrice" }, // Tính tổng giá trị của totalPrice
        },
      },
      {
        $sort: { _id: 1 }, // Sắp xếp theo ngày
      },
    ]);

    // Trả về kết quả
    res.status(200).json(revenue);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tính doanh thu", error });
  }
});
