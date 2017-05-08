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

function cycle(value, options) {
  var index = (options.indexOf(value) + 1) % options.length;
  return options[index]
}

function changeElementsTypes(elements, newType) {
  $.each(elements, function(index, element) {
    changeElementType($(element), newType);
  });
}

function changeElementType(element, newType) {
  var attrs = {};

  $.each(element[0].attributes, function(idx, attr) {
      attrs[attr.nodeName] = attr.nodeValue;
  });
  element.replaceWith(function() {
      return $("<" + newType + "/>", attrs).append($(element).contents());
  });
}

module.exports = {
  deepSet,
  cycle,
  changeElementsTypes,
}
