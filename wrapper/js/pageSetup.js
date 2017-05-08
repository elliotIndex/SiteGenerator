var utils = require('./utils');
var save = require('./save');

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
  var templateItems = viewportContext.find('[data-template-path]');
  // var editableItems = viewportContext.find('editable');

  $('#editable-toggle-btn').click(function() {
    viewportContext.find('.sg-hidden-template').toggle();
    viewportContext.find('a').toggleClass('inactive-link');
    $('#editable-toggle-btn').text(function(_, currentText) {
      return utils.cycle(currentText.trim(), ['Edit Mode', 'Presentation Mode']);
    });
    templateItems.attr('contenteditable', function(_, trueOrFalse){
      return utils.cycle(trueOrFalse, ['true', 'false']);
    });
  });

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
