const pageData = require('./editable.js');

// Appends the path to each leaf adjacent to that leaf
// input: mustache js object with all string leaves
// output: mustache js object with all string leaves, with half of the leaves as paths
// eg:
//  input: { a: "b", c: { d: "e" } }
//  output: { a: "b", "a-path": "a" c: { d: "e", "d-path": "c.d" } }
function appendLeafPaths(muObj, path = '') {
  if (typeof muObj === 'string') {
    return {
      value: muObj,
      path: path
    }
  }
  return Object.keys(muObj).reduce((outObj, key) => {
    outObj[key] = appendLeafPaths(muObj[key], path ? `${path}.${key}` : key);
    return outObj;
  }, {})
}

console.assert(JSON.stringify(appendLeafPaths({ a: "b", c: { d: "e" } }))
  === JSON.stringify({"a":{"value":"b","path":"a"},"c":{"d":{"value":"e","path":"c.d"}}}));

return appendLeafPaths(pageData);
