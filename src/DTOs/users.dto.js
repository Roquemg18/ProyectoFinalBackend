const { createHash } = require("../utils/cryptPassword.util");

class UserDTO {
  constructor(info) {
    this.first_name = info.first_name;
    this.last_name = info.last_name;
    this.email = info.email;
    this.password = createHash(info.password);
    this.age = info.age;
    this.role = "user";

  }
}

module.exports = UserDTO;
