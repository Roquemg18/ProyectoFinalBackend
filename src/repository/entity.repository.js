const EntityDAO = require("../dao/entity.dao");

class EntityRepository {
    constructor(entity) {
      this.dao = new EntityDAO(entity);
    }
  
    async getAllEntities() {
      try {
        return await this.dao.getAll();
      } catch (error) {
        throw error;
      }
    }
  
    async getEntityById(id) {
      try {
        return await this.dao.getOne(id);
      } catch (error) {
        throw error;
      }
    }
  
    async createEntity(info) {
      try {
        return await this.dao.create(info);
      } catch (error) {
        throw error;
      }
    }
  
    async updateEntity(id, info) {
      try {
        return await this.dao.update(id, info);
      } catch (error) {
        throw error;
      }
    }
  
    async deleteEntity(id) {
      try {
        await this.dao.delete(id);
      } catch (error) {
        throw error;
      }
    }
  }
  
  module.exports = EntityRepository;