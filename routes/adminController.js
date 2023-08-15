const { Product, Customer, Cart, Order } = require('../model/modelsDB');

class AdminController {
  // [GET]/admin
  displayProducts = async (req, res, next) => {
    const products = await Product.find({}).lean();
    const numberResults = products.length;

    const lowPrice = parseFloat(req.query.lowPrice);
    const highPrice = parseFloat(req.query.highPrice);

    const productSearch = req.query.productName;
    const product = new RegExp(productSearch, 'i');
    const searchResult = req.query.search;
    const filteredProducts = products.filter((p) => product.test(p.productName));
    // eslint-disable-next-line no-unused-expressions
    // Handle case when have ?lowPrice = and ?highPrice =
    // http://localhost:3000/admin?lowPrice=1&highPrice=2
    if (!isNaN(lowPrice) && !isNaN(highPrice)) {
      const filteredProductsPrice = products.filter(
        (p) => p.price >= lowPrice && p.price <= highPrice);
      res.format({
        'application/json': () => {
          res.json(filteredProductsPrice);
        },
        'application/xml': () => {
          let resultXML = `<?xml version="1.0"?>
            <products>`;
          filteredProductsPrice.forEach((e) => {
            resultXML += `<product>
                                  <id> ${e._id} </id>
                                  <productName> ${e.productName} </productName>
                                  <description> ${e.description}</description>
                                  <price> ${e.price} </price>
                                  <quantity> ${e.quantity} </quantity>
                                  <image> ${e.image} </image>
                              </product>`;
          });
          resultXML += '</products>';
          res.type('application/xml');
          res.send(resultXML);
        },
        'text/html': () => {
          res.render('./admin/adminInterface', { data: filteredProductsPrice });
        },
      });
      // Handle case when to provide API for display product list and product matching name
    } else {
      // (http://localhost:3000/admin) (http://localhost:3000/admin?search=true&productName=Milk)
      res.format({
        'application/json': () => {
          if (searchResult === 'true') {
            res.json(filteredProducts);
          } else {
            res.json(products);
          }
        },
        // Implement XML;
        'application/xml': () => {
          let resultXML = `<?xml version ="1.0"? >
            <products>`;
          if (searchResult === 'true') {
            filteredProducts.forEach((e) => {
              resultXML += `<product>
                                  <id> ${e._id} </id>
                                  <productName> ${e.productName} </productName>
                                  <description> ${e.description}</description>
                                  <price> ${e.price} </price>
                                  <quantity> ${e.quantity} </quantity>
                                  <image> ${e.image} </image>
                              </product>`;
            });
            resultXML += '</products>';
            res.type('application/xml');
            res.send(resultXML);
          } else {
            products.forEach((e) => {
              resultXML += `<product>
                                  <id> ${e._id} </id>
                                  <productName> ${e.productName} </productName>
                                  <description> ${e.description}</description>
                                  <price> ${e.price} </price>
                                  <quantity> ${e.quantity} </quantity>
                                  <image> ${e.image} </image>
                              </product>`;
            });
            resultXML += '</products>';
            res.type('application/xml');
            res.send(resultXML);
          }
          // Loop through products to get detail;
        },
        // Implement html
        'text/html': () => {
          if (searchResult === 'true') {
            res.render('./admin/adminInterface', { data: filteredProducts, numberResults });
          } else {
            res.render('./admin/adminInterface', { data: products, numberResults });
          }
        },
      });
    }
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

  // Handle [GET] /admin/add view
  addProductView = async (req, res, next) => {
    res.render('./admin/addproducts');
  };

  // Handle [POST] at /admin/add request,add new items into database
  addProduct = async (req, res, next) => {
    const { productName } = req.body;
    const { description } = req.body;
    const price = parseFloat(req.body.price);
    const quantity = parseFloat(req.body.quantity);
    const { image } = req.body;
    // add new product
    const newProduct = new Product({
      // productName : productName,
      // description: description,
      // price: price,
      // quantity: quantity,
      // image: image,
      productName,
      description,
      price,
      quantity,
      image,
    });
    newProduct.save();
    res.redirect('/admin');
  };

  // Handle [GET] /admin/customers url
  displayCustomers = async (req, res, next) => {
    const customers = await Customer.find({});
    const customerInfo = customers.map((customer) => {
      return {
        id: customer._id,
        fullName: customer.getFullName(),
      }
    });
    const numberCustomers = customerInfo.length;
    res.render('./admin/displaycustomers', { data: customerInfo, numberCustomers });
  };

  // Handle [POST] /admin/customer/orders view specific customer's order
  customerOrder = async (req, res, next) => {
    const { customerId } = req.body;
    const customer = await Customer.findById({ _id: customerId });
    const customerName = customer.firstName;
    const customerOrders = await Order.find({ customer_id: customerId }).lean();
    const numberOrders = customerOrders.length;
    if (numberOrders === 0) {
      res.render('./admin/nocustomerorders', { customerName });
    } else {
      res.render('./admin/customerOrder', { data: customerOrders, customerId, customerName, numberOrders });
    }
  };

  // Handle [POST] /admin/customer/orders delete customer order;
  deleteOrder = async (req, res, next) => {
    const { orderId } = req.body;
    const orderDetail = await Order.findById({ _id: orderId });
    const customerId = orderDetail.customer_id;
    const productOrderDetail = orderDetail.products;
    productOrderDetail.forEach(async (product) => {
      const productId = product.product_id;
      const productOrderQtn = product.quantity;
      // const productsInStock = await Product.findById({ _id: productId });
      // productsInStock.quantity += productOrderQtn;
      // productsInStock.save();
      // better way:
      await Product.updateOne({ _id: productId }, { $inc: { quantity: productOrderQtn } });
    });
    await Order.deleteOne({ _id: orderId });
    const customer = await Customer.findById({ _id: customerId });
    // don't use lean() if want to get result from method because lean() return plain js
    const customerFullName = customer.getFullName();
    res.render('./admin/afterdeleteorder', { orderId, customerFullName });
  };
}
module.exports = new AdminController();
