const { Product, Customer, Cart } = require('../model/modelsDB');

class HomePage {
  // [GET] '/'
  home = async (req, res, next) => {
    const users = await Customer.find({});
    const results = users.map((user) => ({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.getFullName(),
    }));
    res.render('homeView', { data: results });
  };

  // [POST] '/' after choose user
  userDisplay = async (req, res, next) => {
    const { customer } = req.body;
    // check if customer is empty or not and handle the cases.
    if (!customer) {
      res.redirect('/');
    } else {
      res.redirect(`/user/${customer}`);
    }
  };
}

module.exports = new HomePage();
