var utils = require('./utils');

function mobilize() {
  console.log('togging');
  $('.template').toggleClass('mobile');
}


var save = function() {
  console.log("not ready yet");
};

var templateFrameLoad = function() {
  console.log("iframe loaded");
  var innerDoc = $('#template-frame').contents();
  innerDoc.find('[data-template-path]').attr('contenteditable', 'true');
  $('#save-btn').off('click', save);
  $('#save-btn').on('click', function() {
    console.log('saving');
    var selectables = Array.from(innerDoc.find('[data-template-path]')).map(selectable => ({
      path: selectable.dataset.templatePath,
      text: selectable.textContent.trim()
    }));
    console.log('selectables', selectables);
    var json = deepSet({}, 'moop', 'poop')
  });
}

module.exports = function() {
  $('#save-btn').click(save);
  $('#mobile-toggle-btn').click(mobilize);
  $('#template-frame').on('load', templateFrameLoad);
}
