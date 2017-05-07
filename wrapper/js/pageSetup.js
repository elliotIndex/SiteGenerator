var utils = require('./utils');
var save = require('./save');

function toggleMobileViewport() {
  console.log('togging');
  $('.template').toggleClass('mobile');
}

function viewportSetup() {
  console.log('iframe loaded');
  var viewportContext = $('#template-frame').contents();

  $('#hidden-toggle-btn').click(function() {
    console.log("toogling");
    viewportContext.find('.sg-hidden-template').toggle();
  });

  var templateItems = viewportContext.find('[data-template-path]');
  templateItems.attr('contenteditable', 'true');
  $('#save-btn').click(function() {
    save(templateItems);
  });
};

module.exports = function() {
  $('#mobile-toggle-btn').click(toggleMobileViewport);
  $('#template-frame').on('load', viewportSetup);
}
