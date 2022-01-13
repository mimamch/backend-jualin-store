const User = require("./model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../config");
let title = "user";

module.exports = {
  view_signin: async (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");

    const alert = { message: alertMessage, status: alertStatus };

    try {
      if (req.session.user === null || req.session.user === undefined) {
        res.render("admin/user/view_signin", { alert, title: "Masuk" });
      } else {
        res.redirect("/dashboard");
      }
    } catch (error) {
      req.flash("alertMessage", error.message);
      req.flash("alertStatus", "danger");
      res.redirect(`/`);
    }
  },
  actionSignin: async (req, res) => {
    try {
      const { email, password } = req.body;

      const check = await User.findOne({ email });
      if (check) {
        if (check.status === "Y") {
          const checkPassword = await bcrypt.compare(password, check.password);
          if (checkPassword) {
            req.session.user = {
              id: check.id,
              email: check.email,
              status: check.status,
              nama: check.nama,
            };
            if (req.body.remember) {
              const token = jwt.sign(
                {
                  user: {
                    id: check.id,
                    email: check.email,
                    status: check.status,
                    nama: check.nama,
                  },
                },
                config.jwtKey
              );

              res.cookie("token", token, { maxAge: 7 * 24 * 60 * 60 * 1000 });
            }

            res.redirect("./dashboard");
          } else {
            req.flash("alertMessage", "Password yang anda masukkan salah");
            req.flash("alertStatus", "danger");
            res.redirect(`/`);
          }
        } else {
          req.flash("alertMessage", "Email yang anda masukkan tidak aktif");
          req.flash("alertStatus", "danger");
          res.redirect(`/`);
        }
      } else {
        req.flash("alertMessage", "Email yang anda masukkan salah");
        req.flash("alertStatus", "danger");
        res.redirect(`/`);
      }
    } catch (error) {
      req.flash("alertMessage", error.message);
      req.flash("alertStatus", "danger");
      res.redirect(`/`);
    }
  },
  actionLogout: (req, res) => {
    try {
      req.session.destroy();
      res.clearCookie("token");
      res.redirect("/");
    } catch (error) {
      req.flash("alertMessage", error.message);
      req.flash("alertStatus", "danger");
      res.redirect(`/`);
    }
  },
  view_profile: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.session.user.id });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/user/view_profile", {
        user,
        title: "Profile",
        nama: user.nama,
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", error.message);
      req.flash("alertStatus", "danger");
      res.redirect(`/`);
    }
  },
  edit_profile: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.session.user.id });
      const payload = req.body;
      const cekPass = await bcrypt.compare(payload.password, user.password);
      if (cekPass) {
        if (payload.newPassword) {
          const newPassword = await bcrypt.hash(payload.newPassword, 10);

          await User.findOneAndUpdate(
            { _id: req.session.user.id },
            {
              nama: payload.nama,
              email: payload.email,
              phoneNumber: payload.phoneNumber,
              password: newPassword,
            }
          );

          req.flash("alertMessage", "Berhasil Diubah");
          req.flash("alertStatus", "success");
          res.redirect("/profile");
        } else {
          await User.findOneAndUpdate(
            { _id: req.session.user.id },
            {
              nama: payload.nama,
              email: payload.email,
              phoneNumber: payload.phoneNumber,
            }
          );
          req.flash("alertMessage", "Berhasil Diubah");
          req.flash("alertStatus", "success");
          res.redirect("/profile");
        }
      } else {
        req.flash("alertMessage", "Password salah");
        req.flash("alertStatus", "danger");
        res.redirect("/profile");
      }
    } catch (error) {
      req.flash("alertMessage", error.message);
      req.flash("alertStatus", "danger");
      res.redirect(`/`);
    }
  },
};
