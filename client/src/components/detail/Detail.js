import React, { useEffect } from "react";
import "./Detail.css";
import DetailInfo from "./DetailInfo";
import RateStar from "./RateStar";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct, getproductById } from "../../actions/ProductAction";
import CommentProduct from "./CommentProduct";
import BlogContent from "./BlogContent";
import Slider from "react-slick"; // Import thư viện react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Import các icon
import { formatPrice } from "../../untils";
function Detail(props) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const detailProduct = useSelector((state) => state.getProductById.product);
  const product = useSelector((state) => state.allProduct.product);

  // Lấy danh sách sản phẩm khi component được mount
  useEffect(() => {
    dispatch(getAllProduct());
    return () => {
      return [];
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(getproductById(id));
  }, [dispatch, id]);

  // Lọc ra các sản phẩm tương tự (cùng loại nhưng không trùng id)
  const relatedProducts = product
    .filter(
      (p) => p.type === detailProduct?.type && p._id !== detailProduct?._id
    )
    .slice(0, 10); // Hiển thị tối đa 10 sản phẩm

  // Custom arrow component cho slider
  // Custom arrow component cho slider
  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        className="slick-arrow slick-next"
        onClick={onClick}
        style={styles.arrow}
      >
        <FaArrowRight size={30} />
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        className="slick-arrow slick-prev"
        onClick={onClick}
        style={styles.arrow}
      >
        <FaArrowLeft size={30} />
      </div>
    );
  };

  // Cấu hình cho Slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Hiển thị 4 sản phẩm cùng lúc
    slidesToScroll: 1, // Cuộn 1 sản phẩm mỗi lần
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section id="detail">
      {detailProduct ? (
        <div className="detail">
          <div className="detail-title">
            <h2>{detailProduct.name}</h2>
          </div>
          <div className="detail-info">
            <div className="detail-info-slide">
              <div className="detail-info-slide-image">
                <img src={detailProduct.image} alt={detailProduct.name} />
              </div>
            </div>
            <DetailInfo product={detailProduct} />
          </div>
          <div>
            <BlogContent />
          </div>
          <div>
            <RateStar />
          </div>
          <div>
            <CommentProduct />
          </div>

          {/* Hiển thị sản phẩm tương tự */}
          <div className="related-products">
            <h3>Sản phẩm tương tự</h3>
            <Slider {...settings}>
              {relatedProducts.map((product) => (
                <div
                  key={product._id}
                  className="related-product-item"
                  style={styles.relatedProductItem}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={styles.relatedProductImage}
                  />
                  <p style={styles.relatedProductName}>
                    <a style={styles.relatedProductName} href={"/detail/" + product._id}>{product.name}</a>
                  </p>
                  <p style={styles.relatedProductPrice}>{formatPrice(product.price)}đ</p>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      ) : (
        ""
      )}
    </section>
  );
}

export default Detail;

// CSS trực tiếp trong component hoặc thêm vào file Detail.css
const styles = {
  relatedProducts: {
    marginTop: "30px",
  },
  relatedProductItem: {
    width: "250px", // Kích thước cố định cho item
    height: "350px", // Kích thước cố định cho item
    padding: "15px",
    textAlign: "center",
    backgroundColor: "#fff",
    transition: "transform 0.3s ease",
    cursor: "pointer",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginRight: "15px",
  },
  relatedProductImage: {
    width: "100%",
    height: "300px", // Kích thước cố định cho ảnh
    objectFit: "cover", // Đảm bảo ảnh luôn vừa khung
    marginBottom: "10px",
    borderRadius: "18px",
  },
  relatedProductName: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  relatedProductPrice: {
    fontSize: "14px",
    color: "#d70018",
  },
  arrow: {
    zIndex: 999,
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#000",
  },
};
