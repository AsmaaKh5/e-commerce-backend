const BaseRepository = require('./base.repository');
const Brand = require('../modules/brand/brand.model');

class BrandRepository extends BaseRepository {
  constructor() {
    super(Brand);
  }
}

module.exports = new BrandRepository();
