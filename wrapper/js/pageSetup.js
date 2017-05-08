var utils = require('./utils');
var save = require('./save');
var editTemplate = require('./editTemplate');

function toggleMobileViewport() {
  $('.template').toggleClass('mobile');
  $('#mobile-toggle-btn').text(function(_, currentText) {
    return utils.cycle(currentText.trim(), ['Mobile', 'Desktop']);
  });
}

function viewportSetup() {
  $('.navbar-text').toggle();
  $('.navbar-btn').toggle();

  var viewportContext = $('#template-frame').contents();

  // Make all items with path ids findable
  viewportContext.find('[id]').prop('id', function(_, id) {
    return utils.replaceAll(id, '.', '-');
  });

  // Update the template when external modifiers change
  viewportContext.find('body')
    .on('focus', '.sg-external-modifier', editTemplate.storeOriginal)
    .on('blur', '.sg-external-modifier', editTemplate.updateTarget(viewportContext));

  var templateItems = viewportContext.find('[data-template-path]');
  window.viewportContext = viewportContext;

  $('#editable-toggle-btn').click(editTemplate.togglePageEditable(viewportContext, templateItems));

  $('#save-btn').click(function() {
    save(templateItems);
  });
};

function wrapperSetup() {
  $('.navbar-btn').toggle();
}

module.exports = function() {
  wrapperSetup();
  $('#mobile-toggle-btn').click(toggleMobileViewport);
  $('#template-frame').on('load', viewportSetup);
}
