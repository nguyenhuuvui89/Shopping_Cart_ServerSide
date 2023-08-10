const { Product, Customer, Cart, Order } = require('../model/modelsDB');

class AdminController {
  // [GET]/admin
  displayProducts = async (req, res, next) => {
    const products = await Product.find({}).lean();
    res.render('./admin/adminInterface', { data: products });
  };

  // [POST]/admin search products by name.
  searchProduct = async (req, res, next) => {
    const productSearch = req.body.search;
    // matching upper lower case
    const product = new RegExp(productSearch, 'i');
    const products = await Product.find({ productName: product }).lean();
    res.render('./admin/adminInterface', { data: products, productSearch });
  };
}

module.exports = new AdminController();
