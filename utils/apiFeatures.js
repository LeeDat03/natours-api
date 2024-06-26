class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Filtering
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //  Advanced Filtering
    // Replace gte, gt, lte, lt with $gte, $gt, $lte, $lt
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // 2 Sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.query.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  // Field limiting
  limitFields() {
    if (this.queryString.fields) {
      const fieldsBy = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fieldsBy);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  // 4) Pagination
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
