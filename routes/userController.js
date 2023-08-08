// Can either connect to database here or in server.js file
// but when we have initDB we should connect on that file

const { Product, Customer, Cart } = require('../model/modelsDB');

class UserController {
  // [GET]/user and /user/:slug
  displayProducts = async (req, res, next) => {
    const id = req.params.slug;
    const products = await Product.find({}).lean();
    // when using direct products data from json, handlebar will denied, 
    // so need to add lean() to get access
    res.render('userInterface', { data: products, id });
  };

  // [POST]/user/:slug search products by name.
  search = async (req, res, next) => {
    const id = req.params.slug;
    const product = req.body.search;
    const productSearch = new RegExp(product, 'i');
    const products = await Product.find({ productName: productSearch }).lean();
    res.render('userInterface', { data: products, id });
  };

  // [GET] /user/:slug/:id
  add = async (req, res, next) => {
    const { slug } = req.params;
    const { id } = req.params;
    const product = await Product.findById({ _id: id }).lean();
    res.render('addtocart', { product: product, slug });
  };

  // [GET] /cart?user = customerID
  cart = async (req, res, next) => {
    const { user } = req.query;
    // Retrieved data for customer_id from cart collection
    const cartProduct = await Cart.find({ customer_id: user }).lean();
    const numberProduct = cartProduct.length;
    let cartPrice = 0;
    cartProduct.forEach((product) => {
      const productQtn = product.quantity;
      const { price } = product;
      const totalProductPrice = productQtn * price;
      cartPrice += totalProductPrice;
    });
    // Can use Reduce to solve
    // const totalPrice = cartProduct.reduce((accumulator, product) => {
    //   const productQtn = product.quantity;
    //   const { price } = product;
    //   const totalProductPrice = productQtn * price;
    //   return accumulator + totalProductPrice;
    // }, 0)
    res.render('cart', {
      data: cartProduct,
      numberProduct,
      slug: user,
      total_price: cartPrice,
    });
  };

  // [POST] handle at /user/{{slug}}/cart then redirect to `/user/${slug}`
  addCart = async (req, res, next) => {
    const slug = req.body.customerId;
    const id = req.body.productId;
    const customerQtn = parseFloat(req.body.customerQtn);
    let availableQtn = parseFloat(req.body.availableQtn);
    if (customerQtn > availableQtn) {
      res.render('outofstock');
    } else {
      availableQtn -= customerQtn;
      const product = await Product.findById({ _id: id });
      if (availableQtn >= 0) {
        product.quantity = availableQtn;
        await product.save();
      } else {
        product.quantity = 0;
        await product.save();
      }
      // check if product already inside the Cart collection with same customer_id, update Quantity
      const productInCart = await Cart.findOne({ product_id: id, customer_id: slug });
      if (productInCart) {
        productInCart.quantity += customerQtn;
        await productInCart.save();
      } else { // This when product is not in Cart collection
        const productAdd = new Cart({
          product_id: id,
          customer_id: slug,
          productName: product.productName,
          price: product.price,
          quantity: customerQtn,
          image: product.image,
        });
        await productAdd.save();
      }
      res.redirect(`/user/${slug}`);
    }
  };
}

module.exports = new UserController();
