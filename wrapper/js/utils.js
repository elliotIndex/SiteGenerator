function deepSet(obj, path, value) {
  path = path.split('.');

  // If at the end of the path, assign the value
  if (path.length === 1) {
    obj[path[0]] = value;
    return obj;
  }

  // If next item in path is a number, then current item should be an array
  if (path[1] && !Number.isNaN(+path[1])) {
    obj[path[0]] = obj[path[0]] || [];
  } else {
    // Else, the next item should be an object
    obj[path[0]] = obj[path[0]] || {};
  }

  // Recurse down the tree with the next depth and next path
  deepSet(obj[path[0]], path.slice(1).join('.'), value);
  return obj;
}

module.exports = {
  deepSet,
}
