import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { filterProductByPrice } from "../../actions/ProductAction";
import { formatPrice } from "../../untils/index";
import FilterMenu from "./FilterMenu/FilterMenu";
import { message } from "antd";

function FilterProduct(props) {
  const dispatch = useDispatch();
  const [startPrice, setStartPrice] = useState(0);
  const [endPrice, setEndPrice] = useState(0);

  // Hàm này sẽ được gọi khi người dùng nhấn nút Tìm
  const FilterProductByPrice = () => {
    const start = parseInt(startPrice);
    const end = parseInt(endPrice);
    console.log(start, end);
    if (isNaN(start) || isNaN(end) || start > end) {
      // Thêm kiểm tra nếu cần
      message.warning("Giá trị không hợp lệ");
      return;
    }

    dispatch(filterProductByPrice(start, end));
  };

  return (
    <div className="filter">
      <FilterMenu></FilterMenu>

      <div className="options-price">
        <input
          type="number"
          id="priceStart"
          placeholder="đ TỪ"
          value={startPrice}
          onChange={(e) => setStartPrice(e.target.value)}
        />
        <input
          type="number"
          id="priceEnd"
          placeholder="đ ĐẾN"
          value={endPrice}
          onChange={(e) => setEndPrice(e.target.value)}
        />
        <button onClick={FilterProductByPrice}>Tìm</button>
      </div>
    </div>
  );
}

export default FilterProduct;
