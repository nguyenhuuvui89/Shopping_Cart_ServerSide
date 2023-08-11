const { Product, Customer, Cart, Order } = require('../model/modelsDB');

class AdminController {
  // [GET]/admin
  displayProducts = async (req, res, next) => {
    const products = await Product.find({}).lean();
    const numberResults = products.length;
    res.render('./admin/adminInterface', { data: products, numberResults });
  };

  // [POST]/admin/search products by name.
  searchProduct = async (req, res, next) => {
    const productSearch = req.body.search;
    // matching upper lower case
    const product = new RegExp(productSearch, 'i');
    const products = await Product.find({ productName: product }).lean();
    const numberResults = products.length;
    res.render('./admin/adminInterface', { data: products, product, numberResults });
  };

  // [POST] /admin handle delete product
  deleteProduct = async (req, res, next ) => {
    const { productId } = req.body;
    const products = await Product.find({ _id: productId });
    // Check if product in the order
    if (products.length !== 0) {
      res.render('./admin/nodelete');
    } else {
      await Product.deleteOne({ _id: productId });
      res.redirect('/admin');
    }
  };

  // Handle [GET] /admin/update?product=
  // (already have link in handlebars
  // <a href="/admin/update?product={{this._id}}" class="btn btn-warning" >Update</a>)
  updateProductView = async (req, res, next ) => {
    const productId = req.query.product;
    const product = await Product.findById({ _id: productId }).lean();
    res.render('./admin/updateproduct', { data: product });
  };

  // Handle [POST] /admin/update?product=
  updateProduct = async (req, res, next) => {
    const { productId } = req.body;
    const { productName } = req.body;
    const { description } = req.body;
    const { price } = req.body;
    const { quantity } = req.body;
    const product = await Product.findById({ _id: productId });
    if (!product) {
      res.render('error');
    } else {
      product.productName = productName;
      product.description = description;
      product.price = price;
      product.quantity = quantity;
      await product.save();
      res.redirect('./admin');
    }
  };
}

module.exports = new AdminController();
