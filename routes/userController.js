// Can either connect to database here or in server.js file
// but when we have initDB we should connect on that file

const { Product, Customer, Cart, Order } = require('../model/modelsDB');

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

  // [GET] /user/:slug/:id add to cart view
  add = async (req, res, next) => {
    const { slug } = req.params;
    const { id } = req.params;
    const product = await Product.findById({ _id: id }).lean();
    res.render('addtocart', { product: product, slug });
  };

  // [GET] /cart?user = customerID cart view
  cart = async (req, res, next) => {
    const { user } = req.query;
    // Retrieved data for customer_id from cart collection
    const cartProduct = await Cart.find({ customer_id: user }).lean();
    const numberProduct = cartProduct.length;
    // calculate whole cart price.
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
      total_price: cartPrice.toFixed(2),
    });
  };

  // add product to cart [POST] handle at /user/{{slug}}/cart then redirect to `/user/${slug}`
  addCart = async (req, res, next) => {
    const slug = req.body.customerId;
    const id = req.body.productId;
    const customerQtn = parseFloat(req.body.customerQtn);
    let availableQtn = parseFloat(req.body.availableQtn);
    if (customerQtn > availableQtn) {
      res.render('outofstock', {slug:slug});
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

  // [GET] /cart/:slug/edit?product_id Edit product quantity in cart view
  editCart = async (req, res, next) => {
    const { slug } = req.params;
    const id = req.query.product_id;
    const cartProduct = await Cart.findOne({ customer_id: slug, product_id: id }).lean();
    const product = await Product.findById({ _id: id }).lean();
    const availableQtn = cartProduct.quantity + product.quantity;
    res.render('editcartproduct', { product: cartProduct, slug, availableQtn });
  };

  // Change product quantity in cart [POST] handle
  // at /user/{{slug}}/cart/edit then redirect to `/user/${slug}`
  addCartAfterEdit = async (req, res, next) => {
    const slug = req.body.customerId;
    const id = req.body.productId;
    const customerQtn = parseFloat(req.body.customerQtn);
    let availableQtn = parseFloat(req.body.availableQtn);
    if (customerQtn > availableQtn) {
      res.render('outofstock', {slug:slug});
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
        productInCart.quantity = customerQtn;
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
      res.redirect(`/cart?user=${slug}`);
    }
  };

  // [GET] /cart/:slug/remove?product_id=(product id of cart) Edit product quantity in cart view
  removeItemInCart = async (req, res, next) => {
    const { slug } = req.params;
    const id = req.query.product_id;
    const cartProduct = await Cart.findById(id).lean();
    if (!cartProduct) {
      res.render('404', { slug });
    } else {
      // const product = await Product.findById({ _id: id }).lean();
      // const availableQtn = cartProduct.quantity + product.quantity;
      res.render('removeitemincart', { product: cartProduct, slug });
    }
  };

  // Remove product in cart [POST] handle
  // at /user/{{slug}}/cart/remove then redirect to `/user/${slug}`
  removeItem = async (req, res, next) => {
    const { slug } = req.params;
    const productCartId = req.body.cartProductId;
    const productQtnCart = parseFloat(req.body.customerQtn);
    const productStockId = req.body.productId;
    const productDetail = await Product.findById({ _id: productStockId });
    if (productDetail) {
      productDetail.quantity += productQtnCart;
      await productDetail.save();
    }
    // check if product already inside the Cart collection with same customer_id, update Quantity
    // const productDelete = await Cart.findById(id);
    // if (!productDelete) { // This when product is not in Cart collection
    //   res.render('404', { slug });
    // } else {
    //   await productDelete.remove();
    // res.redirect(`/cart?user=${slug}`);
    // }
    // Mongoose version 7x, remove() has been removed
    // Delete the product from the Cart collection
    // deleteOne is delete first document, use deleteMany for delete all results
    const deleteResult = await Cart.deleteOne({ _id: productCartId, customer_id: slug });
    if (deleteResult.deletedCount === 0) {
      res.render('404', { slug }); // Product not found in the cart
    } else {
      res.redirect(`/cart?user=${slug}`);
    }
  };

  // [GET] /checkout?user={{slug}} for checkout view and insert data into Order
  checkOut = async(req, res, next) => {
    const slug = req.query.user;
    const productInCart = await Cart.find({ customer_id: slug });
    const orderProducts = [];
    productInCart.forEach((product) => {
      const { productName, quantity, image } = product;
      // const productName = product.productName;
      // const quantity = product.quantity;
      // const image = product.image;
      // ---create object--
      // const orderProduct = {
      //   productName: productName,
      //   quantity: quantity,
      //   image: image
      // };
      // orderProducts.push(orderProduct);
      // ---Use shorthand because the variable names match property names
      orderProducts.push({
        productName,
        quantity,
        image,
      });
    });
    // create a new order in the Order collection
    const order = new Order({
      customer_id: slug,
      products: orderProducts,
    });
    await order.save();
    await Cart.deleteMany({ customer_id: slug });
    res.render('ordersuccess', { slug });
  };
}

module.exports = new UserController();
