import React from "react";
import { useDispatch } from "react-redux";
import {
  createOrderGhn,
  PrintOrderGhn,
} from "../../../../../actions/GhnAction";
import {
  deleteOrder,
  getAllOrder,
  ShippingOrder,
  CompletedOrder,
} from "../../../../../actions/OrderAction"; // Thêm CompletedOrder
import {
  formatPrice,
  formatDateOrderPaypal,
} from "../../../../../untils/index";
import { message } from "antd";
function Order(props) {
  const { order } = props;
  const dispatch = useDispatch();

  const {
    orderItems,
    totalPrice,
    paymentMethod,
    cancelOrder,
    shippingAddress,
    status,
    paymentResult,
  } = order;

  const handleShippingOrder = async (order) => {
    try {
      console.log("handleShippingOrder");
      await dispatch(createOrderGhn(order._id)); // Tạo đơn hàng ở Giaohangnhanh
      await dispatch(ShippingOrder(order._id));
      dispatch(getAllOrder());
      message.success("Đã xác nhận đơn hàng thành công!"); // Hiển thị thông báo thành công
    } catch (error) {
      message.error("Lỗi khi xác nhận đơn hàng!"); // Hiển thị thông báo lỗi
    }
  };

  const handlePrintOrder = (order) => {
    try {
      dispatch(PrintOrderGhn(order._id));
      message.success("Đã in đơn hàng thành công!"); // Hiển thị thông báo thành công
    } catch (error) {
      message.error("Lỗi khi in đơn hàng!"); // Hiển thị thông báo lỗi
    }
  };

  const handleDeleteOrder = async (order) => {
    try {
      await dispatch(deleteOrder(order._id));
      dispatch(getAllOrder());
      message.success("Đã hủy đơn hàng thành công!"); // Hiển thị thông báo thành công
    } catch (error) {
      message.error("Lỗi khi hủy đơn hàng!"); // Hiển thị thông báo lỗi
    }
  };

  const handleCompleteOrder = async (order) => {
    try {
      await dispatch(CompletedOrder(order._id)); // Xác nhận đơn hàng hoàn tất
      dispatch(getAllOrder()); // Làm mới danh sách đơn hàng
      message.success("Đã xác nhận giao hàng thành công!"); // Hiển thị thông báo thành công
    } catch (error) {
      message.error("Lỗi khi xác nhận giao hàng!"); // Hiển thị thông báo lỗi
    }
  };

  return (
    <>
      <div style={styles.orderList}>
        <div style={styles.orderItems}>
          {orderItems.map((item) => (
            <div style={styles.orderItem} key={item._id}>
              <span style={styles.img}>
                <img src={item.image} alt={item.name} style={styles.image} />
              </span>
              <span style={styles.qty}>Qty: {item.qty}</span>
              <span style={styles.name}>{item.name}</span>
              <span style={styles.price}>{formatPrice(item.salePrice)}</span>
            </div>
          ))}
        </div>
        <div style={styles.totalPrice}>
          <span>Tổng tiền: {formatPrice(totalPrice)}</span>
        </div>
        <div style={styles.orderInfo}>
          <div style={styles.address}>
            <b>Địa chỉ :</b> {shippingAddress.name}, {shippingAddress.province},{" "}
            {shippingAddress.district}, {shippingAddress.ward},{" "}
            {shippingAddress.detail}, {shippingAddress.phone}
          </div>
        </div>

        {paymentResult ? (
          <div style={styles.paymentCheck}>
            Paid : {formatDateOrderPaypal(paymentResult.update_time)}
          </div>
        ) : (
          ""
        )}

        <div style={styles.orderBottom}>
          {status === "shipping" ? (
            <>
              <div style={styles.orderStatus}>
                <span>
                  Đã xác nhận{" "}
                  {paymentMethod === "payOnline" ? (
                    <span>& Đã thanh toán</span>
                  ) : (
                    ""
                  )}
                </span>
              </div>
              <button
                style={styles.completeOrder}
                onClick={() => handleCompleteOrder(order)}
              >
                Xác nhận giao hàng thành công
              </button>
            </>
          ) : (
            ""
          )}

          <div style={styles.orderButton}>
            {status === "pendding" && cancelOrder === false ? (
              <button
                style={styles.shipping}
                onClick={() => handleShippingOrder(order)}
              >
                Xác nhận đơn hàng
              </button>
            ) : (
              ""
            )}

            {cancelOrder === true ? (
              <>
                <span>Khách yêu cầu hủy đơn</span>
                <button
                  style={styles.cancelOrder}
                  onClick={() => handleDeleteOrder(order)}
                >
                  Hủy đơn
                </button>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Order;

// CSS trực tiếp trong component
const styles = {
  orderList: {
    border: "1px solid #ddd",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "8px",
    textAlign: "left", // Căn tất cả nội dung sang trái
  },
  orderItems: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start", // Căn các item sang trái
    justifyContent: "flex-start",
  },
  orderItem: {
    display: "flex",
    flexDirection: "column",
    marginRight: "20px",
    marginBottom: "20px",
  },
  img: {
    marginBottom: "10px",
  },
  image: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
  },
  qty: {
    fontWeight: "bold",
    marginBottom: "5px",
  },
  name: {
    marginBottom: "5px",
  },
  price: {
    fontWeight: "bold",
    color: "#d70018",
  },
  totalPrice: {
    marginTop: "20px",
    fontWeight: "bold",
  },
  orderInfo: {
    marginTop: "10px",
  },
  address: {
    marginBottom: "10px",
  },
  paymentCheck: {
    marginTop: "10px",
    color: "#28a745",
    fontWeight: "bold",
  },
  orderBottom: {
    marginTop: "20px",
  },
  orderStatus: {
    marginBottom: "10px",
    color: "#28a745",
    fontWeight: "bold",
  },
  orderButton: {
    display: "flex",
    justifyContent: "flex-start", // Căn các nút sang trái
    gap: "10px", // Khoảng cách giữa các nút
  },
  shipping: {
    backgroundColor: "#d70018",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginTop: "10px",
  },
  completeOrder: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginTop: "10px",
  },
  cancelOrder: {
    backgroundColor: "#ffc107",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginTop: "10px",
  },
};
