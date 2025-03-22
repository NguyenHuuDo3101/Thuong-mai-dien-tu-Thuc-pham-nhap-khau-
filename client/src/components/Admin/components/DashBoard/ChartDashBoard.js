import React from "react";
import { Bar } from "react-chartjs-2"; // Sử dụng Bar chart từ Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartDashBoard = ({ revenueData }) => {
  // Chuyển đổi dữ liệu cho biểu đồ
  const labels = revenueData.map((item) => item._id); // Ngày
  const data = revenueData.map((item) => item.totalRevenue); // Doanh thu

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Doanh thu theo ngày",
        data: data,
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Màu sắc cho biểu đồ
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Bỏ tỷ lệ khung hình mặc định
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Doanh thu theo ngày",
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "400px" }}>
      {" "}
      {/* Điều chỉnh chiều cao và chiều rộng */}
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ChartDashBoard;
