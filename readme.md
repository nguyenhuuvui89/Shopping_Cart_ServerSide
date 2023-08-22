I. Project Summary
  The project is to develop a shopping cart application for a merchant's website. The project is prioritized server-side functionality using Node.js with Mongodb and Handlebars engine.
II. Run program.
  1. npm install
  2. Run initDB.js
  3. Run server.js
  4. URL Access Main/Home page: http://localhost:3000/
  5. URL access Admin page: http://localhost:3000/admin or click into Admin in the homepage
III. Shopping Cart.
  1. Customer Interface
    - Choose Customer from the drop down menu and start shopping. You can not start shopping if you not choose customer.
    - Display a list of products (unique id, name, description, price, and stock quantity).
    - Search Product by name.
    - Select a product  and and specify the desired quantity to add to the shopping cart. If customer input the desired quantity which is higher than the available quantity of product, the alert will showed. If the  product is empty, the At to cart button will change to out of stock and button is disabled. Quantities available for product is updated
    - Customer can update their shopping cart (remove products, update quantity, and add products). Shopping cart also show total amount of cart. Ex. If customer remove products, the product's quantity will be put back to stock. If there is no products in cart, Place order will be disable.
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
    - Display a list of Customers by clicking to Customer on the navbar. List of customers will be display and you can click to the order button to access their order history. And you can delete their order here. Quantities available for product is updated when you delete their order.( The order is deleted from customer)
    - If the admin tries to delete a product assigned to an order, the alert will be display.
  3. APIs
    I. **Product List: http://localhost:3000/admin**
    II. **Product Matching a specified name : http://localhost:3000/admin?search=true&productName=Milk**
      Ex: Json
      + [
          {
              "_id": "64d7bce2b4f953a2bf98d1a6",
              "productName": "Milk",
              "description": "Dairy",
              "price": 1.99,
              "quantity": 13,
              "image": "https://assets.shop.loblaws.ca/products/20017001/b1/en/side/20017001_side_a01_@2.png",
              "__v": 0
          }
        ]
      + Ex: XML
      <?xml version ="1.0"? >
        <products>
            <product>
                <id> 64d7bce2b4f953a2bf98d1a6 </id>
                <productName> Milk </productName>
                <description> Dairy</description>
                <price> 1.99 </price>
                <quantity> 13 </quantity>
                <image> https://assets.shop.loblaws.ca/products/20017001/b1/en/side/20017001_side_a01_@2.png </image>
            </product>
        </products>
    III. **Products within a specified range (low price, high price): http://localhost:3000/admin?lowPrice=1&highPrice=2**
      + Ex: Json
        [
          {
              "_id": "64d7bce2b4f953a2bf98d1a6",
              "productName": "Milk",
              "description": "Dairy",
              "price": 1.99,
              "quantity": 13,
              "image": "https://assets.shop.loblaws.ca/products/20017001/b1/en/side/20017001_side_a01_@2.png",
              "__v": 0
          },
          {
              "_id": "64d7bce2b4f953a2bf98d1a9",
              "productName": "Tomatoes",
              "description": "Vegetables",
              "price": 1.2,
              "quantity": 30,
              "image": "https://assets.shop.loblaws.ca/products/20840038001/b1/en/front/20840038001_front_a01_@2.png",
              "__v": 0
          }
        ]
      + Ex: XML
          <?xml version="1.0"?>
            <products>
                <product>
                    <id> 64d7bce2b4f953a2bf98d1a6 </id>
                    <productName> Milk </productName>
                    <description> Dairy</description>
                    <price> 1.99 </price>
                    <quantity> 13 </quantity>
                    <image> https://assets.shop.loblaws.ca/products/20017001/b1/en/side/20017001_side_a01_@2.png </image>
                </product>
                <product>
                    <id> 64d7bce2b4f953a2bf98d1a9 </id>
                    <productName> Tomatoes </productName>
                    <description> Vegetables</description>
                    <price> 1.2 </price>
                    <quantity> 30 </quantity>
                    <image> https://assets.shop.loblaws.ca/products/20840038001/b1/en/front/20840038001_front_a01_@2.png </image>
                </product>
            </products>
