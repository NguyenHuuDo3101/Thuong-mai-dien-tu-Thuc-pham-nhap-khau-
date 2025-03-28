import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function VnPay() {
  const { order } = useSelector((state) => state.orderInfo);

  const handleVNPay = async () => {
    const OrderPaid = {
      ...order,
      status: "pendding",
      paymentMethod: "payOnline",
    };

    try {
      // Gửi yêu cầu đến server để tạo thanh toán
      const { data } = await axios.post(
        "http://localhost:4000/payment/create",
        OrderPaid
      );

      // Trả về URL từ response
      const paymentUrl = data.url;

      // Chuyển hướng người dùng tới trang thanh toán VNPay
      window.location.href = paymentUrl;

      // (Optional) Xóa giỏ hàng nếu cần sau khi chuyển hướng
      localStorage.removeItem("cartItems");

    } catch (error) {
      console.error("Error creating VNPay payment:", error);
    }
  };

  return (
    // <div className="payment-vnpay" onClick={handleVNPay}>
    //   <button onClick={handleVNPay}>
    //     <i>VN Pay</i>
    //   </button>
    // </div>

    <div className="vnpay" onClick={handleVNPay}>
      <img src="data:image/png;base64,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"></img>
    </div>
  );
}
