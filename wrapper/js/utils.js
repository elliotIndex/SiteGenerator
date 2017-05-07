function deepSet(obj, path, value) {
  path = path.split('.');
  console.log("moo");
  if (path.length === 1) {
    obj[path[0]] = value;
  } else {
    obj[path[0]] = obj[path[0]] || {};
    deepSet(obj[path[0]], path.slice(1).join('.'), value)
  }
  return obj;
}

module.exports = {
  deepSet,
}
