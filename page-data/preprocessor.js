// File to process JSON page data into mustache/template readable objects

// Initialize by gathering filename
let fname = null;
if (process.argv.includes('--fname')) {
  fname = process.argv[process.argv.indexOf('--fname') + 1];
}

if (!fname) {
  throw new Error('No filename provided');
}

const pageData = require(`./${fname}`);

if (!pageData) {
  throw new Error(`No file found with name ${fname}`);
}

// Appends the path to each leaf adjacent to that leaf
// input: mustache js object with all string leaves
// output: mustache js object with all string leaves, with leaves containing parent paths
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
  if (Array.isArray(muObj)) {
    return muObj.reduce((outArr, element, index) => {
      outArr.push(appendLeafPaths(element, path ? `${path}.${index}` : index));
      return outArr;
    }, [])
  }
  return Object.keys(muObj).reduce((outObj, key) => {
    outObj[key] = appendLeafPaths(muObj[key], path ? `${path}.${key}` : key);
    return outObj;
  }, {});
}

console.assert(JSON.stringify(appendLeafPaths({ a: "b", c: { d: "e" } }))
  === JSON.stringify({"a":{"value":"b","path":"a"},"c":{"d":{"value":"e","path":"c.d"}}}));

module.exports = appendLeafPaths(pageData);
