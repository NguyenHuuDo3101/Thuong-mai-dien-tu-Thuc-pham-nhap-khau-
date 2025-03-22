import mongoose from "mongoose";

// Định nghĩa schema
const Schema = mongoose.Schema;

const SelectList = new Schema(
  {
    name: String,
    property: String,
    options: Array,
  },
  {
    timestamps: true, // Sửa `timestamp` thành `timestamps` để tự động thêm createdAt và updatedAt
  }
);

// Tạo model
export const SelectListModel = mongoose.model("SelectList", SelectList);

// Ví dụ phương thức controller xử lý tìm kiếm sản phẩm theo thuộc tính
export const findProductByProperty = async (req, res) => {
  try {
    const { property } = req.query;

    // Logic của bạn để tìm sản phẩm theo thuộc tính
    const products = await ProductModel.find({ property });

    if (!products || products.length === 0) {
      // Gửi phản hồi nếu không tìm thấy sản phẩm
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // Gửi phản hồi nếu tìm thấy sản phẩm
    return res.json(products);
  } catch (error) {
    // Xử lý lỗi và gửi phản hồi
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
