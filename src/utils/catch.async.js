/* eslint-disable prettier/prettier */
const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

export default catchAsync;
