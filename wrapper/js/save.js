var utils = require('./utils');

module.exports = function(templateItems) {
  console.log('saving');
  var parsedTemplateItems = Array.from(templateItems)
    .map(function(templateItem) {
      return {
        path: templateItem.dataset.templatePath,
        text: templateItem.textContent.trim()
      };
    });

  var output = parsedTemplateItems.reduce(function(out, templateItem) {
    return utils.deepSet(out, templateItem.path, templateItem.text);
  }, {});
  console.log("window.output", output);
  console.log("JSON output", JSON.stringify(output));
  window.output = output;
}
