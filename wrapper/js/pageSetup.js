var utils = require('./utils');
var save = require('./save');

function toggleMobileViewport() {
  console.log('togging');
  $('.template').toggleClass('mobile');
}

function viewportSetup() {
  console.log('iframe loaded');
  var viewportContext = $('#template-frame').contents();
  var templateItems = viewportContext.find('[data-template-path]');
  // var editableItems = viewportContext.find('editable');

  $('#hidden-toggle-btn').click(function() {
    viewportContext.find('.sg-hidden-template').toggle();
    viewportContext.find('a').toggleClass('inactive-link')
    templateItems.attr('contenteditable', function(_, tOrF){
      return tOrF === 'true' ? 'false' : 'true';
    });
  });

  $('#save-btn').click(function() {
    save(templateItems);
  });
};

module.exports = function() {
  $('#mobile-toggle-btn').click(toggleMobileViewport);
  $('#template-frame').on('load', viewportSetup);
}
