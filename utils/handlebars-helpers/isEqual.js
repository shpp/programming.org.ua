module.exports = function (variable, value, options) {
  return variable === value ? options.fn(this) : options.inverse(this);
};
