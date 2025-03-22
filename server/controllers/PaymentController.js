import { OrderModel } from "../models/OrderModel.js";
import expressAsyncHandler from "express-async-handler";
import dotenv from "dotenv";

import querystring from "qs";
import sha256 from "sha256";
import dateFormat from "dateformat";
import crypto from 'crypto'

import {
  VNPay,
  ProductCode,
} from 'vnpay';

const tmnCode = process.env.VNP_TMN_CODE;
const secretKey = process.env.VNP_HASH_SECRET;
const url = process.env.VNP_URL;
const returnUrl = process.env.VNP_RETURN_URL;

const vnpay = new VNPay({
  secureSecret: process.env.VNP_HASH_SECRET,
  tmnCode: process.env.VNP_TMN_CODE,
});

export const createPayment = expressAsyncHandler(async (req, res) => {
  const order = new OrderModel({
    order_code: "",
    to_ward_code: req.body.to_ward_code,
    to_district_id: req.body.to_district_id,
    cancelOrder: false,

    orderItems: req.body.orderItems,
    shippingAddress: {
      province: req.body.shippingAddress?.province || '',
      district: req.body.shippingAddress?.district || '',
      ward: req.body.shippingAddress?.ward || '',
      detail: req.body.shippingAddress?.more || '',
      name: req.body.shippingAddress?.name || '',
      phone: req.body.shippingAddress?.phone || '',
    },
    paymentMethod: req.body.paymentMethod,
    paymentResult: req.body.paymentResult
      ? {
        id: req.body.paymentResult.id,
        status: req.body.paymentResult.status,
        update_time: req.body.paymentResult.update_time,
        email_address: req.body.paymentResult.payer.email_address,
      }
      : "",
    totalPrice: req.body.totalPrice,
    status: req.body.status ? req.body.status : "pendding",
    name: req.body.name,
    user: req.body.user,
  });

  const bankList = await vnpay.getBankList();
  const productTypeList = Object.entries(ProductCode).map(([key, value]) => ({ key, value }));
  const contentPaymentDefault = `Thanh toan don hang ${new Date().toISOString()}`;

  const { amountInput, contentPayment, productTypeSelect, bankSelect, langSelect } = req.body;

  const data = {
    vnp_Amount: order.totalPrice,
    vnp_IpAddr:
      '127.0.0.1',
    vnp_OrderInfo: "contentPayment",
    vnp_ReturnUrl: process.env.VNPAY_RETURN_URL ?? 'http://localhost:3000',
    vnp_TxnRef: new Date().getTime().toString(),
    vnp_BankCode: bankSelect ?? undefined,
    vnp_Locale: "vn",
    vnp_OrderType: "bill",
  };
  const url = vnpay.buildPaymentUrl(data);
  res.status(200).json({ url });
  order.save();
});

export const returnPayment = expressAsyncHandler(async (req, res) => {
  console.log('returnPayment')
  try {
    let vnp_Params = req.query;
    const secureHash = vnp_Params.vnp_SecureHash;

    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    vnp_Params = sortObject(vnp_Params);
    const signData =
      secretKey + querystring.stringify(vnp_Params, { encode: false });

    // new code
    // var signData = querystring.stringify(vnp_Params, { encode: false });
    // var hmac = crypto.createHmac("sha512", secretKey);
    // var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    //end

    const checkSum = sha256(signData);

    const id = vnp_Params.vnp_TxnRef;

    // res.status(200).json({ code: vnp_Params.vnp_ResponseCode });
    if (secureHash === checkSum) {
      console.log('if 1')
      if (vnp_Params.vnp_ResponseCode == "00") {
        console.log('if 2')
        res.status(200).json({ code: vnp_Params.vnp_ResponseCode });
      } else {
        const DeleteOrder = await OrderModel.findById({ _id: id });
        await DeleteOrder.remove();
        res.status(200).json({ code: vnp_Params.vnp_ResponseCode });
      }
    } else {
      console.log('else')
      res.status(200).json({ code: "97" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const inpPayment = async (req, res) => {
  console.log('inpPayment')
  let vnp_Params = req.query;
  const secureHash = vnp_Params.vnp_SecureHash;

  delete vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHashType;

  vnp_Params = sortObject(vnp_Params);

  const signData =
    secretKey + querystring.stringify(vnp_Params, { encode: false });

  const checkSum = sha256(signData);

  const id = vnp_Params.vnp_TxnRef;

  if (secureHash === checkSum) {
    var orderId = vnp_Params["vnp_TxnRef"];
    var rspCode = vnp_Params["vnp_ResponseCode"];
    //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
    res.status(200).json({ RspCode: "00", Message: "success" });
  } else {
    res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
  }
};

function sortObject(o) {
  var sorted = {},
    key,
    a = [];

  for (key in o) {
    if (o.hasOwnProperty(key)) {
      a.push(key);
    }
  }

  a.sort();

  for (key = 0; key < a.length; key++) {
    sorted[a[key]] = o[a[key]];
  }
  return sorted;
}