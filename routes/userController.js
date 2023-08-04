// Can either connect to database here or in server.js file
// but when we have initDB we should connect on that file
// const mongoose = require('mongoose');
// const credentials = require('../credentials');
// const dbUrl = `mongodb://${credentials.host}:${credentials.port}/${credentials.database}`;
// mongoose.connect(dbUrl, { useNewUrlParser: true });

const { Product, Customer, Cart } = require('../model/modelsDB');

class UserController {
  // [GET]/user and /user/;slug
  displayProducts = async (req, res, next) => {
    const id = req.params.slug;
    const products = await Product.find({}).lean();
    // when using direct products data from json, handlebar will denied, 
    // so need to add lean() to get access
    res.render('userInterface', { data: products, id });
  };

  // [POST]/user/:slug search products
  search = async (req, res, next) => {
    const id = req.params.slug;
    const product = req.body.search;
    const productSearch = new RegExp(product, 'i')
    const products = await Product.find({ productName: productSearch }).lean();
    res.render('userInterface', { data: products, id });
  };
}

module.exports = new UserController();
