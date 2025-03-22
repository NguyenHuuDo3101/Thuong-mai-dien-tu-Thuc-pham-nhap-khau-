import React, { useEffect, useState } from "react";
import {
  BellOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  DollarCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { DatePicker, Button } from "antd"; // Import DatePicker và Button từ antd
import "./DashBoard.css";
import ChartDashBoard from "./ChartDashBoard";
import axios from "axios";
import { formatPrice } from "../../../../untils";

const { RangePicker } = DatePicker; // Khai báo RangePicker

export default function DashBoard() {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    products: 0,
    totalPrice: 0,
  });
  const [dates, setDates] = useState([null, null]); // State để lưu ngày chọn
  const [revenueData, setRevenueData] = useState([]); // State để lưu doanh thu theo ngày

  // Gọi API để lấy số lượng user, order, product
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/counts`
        );
        setStats({
          users: data.users,
          orders: data.orders,
          products: data.products,
          totalPrice: data.totalPrice,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  // Hàm để gọi API tính doanh thu theo khoảng thời gian
  const fetchRevenueByDate = async (dates) => {
    if (dates[0] && dates[1]) {
      const startDate = dates[0].format("YYYY-MM-DD");
      const endDate = dates[1].format("YYYY-MM-DD");
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/counts/revenue?startDate=${startDate}&endDate=${endDate}`
        );
        // Cập nhật doanh thu trả về vào state
        setRevenueData(data); // Dữ liệu trả về là doanh thu theo ngày
      } catch (error) {
        console.error("Error fetching revenue:", error);
      }
    }
  };

  const styles = {
    dashboard: {
      padding: "20px",
      backgroundColor: "#f8f9fa",
    },
    topSection: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    searchForm: {
      display: "flex",
      alignItems: "center",
    },
    searchInput: {
      padding: "5px",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    content: {
      display: "flex",
      alignItems: "center",
    },
    avatarImg: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
    },
    middleSection: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "20px",
      marginBottom: "20px",
    },
    statContent: {
      backgroundColor: "white",
      padding: "15px",
      borderRadius: "10px",
      textAlign: "center",
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    },
    statIcon: {
      fontSize: "30px",
      marginBottom: "10px",
    },
    statTotal: {
      fontSize: "24px",
      fontWeight: "bold",
    },
    datePickerSection: {
      marginTop: "20px",
      display: "flex",
      justifyContent: "flex-start",
      gap: "10px",
    },
    responsive: {
      '@media (max-width: 768px)': {
        middleSection: {
          gridTemplateColumns: 'repeat(2, 1fr)',
        }
      },
      '@media (max-width: 576px)': {
        middleSection: {
          gridTemplateColumns: '1fr',
        }
      }
    }
  };

  return (
    <section id="dashboard" style={styles.dashboard}>
      <div style={styles.topSection}>
        <div style={styles.searchForm}>
          <form>
            <input placeholder="Search ..." style={styles.searchInput} />
            <span>
              <SearchOutlined />
            </span>
          </form>
        </div>
        <div style={styles.content}>
          <li className="dashboard-top-content-avatar">
            <img
              src="https://res.cloudinary.com/caokhahieu/image/upload/v1626334932/gediogbkwlg85kbbsamq.jpg"
              alt="avatar"
              style={styles.avatarImg}
            />
            <span>Nông sản Việt</span>
          </li>
          <li className="dashboard-top-content-bell">
            <BellOutlined />
          </li>
        </div>
      </div>

      <div style={{ ...styles.middleSection, ...styles.responsive.middleSection }}>
        <div style={styles.statContent}>
          <li>
            <div style={styles.statIcon}>
              <ShoppingOutlined />
            </div>
            <div>
              <span style={styles.statTotal}>{stats.products}</span>
              <span>Sản phẩm</span>
            </div>
          </li>
        </div>
        <div style={styles.statContent}>
          <li>
            <div style={styles.statIcon}>
              <ShoppingCartOutlined />
            </div>
            <div>
              <span style={styles.statTotal}>{stats.orders}</span>
              <span>Đơn hàng</span>
            </div>
          </li>
        </div>
        <div style={styles.statContent}>
          <li>
            <div style={styles.statIcon}>
              <DollarCircleOutlined />
            </div>
            <div>
              <span style={styles.statTotal}>{formatPrice(stats.totalPrice)}đ</span>
              <span>Doanh thu</span>
            </div>
          </li>
        </div>
        <div style={styles.statContent}>
          <li>
            <div style={styles.statIcon}>
              <FileTextOutlined />
            </div>
            <div>
              <span style={styles.statTotal}>{stats.users}</span>
              <span>Khách hàng</span>
            </div>
          </li>
        </div>
      </div>

      <ChartDashBoard revenueData={revenueData} /> {/* Truyền revenueData vào ChartDashBoard */}

      <div style={styles.datePickerSection}>
        <RangePicker
          onChange={(dates) => setDates(dates)}
          format="YYYY-MM-DD"
        />
        <Button type="primary" onClick={() => fetchRevenueByDate(dates)}>
          Xem Doanh Thu
        </Button>
      </div>
    </section>
  );
}
