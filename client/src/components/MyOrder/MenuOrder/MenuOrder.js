import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrderPenddingByUser,
  getOrderShippingByUser,
  getOrderPaidByUser, // Import getOrderPaidByUser
} from "../../../actions/OrderAction";

function MenuOrder(props) {
  const dispatch = useDispatch();
  const location = useLocation();

  const { userInfo } = useSelector((state) => state.userSignin);
  const { myOrdersPendding, myOrdersShipping, myOrdersPaid } = useSelector(
    (state) => state.orderByUser
  );

  useEffect(() => {
    const getAllOrderPenddingShippingAndPaidByUser = async () => {
      await dispatch(getOrderPenddingByUser(userInfo._id));
      await dispatch(getOrderShippingByUser(userInfo._id));
      dispatch(getOrderPaidByUser(userInfo._id)); // Fetch "Đã giao" orders
    };

    getAllOrderPenddingShippingAndPaidByUser();
  }, [dispatch, userInfo._id]);

  return (
    <div className="myorder-menu">
      <div
        className={
          location.pathname === "/myOrder"
            ? "myorder-menu-item active"
            : "myorder-menu-item"
        }
      >
        <Link to={"/myOrder"}>Tất cả</Link>
      </div>
      <div
        className={
          location.pathname === "/myOrder/pendding"
            ? "myorder-menu-item active"
            : "myorder-menu-item"
        }
      >
        <Link to="/myOrder/pendding">Chờ xử lí</Link>
        {myOrdersPendding ? (
          <div className="myorder-menu-item-newPendding">
            {myOrdersPendding.length}
          </div>
        ) : (
          ""
        )}
      </div>
      <div
        className={
          location.pathname === "/myOrder/shipping"
            ? "myorder-menu-item active"
            : "myorder-menu-item"
        }
      >
        <Link to="/myOrder/shipping">Đang giao</Link>
        {myOrdersShipping ? (
          <div className="myorder-menu-item-newShipping">
            {myOrdersShipping.length}
          </div>
        ) : (
          ""
        )}
      </div>
      <div
        className={
          location.pathname === "/myOrder/paid"
            ? "myorder-menu-item active"
            : "myorder-menu-item"
        }
      >
        <Link to="/myOrder/paid">Đã giao</Link>
        {myOrdersPaid ? (
          <div className="myorder-menu-item-newShipping">
            {myOrdersPaid.length}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default MenuOrder;
