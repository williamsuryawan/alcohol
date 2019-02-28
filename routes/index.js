const express = require("express");
const router = express.Router();
const model = require("../models");
const checkPassword = require("../helpers/checkPassword");

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/reg", function(req, res) {
  model.User.findAll().then(user => {
    res.render("reg", { data: user });
  });
});

router.post("/reg", (req, res) => {
  let newUser = req.body;
  model.User.create({
    firstName: newUser["First Name"],
    lastName: newUser["Last Name"],
    birthday: newUser["Birthday"],
    email: newUser["Email"],
    userName: newUser["Username"],
    password: newUser["Password"]
  })

    .then(data => {
      // res.send(data)
      res.redirect("/home");
    })
    .catch(err => {
      res.send(err.errors[0].message);
    });
});

router.get("/login", function(req, res) {
  res.render("login");
});

router.post("/login", function(req, res) {
  let newUser = req.body;
  model.User.findOne({
    where: {
      userName: newUser["Username"]
    }
  })
    .then(name => {
      // console.log(req.body.Password);
      if (name) {
        // console.log(name.password)
        const decrypt = checkPassword(req.body.Password, name.password)
        if (decrypt) {

        } else {
          // password salah
        }
      } else {

      }
      // if (name.password === newUser["Password"]) {
      //   req.session.login = {
      //     id: name.id,
      //     nama: name.userName
      //   };
      //   res.redirect("/home");
      // } else {
      //   res.send("pas salah");
      //   // throw new Error("Pass Salah")
      // }
    })

    .catch(err => {
      res.send("Bad Request");
    });
});

module.exports = router;
