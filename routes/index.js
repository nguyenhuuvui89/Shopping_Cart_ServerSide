const express = require('express');

const router = express.Router();
const UserController = require('./userController');
const homeView = require('./homeView');
const userController = require('./userController');

// HomeView
router.get('/', homeView.home);
router.post('/', homeView.userDisplay);

// admin interface
router.get('/admin', (req, res) => {
  res.render('adminInterface');
});

// user interface
router.get('/user/:slug', UserController.displayProducts);

router.post('/user/:slug', UserController.search);


// Click into Shopping Cart;
router.get('/user/cart', (req, res) => {
  res.render('cart');
});

module.exports = router;
