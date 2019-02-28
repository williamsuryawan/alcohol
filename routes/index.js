const express = require("express");
const router = express.Router();
const model = require("../models");
const checkPassword = require("../helpers/checkPassword");

router.get("/", (req, res) => {
  console.log("cek session ====>", req.session.login)
  res.render("home", {isLogin: req.session.login});
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
      console.log("Hasil Login ==>", name)
      if (name) {
        // console.log(name.password)
        const decrypt = checkPassword(req.body.Password, name.password)
        if (decrypt) {
          
          req.session.login = {
            username: name.userName,
            id: name.id
          }
          console.log("Cek Session===> ", req.session)
          if (name.isAlcohol == null || name.drinkBody == null || name.afterTaste == null) {
            res.redirect (`users/${name.id}/addattributes`)
          } else if (name.isAlcohol != null && name.drinkBody != null && name.afterTaste != null) {
            res.redirect('/alcohols/'+name.id+'/newresult')
          }
          //res.redirect('/alcohols/'+name.id+'/result')
            //`alcohols/${name.id}/result`)
          //res.send('Ini Sukses')
        } else {
          //res.send
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

router.get("/users/:id/addattributes", function(req, res) {
  model.User.findOne({
    where: {id: req.params.id}
  })
  .then(resultUser => {
    console.log("Hasil untuk add attributes ===>", resultUser)
    res.render('addattributes', {
      message: 'Please add your preferences before we give our alcohol recommendation',
      title: 'Add Attributes',
      usersData : resultUser
  })
  })
});

router.post("/:id/addattributes", (req,res) => {
  console.log("Hasil Update Preference ==>",  req.body)
  model.User.findByPk(req.params.id)
    .then(user => {
        user.isAlcohol = req.body.isAlcohol
        user.drinkBody = req.body.drinkBody
        user.afterTaste = req.body.afterTaste
        return user.save()
    })
  .then((result) => {
    res.redirect('/alcohols/'+req.params.id+'/result')
  })
  .catch ((err) => {
    res.send(err)
  })
})

module.exports = router;
