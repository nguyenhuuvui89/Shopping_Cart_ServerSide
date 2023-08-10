const express = require('express');

const router = express.Router();
const UserController = require('./userController');
const homeView = require('./homeView');

// HomeView
router.get('/', homeView.home);
router.post('/', homeView.userDisplay);

// admin interface
router.get('/admin', (req, res) => {
  res.render('adminInterface');
});

// user interface
// Click into Shopping Cart;

router.get('/user/:slug', UserController.displayProducts);
router.post('/user/:slug', UserController.search);

// Handle Post for addtocart (handle data at /user/:slug/cart) and action="/user/{{slug}}/cart"
router.post('/user/:slug/cart', UserController.addCart);

// add item view
router.get('/user/:slug/:id', UserController.add);

// cart view /cart?user=
router.get('/cart', UserController.cart);
// edit item quantity in cart view '/cart/:slug/edit?product_id='
router.get('/cart/:slug/edit', UserController.editCart);

// remove item in cart view '/cart/:slug/remove?product_id='
router.get('/cart/:slug/remove', UserController.removeItemInCart);

// // Handle Post for edit quantity item in cart
// (handle data at /user/:slug/cart/edit) and action="/user/{{slug}}/cart/edit"
router.post('/user/:slug/cart/edit', UserController.addCartAfterEdit);
router.post('/user/:slug/cart/remove', UserController.removeItem);

// [GET] user/checkout?user={{slug}} for checkout view and insert data into Order
router.get('/checkout', UserController.checkOut);

module.exports = router;
