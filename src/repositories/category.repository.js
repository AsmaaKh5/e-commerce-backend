const BaseRepository = require('./base.repository');
const Category = require('../modules/category/category.model');

class CategoryRepository extends BaseRepository {
  constructor() {
    super(Category);
  }
}

module.exports = new CategoryRepository();
