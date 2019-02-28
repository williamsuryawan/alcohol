const bcrypt = require("bcrypt");

function checkPassword(plainPassword, hash) {
  console.log(plainPassword)
  return bcrypt.compareSync(plainPassword, hash);
}

module.exports = checkPassword;
