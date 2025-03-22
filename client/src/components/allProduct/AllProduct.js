import React, { useEffect, useState } from "react";
import ListProduct from "./ListProduct";
import "./Sale.css";
import { handlePercentDiscount } from "../../untils/index";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct } from "../../actions/ProductAction";
import FilterProduct from "./FilterProduct";
import SortByPrice from "./SortByPrice/SortByPrice";

function AllProduct(props) {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.allProduct.product);
  const filteredProducts = useSelector(
    (state) => state.allProduct.filteredProducts
  ); // Lấy danh sách đã lọc từ Redux store

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10); // Số lượng sản phẩm trên mỗi trang

  // Lấy danh sách sản phẩm khi component được mount
  useEffect(() => {
    dispatch(getAllProduct());
    return () => {
      return [];
    };
  }, [dispatch]);

  // Chọn danh sách sản phẩm để hiển thị (lọc nếu có, nếu không thì hiển thị tất cả)
  const displayProducts =
    filteredProducts.length > 0 ? filteredProducts : product;

  // Tính toán số lượng sản phẩm và trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = displayProducts?.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  ); // Cắt sản phẩm theo trang

  const totalPages = Math.ceil(displayProducts?.length / productsPerPage); // Tổng số trang

  // Hàm để chuyển đến trang trước
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Hàm để chuyển đến trang sau
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Hàm render phân trang với số trang
  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination" style={paginationStyle}>
        <button
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
          style={buttonStyle}
        >
          Trước
        </button>
        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            style={currentPage === num ? activePageStyle : buttonStyle}
          >
            {num}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
          style={buttonStyle}
        >
          Tiếp
        </button>
      </div>
    );
  };

  return (
    <section id="hotsale iphone">
      <div className="hotsale">
        <FilterProduct />
        <SortByPrice />

        {currentProducts && currentProducts.length > 0 ? (
          <>
            <ListProduct
              HotSaleProducts={handlePercentDiscount(currentProducts)}
            />
            {renderPagination()}
          </>
        ) : (
          <span>Không có sản phẩm</span>
        )}
      </div>
    </section>
  );
}

export default AllProduct;

// CSS trực tiếp trong component
const paginationStyle = {
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  marginTop: "20px",
  padding: "10px 0",
  flexWrap: "wrap" // Đổi từ 'flex-wrap' thành 'flexWrap'
};



const buttonStyle = {
  backgroundColor: "#d70018", // Màu đỏ
  color: "white",
  border: "none",
  padding: "10px 15px",
  margin: "0 5px",
  fontSize: "16px",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  borderRadius: "5px",
};

const activePageStyle = {
  ...buttonStyle,
  backgroundColor: "#fff", // Màu nền trắng khi active
  color: "#d70018", // Màu chữ đỏ khi active
  border: "2px solid #d70018", // Đường viền đỏ khi active
};
