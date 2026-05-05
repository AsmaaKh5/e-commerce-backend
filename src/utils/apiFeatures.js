class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // فلترة متقدمة: ?price[gte]=100&category=xyz
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'keyword'];
    excludedFields.forEach((field) => delete queryObj[field]);

    // تحويل gte, gt, lte, lt إلى $gte, $gt, $lte, $lt
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // البحث: ?search=phone
  search(fields = ['title', 'name', 'description']) {
    if (this.queryString.search || this.queryString.keyword) {
      const searchTerm = this.queryString.search || this.queryString.keyword;
      const orConditions = fields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' }
      }));
      this.query = this.query.find({ $or: orConditions });
    }
    return this;
  }

  // الترتيب: ?sort=-price,createdAt
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  // اختيار حقول معينة: ?fields=title,price
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  // ترقيم الصفحات: ?page=2&limit=10
  paginate() {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    
    this.pagination = { page, limit };
    return this;
  }
}

module.exports = APIFeatures;