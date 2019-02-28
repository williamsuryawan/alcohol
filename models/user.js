"use strict";
const bcrypt = require("bcrypt");
const sequelize = require("sequelize");
const Op = sequelize.Op;

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      // {
      //   type: DataTypes.STRING,
      //   validate: {
      //     isEmail : true,
      //     isUnique: function(theEmail, next) {
      //       let self = this;
      //       User
      //       .findOne({
      //         where: {
      //           email: theEmail
      //         }
      //       })
      //       .then(function(user) {
      //         if (user && self.id != user.id) {
      //           return next("Email has been used");
      //         }
      //         return next();
      //       })
      //       .catch(function(err) {
      //         return next(err)
      //       })
      //     }
      //   }
      // },
      userName: {
        type: DataTypes.STRING,
        validate: {
          isUnique: function(value) {
            return new Promise((resolve, reject) => {
              let self = this;
              console.log(self.id, "==============>");
              User.findOne({
                where: {
                  userName: value,
                  id: { [Op.ne]: this.id }
                }
              })
                .then(res => {
                  if (res) {
                    reject("Username already exists");
                  } else {
                    resolve(true);
                  }
                })
                .catch(err => {
                  throw err;
                });
            });
          }
        }
      },
      password: DataTypes.STRING,
      birthday: DataTypes.DATE,
      isAlcohol: DataTypes.STRING,
      drinkBody: DataTypes.STRING,
      afterTaste: DataTypes.STRING
    },
    {
      hooks: {
        afterValidate(User) {
          User.password = bcrypt.hashSync(User.password, bcrypt.genSaltSync(8));
        }
      }
    }
  );
  User.associate = function(models) {
    // associations can be defined here
    User.belongsToMany(models.Alcohol, { through: models.UserAlcohol });
  };
  return User;
};
