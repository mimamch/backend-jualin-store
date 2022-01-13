const Category = require("../category/model");
const Transaction = require("../transaction/model");
const Voucher = require("../voucher/model");
const Player = require("../player/model");
const User = require("../user/model");
module.exports = {
  index: async (req, res) => {
    try {
      const category = await Category.countDocuments();
      const transaction = await Transaction.countDocuments();
      const voucher = await Voucher.countDocuments();
      const player = await Player.countDocuments();
      const user = await User.findOne({ _id: req.session.user.id });
      res.render("admin/dashboard/view_dashboard", {
        nama: user.nama,
        title: "Dashboard",
        count: { category, transaction, voucher, player },
      });
    } catch (error) {
      console.log(error);
    }
  },
};
