import { ProductModel } from "../models/ProductModel.js";
import { OrderModel } from "../models/OrderModel.js";
import expressAsyncHandler from "express-async-handler";
import { PinComment } from "../untils/until.js";
import cloudinary from "cloudinary";
import { data } from "../data.js";

export const getAllProduct = expressAsyncHandler(async (req, res) => {
  // await ProductModel.remove()
  // const product = await ProductModel.insertMany(data.products)
  // ProductModel.find()
  //     .then(product => res.send(product))
  //     .catch(err => console.log(err))
  const products = await ProductModel.find({});
  res.send(products);
});

export const findProductById = expressAsyncHandler(async (req, res) => {
  const product = await ProductModel.findById({ _id: req.params.id });

  if (product) {
    res.send(product);
  } else {
    res.send({ message: "product not found" });
  }
});

export const filterProductByType = expressAsyncHandler(async (req, res) => {
  // ProductModel.find({type: req.params.type})
  //     .then(product => res.send(product))
  //     .catch(err => console.log(err))

  const filterProductByType = await ProductModel.find({
    type: req.params.type,
  }).limit(5);
  res.send(filterProductByType);
});

export const filterProductByRandomField = expressAsyncHandler(
  async (req, res) => {
    const products = await ProductModel.find(req.body);
    if (products) {
      res.send(products);
    } else {
      res.send({ message: "product not found" });
    }
  }
);
export const AddProduct = expressAsyncHandler(async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "dev_setups",
  });

  const product = new ProductModel({
    name: req.body.name,
    price: req.body.price,
    salePrice: req.body.salePrice,
    amount: req.body.amount,
    type: req.body.type || "rau củ",
    image: result.secure_url,
    cloudinary_id: result.public_id,
    rating: 0,

    os: req.body.os,
    ram: req.body.ram,
    battery: req.body.battery,
    rom: req.body.rom,
    camera: req.body.camera,
    special: req.body.special,
    design: req.body.design,
    screen: req.body.screen,
  });
  const newProduct = await product.save();

  if (newProduct) {
    return res
      .status(201)
      .send({ message: "New Product Created", data: newProduct });
  } else {
    res.send("error add product");
  }
});

export const UpdateProduct = expressAsyncHandler(async (req, res) => {
  const product = await ProductModel.findById(req.body._id);

  await cloudinary.uploader.destroy(product.cloudinary_id);

  let result;
  if (req.file) {
    result = await cloudinary.uploader.upload(req.file.path);
  }

  if (product) {
    product.name = req.body.name;
    product.amount = req.body.amount;
    product.price = req.body.price;
    product.salePrice = req.body.salePrice;
    product.type = req.body.type;
    product.image = result?.secure_url || product.image;
    product.rating = 0;
    product.cloulinary_id = result?.public_id || product.cloudinary_id;

    product.os = req.body.os;
    product.ram = req.body.ram;
    product.battery = req.body.battery;
    product.rom = req.body.rom;
    product.camera = req.body.camera;
    product.special = req.body.special;
    product.design = req.body.design;
    product.screen = req.body.screen;

    const updateProduct = await product.save();
    if (updateProduct) {
      res.send("update success");
    }
  }

  return res.send("update fail");
});

export const DeleteProduct = expressAsyncHandler(async (req, res) => {
  const deleteProduct = await ProductModel.findById(req.params.id);

  // await cloudinary.uploader.destroy(deleteProduct.cloudinary_id);

  if (deleteProduct) {
    await deleteProduct.remove();
    res.send({ message: "product deleted" });
  } else {
    res.send("error in deletetion");
  }
});

export const SearchProduct = expressAsyncHandler(async (req, res) => {
  const name = req.query.name;

  // Nếu không có tham số 'name', trả về tất cả sản phẩm
  if (!name) {
    const products = await ProductModel.find({});
    return res.send(products);
  }

  // Chuyển chuỗi nhập vào thành không dấu cho việc so sánh
  const nameWithoutDiacritics = removeDiacritics(name);

  // Tìm kiếm sản phẩm bằng cách so sánh chuỗi không dấu
  const products = await ProductModel.find({});

  const filteredProducts = products.filter((product) =>
    removeDiacritics(product.name)
      .toLowerCase()
      .includes(nameWithoutDiacritics.toLowerCase())
  );

  // Trả về danh sách sản phẩm tìm thấy hoặc thông báo không tìm thấy
  filteredProducts.length > 0
    ? res.send(filteredProducts)
    : res.send({ message: "Không tìm thấy sản phẩm" });
});

export const paginationProduct = expressAsyncHandler(async (req, res) => {
  var perPage = 4;
  var page = req.params.page || 1;
  ProductModel.find({})
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec(function (err, products) {
      ProductModel.countDocuments().exec(function (err, count) {
        if (err) return next(err);
        res.send({
          products: products,
          current: page,
          pages: Math.ceil(count / perPage),
        });
      });
    });
});
// Hàm loại bỏ dấu tiếng Việt
const removeDiacritics = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const paginationProductClient = expressAsyncHandler(async (req, res) => {
  const perPage = parseInt(req.query.perPage) || 5; // Lấy perPage từ query hoặc mặc định là 5
  const page = parseInt(req.params.page) || 1; // Lấy page từ params hoặc mặc định là trang 1
  const searchQuery = req.query.search || ""; // Lấy từ khóa tìm kiếm từ query (mặc định là chuỗi rỗng nếu không có)

  try {
    // Loại bỏ dấu tiếng Việt từ từ khóa tìm kiếm
    const searchWithoutDiacritics = removeDiacritics(searchQuery);

    // Tạo regex cho cả chuỗi có dấu và không dấu
    const nameRegex = new RegExp(searchQuery, "i"); // Tìm kiếm với chuỗi gốc (có dấu)
    const nameWithoutDiacriticsRegex = new RegExp(searchWithoutDiacritics, "i"); // Tìm kiếm với chuỗi không dấu

    // Tìm kiếm và phân trang sản phẩm
    const products = await ProductModel.find({
      $or: [
        { name: { $regex: nameRegex } }, // Tìm kiếm theo chuỗi có dấu
        { name: { $regex: nameWithoutDiacriticsRegex } }, // Tìm kiếm theo chuỗi không dấu
      ],
    })
      .skip(perPage * page - perPage) // Bỏ qua các sản phẩm của trang trước
      .limit(perPage); // Lấy số lượng sản phẩm theo perPage

    const count = await ProductModel.countDocuments({
      $or: [
        { name: { $regex: nameRegex } }, // Đếm sản phẩm theo chuỗi có dấu
        { name: { $regex: nameWithoutDiacriticsRegex } }, // Đếm sản phẩm theo chuỗi không dấu
      ],
    });

    res.send({
      products: products,
      currentPage: page,
      totalPages: Math.ceil(count / perPage),
      totalItems: count,
    });
  } catch (err) {
    res.status(500).send({ message: "Error fetching products" });
  }
});

export const RateProduct = expressAsyncHandler(async (req, res) => {
  const { userId } = req.params; // Get userId from request parameters
  const productId = req.params.id; // Get product ID from request parameters
  const product = await ProductModel.findById(productId); // Find product by ID

  if (!product) {
    return res.status(400).send({ message: "Product not found" });
  }

  // Check if the user has purchased this product
  const order = await OrderModel.findOne({
    user: userId,
    orderItems: { $elemMatch: { name: product.name } }, // Check if the order contains the product
  });

  if (!order) {
    return res
      .status(403)
      .send({ message: "Bạn phải mua sản phẩm này để có thể đánh giá." });
  }

  const existsUser = product.reviews.find((x) => x.name === req.body.name);
  if (existsUser) {
    return res.send({ message: "Bạn đã đánh giá sản phẩm này" });
  } else {
    product.reviews.push(req.body);
    const updatedProduct = await product.save();
    return res.send(updatedProduct);
  }
});

export const CommentProduct = expressAsyncHandler(async (req, res) => {
  const product = await ProductModel.findById(req.params.id);
  if (product) {
    product.comments.push(req.body);
    const updateCommentProduct = await product.save();
    res.send(updateCommentProduct);
  } else {
    res.status(400).send({ message: "product not found" });
  }
});

export const RepCommentProduct = expressAsyncHandler(async (req, res) => {
  const product = await ProductModel.findById(req.params.id);
  if (product) {
    const indexComment = product.comments.findIndex(
      (item) => item._id == req.body.idComment
    );
    product.comments[indexComment].replies.push(req.body);

    await product.save();
    res.send(product);
  } else {
    res.status(400).send({ message: "product not found" });
  }
});

export const PinCommentProduct = expressAsyncHandler(async (req, res) => {
  const product = await ProductModel.findById(req.params.id);
  if (product) {
    const indexComment = product.comments.findIndex(
      (item) => item._id == req.body.idComment
    );
    product.comments[indexComment] = req.body;
    PinComment(product.comments, indexComment, 0);

    await product.save();
    res.send(product);
  } else {
    res.status(400).send({ message: "product not found" });
  }
});

export const BlogProduct = expressAsyncHandler(async (req, res) => {
  const product = await ProductModel.findById({ _id: req.params.id });

  if (product) {
    product.blog = req.body.blogContent;
    await product.save();
    res.send(product);
  } else {
    res.send({ message: "product not found" });
  }
});
