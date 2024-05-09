export default class AppQueries {
  constructor(queryObject, query) {
    this.queryObject = queryObject;
    this.query = query;
  }

  filter() {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const clonedQueryObject = { ...this.queryObject };
    const excludedFields = ["sort", "limit", "page", "fields"];

    excludedFields.forEach((el) => delete clonedQueryObject[el]);

    let queryStr = JSON.stringify(clonedQueryObject);
    // console.log("The query string is", JSON.parse(queryStr));
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    console.log(this.query);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryObject.sort) {
      const sortString = this.queryObject.split(",").join(" ");
      this.query = this.query.sort(sortString);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryObject.limit) {
      const limitString = this.queryObject.split(",").join(" ");
      this.query = this.query.select(limitString);
    }
    return this;
  }

  paginate() {
    if (this.queryObject.page) {
      const page = this.queryObject.page || 1;
      const limit = this.queryObject.limit || 10;
      const skip = (page - 1) * limit;

      this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }
}
