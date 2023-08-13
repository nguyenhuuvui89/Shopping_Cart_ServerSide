const mongoose = require('mongoose');
const credentials = require('./credentials');
const { Product, Customer, Cart, Order } = require('./model/modelsDB');
// Establish connection
const dbUrl = `mongodb://${credentials.host}:${credentials.port}/${credentials.database}`;

mongoose.connect(dbUrl, { useNewUrlParser: true });

// Product Data

const products = [{
  productName: 'Bananas',
  description: 'Fruits',
  price: 0.5,
  quantity: 50,
  image: 'https://www.thedailymeal.com/img/gallery/13-delicious-things-you-can-make-with-bananas/l-intro-1673458653.jpg'
},
{
  productName: 'Milk',
  description: 'Dairy',
  price: 1.99,
  quantity: 40,
  image: 'https://assets.shop.loblaws.ca/products/20017001/b1/en/side/20017001_side_a01_@2.png'
},
{
  productName: 'Bread',
  description: 'Bakery',
  price: 2.49,
  quantity: 100,
  image: 'https://static01.nyt.com/images/2015/04/30/dining/29BIGAPPETITE/29BIGAPPETITE-superJumbo.jpg'
},
{
  productName: 'Eggs',
  description: 'Dairy',
  price: 3.99,
  quantity: 100,
  image: 'https://img.taste.com.au/oI-2zjyU/taste/2007/04/eggs-182316-1.jpg'

},
{
  productName: 'Tomatoes',
  description: 'Vegetables',
  price: 1.2,
  quantity: 30,
  image: 'https://assets.shop.loblaws.ca/products/20840038001/b1/en/front/20840038001_front_a01_@2.png'

},
{
  productName: 'Coffee-Mate, Original',
  description: 'Rich and creamy non-dairy creamer. 252 per pallet',
  price: 15.99,
  quantity: 30,
  image: 'https://assets.shop.loblaws.ca/products/21034225/b1/en/brand/21034225_brand_a01_@2.png'

},
{
  productName: 'Sistema To Go Collection Bento Box',
  description: '100% virgin plastic; phthalate- and BPA-free',
  price: 9.87,
  quantity: 1000,
  image: 'https://static1.squarespace.com/static/6217a6968b376a434418ae8b/t/6416043616fc5e2dca82c202/1679164471002/Show+Your+Love+with+our+Miso+Tasty+Bento+Box+Lunch+Ideas.jpg?format=1500w',
},
];

// customer data

const customers = [
  {
    firstName: 'Alice',
    lastName: 'Johnson',
  },
  {
    firstName: 'Bob',
    lastName: 'Smith',
  },
  {
    firstName: 'Eve',
    lastName: 'Brown',
  },
];
// Insert data
async function saveData() {
  try {
    await Product.deleteMany({});
    await Customer.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});
    await Product.insertMany(products);
    await Customer.insertMany(customers);
    console.log('Data inserted successfully!');
  } catch (error) {
    console.log('Error inserting data:', error);
  }
}

saveData();
