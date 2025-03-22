import React, { useState } from "react";
import { useSelector } from "react-redux";
import { updateUserProfile } from "../../services/userService"; // Import service API
import Header from "../header/Header";
import { message } from "antd"; // Import message từ Ant Design

message.config({
  top: 100, // Khoảng cách từ đầu trang
  duration: 2, // Thời gian hiển thị thông báo (tùy chọn)
  maxCount: 3, // Số lượng thông báo hiển thị tối đa cùng lúc (tùy chọn)
  zIndex: 9999, // zIndex cao hơn để xuất hiện phía trên các thành phần khác
});
function Profile() {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const [name, setName] = useState(userInfo.name || "");
  const [email, setEmail] = useState(userInfo.email || "");
  const [phone, setPhone] = useState(userInfo.phone || "");
  const [address, setAddress] = useState(userInfo.address || "");

  // Xử lý việc submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUserInfo = await updateUserProfile({
        name,
        email,
        phone,
        address,
      });
      message.success("Cập nhật thông tin thành công!"); // Hiển thị thông báo thành công
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo)); // Cập nhật thông tin trong localStorage
    } catch (error) {
      message.error(error.message); // Hiển thị thông báo lỗi nếu có lỗi
    }
  };

  return (
    <>
      <Header /> {/* Thêm header vào */}
      <div style={styles.profileContainer}>
        <h2 style={styles.userName}>Cập nhật thông tin cá nhân</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="name">Tên</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="email">Địa chỉ Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="address">Địa chỉ</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Lưu lại
          </button>
        </form>
      </div>
    </>
  );
}

export default Profile;

// CSS trực tiếp trong component
const styles = {
  profileContainer: {
    maxWidth: "600px",
    margin: "auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  userName: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#d70018",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "20px",
  },
};
