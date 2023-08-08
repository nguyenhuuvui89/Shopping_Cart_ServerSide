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

module.exports = router;
