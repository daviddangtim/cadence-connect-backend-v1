export default class AppQueries {
  constructor(queryObject, query) {
    this.queryObject = queryObject;
    this.query = query;
  }

  filter() {
    const queryObj = { ...this.queryObject };
    const excludedFields = ["limit", "sort", "fields", "page"];

    excludedFields.forEach((el) => delete queryObj[el]);

    // the replace method cannot work on objects directly so I have
    // stringify the object
    let serializedQueryObj = JSON.stringify(queryObj);
    serializedQueryObj = serializedQueryObj.replace(
      /\b(gte|gt|tle|lt)\b/g,
      (match) => `$${match}`,
    );
    console.log(JSON.parse(serializedQueryObj));
    this.query = this.query.find(JSON.parse(serializedQueryObj));
    return this;
  }

  sort() {
    if (this.queryObject.sort) {
      const sortValue = this.queryObject.sort.split(",").join(" ");
      this.query = this.query.sort(sortValue);
    } else {
      this.query = this.query.sort("-createAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryObject.fields) {
      const fields = this.queryObject.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    }
    return this;
  }
  paginate() {
    if (this.queryObject.page) {
      const page = this.queryObject.page * 1 || 1;
      const limit = this.queryObject.limit * 1 || 10;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }
}

// const query = {
//   price: { gt: "50" },
//   cacVerified: "true",
//   ratingsQuantity: { gte: "20" },
// };
//
// console.log(query.ratingsQuantity);
