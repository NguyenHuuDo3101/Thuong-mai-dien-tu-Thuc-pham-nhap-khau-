import React, { useEffect, useState } from "react";
import "./Carousel.css";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SampleNextArrow(props) {
  const { className, onClick } = props;
  return (
    <div
      className={`${className}`}
      style={{ display: 'block' }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, onClick } = props;
  return (
    <div
      className={`${className}`}
      style={{ display: 'block' }}
      onClick={onClick}
    />
  );
}

function Carousel(props) {
  let { slider, slider1, slider2 } = props;
  const [nav, setNav] = useState({ nav1: null, nav2: null });

  useEffect(() => {
    setNav({
      nav1: slider1,
      nav2: slider2
    });
  }, [slider1, slider2]);

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2500,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const next = () => {
    slider1.slickNext();
  };
  const previous = () => {
    slider2.slickPrev();
  };

  return (
    <section id="carousel">
      <div className="carousel">
        <div className="carousel-left">
          <div className="carousel-left-slide">
            <Slider asNavFor={nav.nav2}
              ref={slider => (slider1 = slider)}
              {...settings} >
              <div key={1}>
                <img src="https://cdn.chonongsanonline.com/uploads/all/2NFPksxLnwIE8XU6Y8ZwhQtRw9UMszOSkYe32Mxa.png" alt="Hình 1"></img>
              </div>
              <div key={2}>
                <img src="https://theme.hstatic.net/1000324420/1000664192/14/banner1.jpg?v=52" alt="Hình 2"></img>
              </div>
              <div key={3}>
                <img src="https://theme.hstatic.net/200000281397/1000675334/14/slider_1.jpg?v=77" alt="Hình 3"></img>
              </div>
              <div key={4}>
                <img src="https://cdn.chonongsanonline.com/uploads/all/v8CeniFCjguPwqYxxXJKsp8lVmINLEldpy9h78ft.jpg" alt="Hình 4"></img>
              </div>
              <div key={5}>
                <img src="https://file.hstatic.net/1000301274/file/z3400696818926_212c03e20ce3f328cbda1429f574658e_e8a1fa849f1a49adb5c7b05e3f05ff29_grande.jpg" alt="Hình 5"></img>
              </div>
            </Slider>
            <div className="carousel-left-move">
              <div className="prev" onClick={() => previous()}>
                <LeftOutlined />
              </div>
              <div className="next" onClick={() => next()}>
                <RightOutlined />
              </div>
            </div>
          </div>
          <div className="carousel-left-bottom">
            <Slider asNavFor={nav.nav1}
              ref={slider => (slider2 = slider)}
              slidesToShow={4}
              swipeToSlide={true}
              focusOnSelect={true}
            >
              <div>
                ƯU ĐÃI NÔNG SẢN <br></br> Sản phẩm nhập khẩu tươi ngon
              </div>
              <div>
                TRÁI CÂY NHẬP KHẨU <br></br> Giảm giá sốc mùa thu hoạch
              </div>
              <div>
                RAU CỦ SẠCH <br></br> Giá tốt mỗi ngày
              </div>
              <div>
                GẠO HỮU CƠ CAO CẤP <br></br> Ưu đãi đặc biệt
              </div>
              <div>
                THỊT HEO TƯƠI NGON <br></br> Khuyến mãi trong tuần
              </div>
            </Slider>
          </div>
        </div>

        <div className="carousel-right">
          <div className="carousel-right-item">
            <img src="https://theme.hstatic.net/200000301988/1001000771/14/slideShow_f1_2.png?v=121" alt="Hình quảng cáo"></img>
          </div>
          <div className="carousel-right-item">
            <img src="https://theme.hstatic.net/200000301988/1001000771/14/slideShow_f1_3.png?v=121" alt="Hình quảng cáo"></img>
          </div>
          <div className="carousel-right-item">
            <img src="https://theme.hstatic.net/200000301988/1001000771/14/slideShow_f1_1.png?v=121" alt="Hình quảng cáo"></img>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Carousel;
