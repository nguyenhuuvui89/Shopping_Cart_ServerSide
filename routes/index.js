const express = require('express');

const router = express.Router();
const UserController = require('./userController');
const AdminController = require('./adminController');
const homeView = require('./homeView');

// HomeView
router.get('/', homeView.home);
router.post('/', homeView.userDisplay);

// 1. Admin interface

router.get('/admin', AdminController.displayProducts);
router.post('/admin/search', AdminController.searchProduct);
// [POST] Delete item
router.post('/admin/delete', AdminController.deleteProduct);
// [GET] /admin/update?product={} URL View
router.get('/admin/update', AdminController.updateProductView);

// Handle [POST] /admin/update?product=
router.post('/admin', AdminController.updateProduct);

// Handle [GET] /admin/add view
router.get('/admin/add', AdminController.addProductView);
// Handle [POST] at /admin/add request,add new items into database,
router.post('/admin/add', AdminController.addProduct);

// Handle [GET] /admin/customers url
router.get('/admin/customers', AdminController.displayCustomers);

// Handle [POST] /admin/customer/orders view specific customer's order
router.post('/admin/customer/orders', AdminController.customerOrder);

// Handle [POST] /admin/customer/delete delete the customer'order
router.post('/admin/customers/delete', AdminController.deleteOrder);



// 2. User interface
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

// [GET] user/checkout?user={slug} for checkout view and insert data into Order
router.post('/checkout', UserController.checkOut);

// [Get] /order?user={slug} for order view
router.get('/order', UserController.orderView);

module.exports = router;
