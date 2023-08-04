class InfoCurrentDTO {
  constructor(info) {
    this.first_name = info.first_name;
    this.last_name = info.last_name;
    this.age = info.age;
    this.email = info.email;
  }
}

module.exports = InfoCurrentDTO;
