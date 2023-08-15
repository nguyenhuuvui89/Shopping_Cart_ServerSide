Product List: http://localhost:3000/admin
Product Matching a specified name : http://localhost:3000/admin?search=true&productName=Milk
Products within a specified range (low price, high price): http://localhost:3000/admin?lowPrice=1&highPrice=2
I. Project Summary
  The project is to develop a shopping cart application for a merchant's website. The project is prioritized server-side functionality using Node.js with Mongodb and Handlebars engine.
II. Run program.
  1. npm install
  2. Run initDB.js
  3. Run server.js
III. Shopping Cart.
  1. Customer Interface
    - Choose Customer from the drop down menu and start shopping. You can not start shopping if you not choose customer.
    - Display a list of products (unique id, name, description, price, and stock quantity).
    - Search Product by name.
    - Select a product  and and specify the desired quantity to add to the shopping cart. If customer input the desired quantity which is higher than the available quantity of product, the alert will showed. If the  product is empty, the At to cart button will change to out of stock and button is disabled. Quantities available for product is updated
    - Customer can update their shopping cart (remove products, update quantity, and add products). Shopping cart also show total amount of cart. Ex. If customer remove products, the product's quantity will be put back to stock.
    - When customers submit the order, shopping cart becomes empty. Quantities available for product is updated.
    - After customers submit the cart, they can access the list of the previous order.
    - Display a main menu to go:
      + Search Product. If you want to display all items again after search (Click to Display All Items)
      + My Order  
      + Link to return to the home page (Click to Home). Cart is displayed specific for the current customer; If you switch customers, Cart will display their shopping cart.
      + Access the current Shopping Cart ( Click to Shopping Cart).
  2. Admin Interface
    - Display a list of products (unique id, name, description, price, and stock quantity).
    - Search Product by name.
    - Products Maintenance form – update, or delete products by clicking to update and delete button in product card.
      Click to manage product to add product
    - Display a list of Customers by clicking to Customer on the navbar. List of customers will be display and you can click to the order button to access their order history. And you can delete their order here. Quantities available for product is updated when you delete their order.
    - If the admin tries to delete a product assigned to an order, the alert will be display.

