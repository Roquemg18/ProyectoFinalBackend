const mapEntity = require("./map.entity");

class EntityDAO {
  constructor(entity) {
    this.entity = mapEntity[entity];
  }

  async getAll() {
    try {
      return await this.entity.find();
    } catch (error) {
      throw error;
    }
  }

  async getOne(id) {
    try {
      return await this.entity.findOne({ _id: id });
    } catch (error) {
      throw error;
    }
  }

  async create(info) {
    try {
      return await this.entity.create(info);
    } catch (error) {
      throw error;
    }
  }

  async update(id, info) {
    try {
      return await this.entity.findByIdAndUpdate(id, info); // Corrección aquí
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.entity.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = EntityDAO;
