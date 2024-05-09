const filterObject = (object, ...select) => {
  const selected = {};

  Object.keys(object).forEach((key) => {
    if (select.includes(key)) {
      selected[key] = object[key];
    }
  });

  return selected;
};

export default filterObject;
