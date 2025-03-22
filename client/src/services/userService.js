import axios from "axios";

// Service để gọi API cập nhật thông tin người dùng
export const updateUserProfile = async (userData) => {
  try {
    // Lấy token từ localStorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = userInfo?.token; // Kiểm tra xem có token hay không

    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    // Gọi API với token và dữ liệu cập nhật, sử dụng URL từ env
    const { data } = await axios.put(
      `${process.env.REACT_APP_API_URL}/user/profile`, // Sử dụng biến môi trường cho URL API
      userData,
      config
    );
    return data;
  } catch (error) {
    throw new Error(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    );
  }
};
