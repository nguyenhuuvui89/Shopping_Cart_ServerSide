const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema({
  productName: String,
  description: String,
  price: Number,
  quantity: Number,
  image: String,
}, { collection: 'products' });

const customerSchema = new Schema({
  firstName: String,
  lastName: String,
}, { collection: 'customers' });

// eslint-disable-next-line func-names
customerSchema.methods.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

const cartSchema = new Schema({
  product_id: String,
  customer_id: String,
  productName: String,
  price: Number,
  quantity: Number,
  image: String,
}, { collection: 'cart' });

const orderSchema = new Schema({
  date: { type: Date, default: Date.now },
  customer_id: String,
  products: [
    {
      productName: String,
      quantity: Number,
      image: String,
    },
  ],
}, { collection: 'order' });

const Order = mongoose.model('order', orderSchema);
const Product = mongoose.model('product', productSchema);
const Customer = mongoose.model('customer', customerSchema);
const Cart = mongoose.model('cart', cartSchema);
module.exports = {
  Product, Customer, Cart, Order,
};
