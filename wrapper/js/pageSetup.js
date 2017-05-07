var utils = require('./utils');
var save = require('./save');

function mobilize() {
  console.log('togging');
  $('.template').toggleClass('mobile');
}

var templateFrameLoad = function() {
  console.log('iframe loaded');
  var templateItems = $('#template-frame').contents().find('[data-template-path]');
  templateItems.attr('contenteditable', 'true');
  $('#save-btn').on('click', function() { save(templateItems); });
};


module.exports = function() {
  $('#mobile-toggle-btn').click(mobilize);
  $('#template-frame').on('load', templateFrameLoad);
}
