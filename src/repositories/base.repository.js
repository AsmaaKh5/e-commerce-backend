const APIFeatures = require('../utils/apiFeatures');

/**
 * BaseRepository
 * كل repository هيرث منه عشان نتجنب تكرار CRUD
 * 
 * المسؤولية: التعامل مع قاعدة البيانات فقط (لا business logic هنا)
 */
class BaseRepository {
  constructor(model) {
    if (!model) {
      throw new Error('Model is required for repository');
    }
    this.model = model;
  }

  // ============ READ ============
  
  /**
   * Find by ID
   * @param {string} id - Document ID
   * @param {object} options - { populate, select, session }
   */
  async findById(id, options = {}) {
    let query = this.model.findById(id);
    
    if (options.populate) query = query.populate(options.populate);
    if (options.select) query = query.select(options.select);
    if (options.session) query = query.session(options.session);
    
    return await query;
  }

  /**
   * Find one document by filter
   */
  async findOne(filter = {}, options = {}) {
    let query = this.model.findOne(filter);
    
    if (options.populate) query = query.populate(options.populate);
    if (options.select) query = query.select(options.select);
    if (options.session) query = query.session(options.session);
    
    return await query;
  }

  /**
   * Find all with filter
   */
  async findAll(filter = {}, options = {}) {
    let query = this.model.find(filter);
    
    if (options.populate) query = query.populate(options.populate);
    if (options.select) query = query.select(options.select);
    if (options.sort) query = query.sort(options.sort);
    if (options.limit) query = query.limit(options.limit);
    if (options.skip) query = query.skip(options.skip);
    if (options.session) query = query.session(options.session);
    
    return await query;
  }

  /**
   * Find with pagination, filter, search, sort using APIFeatures
   * @param {object} queryString - req.query
   * @param {object} options - { searchFields, baseFilter, populate }
   */
  async findWithFeatures(queryString, options = {}) {
    const baseFilter = options.baseFilter || {};
    
    const features = new APIFeatures(this.model.find(baseFilter), queryString)
      .filter()
      .search(options.searchFields)
      .sort()
      .limitFields()
      .paginate();

    if (options.populate) {
      features.query = features.query.populate(options.populate);
    }

    const docs = await features.query;
    const total = await this.model.countDocuments(baseFilter);

    return {
      data: docs,
      pagination: {
        ...features.pagination,
        total,
        pages: Math.ceil(total / features.pagination.limit)
      }
    };
  }

  /**
   * Count documents
   */
  async count(filter = {}) {
    return await this.model.countDocuments(filter);
  }

  /**
   * Check if document exists
   */
  async exists(filter) {
    return await this.model.exists(filter);
  }

  // ============ CREATE ============
  
  /**
   * Create one document
   * @param {object} data 
   * @param {object} options - { session }
   */
  async create(data, options = {}) {
    if (options.session) {
      const docs = await this.model.create([data], { session: options.session });
      return docs[0];
    }
    return await this.model.create(data);
  }

  /**
   * Create many documents
   */
  async createMany(dataArray, options = {}) {
    return await this.model.insertMany(dataArray, options);
  }

  // ============ UPDATE ============
  
  /**
   * Update by ID
   */
  async updateById(id, data, options = {}) {
    return await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      session: options.session
    });
  }

  /**
   * Update one by filter
   */
  async updateOne(filter, data, options = {}) {
    return await this.model.findOneAndUpdate(filter, data, {
      new: true,
      runValidators: true,
      session: options.session
    });
  }

  /**
   * Update many
   */
  async updateMany(filter, data, options = {}) {
    return await this.model.updateMany(filter, data, {
      session: options.session
    });
  }

  // ============ DELETE ============
  
  /**
   * Hard delete by ID
   */
  async deleteById(id, options = {}) {
    return await this.model.findByIdAndDelete(id, {
      session: options.session
    });
  }

  /**
   * Soft delete by ID
   */
  async softDeleteById(id, options = {}) {
    return await this.model.findByIdAndUpdate(
      id,
      { isActive: false, deletedAt: Date.now() },
      { new: true, session: options.session }
    );
  }

  /**
   * Restore soft-deleted document
   */
  async restoreById(id, options = {}) {
    return await this.model.findByIdAndUpdate(
      id,
      { isActive: true, $unset: { deletedAt: 1 } },
      { new: true, session: options.session }
    );
  }
}

module.exports = BaseRepository;