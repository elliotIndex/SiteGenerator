var utils = require('./utils');

function togglePageEditable(viewportContext, templateItems) {
  return function() {
    viewportContext.find('.sg-hidden-template').toggle();

    viewportContext.find('.portfolio-box').toggleClass('hover');
    if ($(viewportContext.find('.portfolio-box')[0]).prop('tagName').toLowerCase() === 'a') {
      utils.changeElementsTypes(viewportContext.find('.portfolio-box'), 'div');
      viewportContext.find('.portfolio-box').toggleClass('inactive-link');
    } else {
      utils.changeElementsTypes(viewportContext.find('.portfolio-box'), 'a');
    }

    viewportContext.find('a').toggleClass('inactive-link');

    $('#editable-toggle-btn').text(function(_, currentText) {
      return utils.cycle(currentText.trim(), ['Edit Mode', 'Presentation Mode']);
    });
    templateItems.attr('contenteditable', function(_, trueOrFalse){
      return utils.cycle(trueOrFalse, ['true', 'false']);
    });

    viewportContext.find('[contenteditable]').on('input', (e) => {
      if (e.target.innerText.indexOf('\n') > -1) {
        var target = viewportContext.find(e.target);
        target.text(target.text().replace('\n', '').replace('<br>', ''));
        target.blur();
      }
    });
  }
}

function storeOriginal() {
  var $this = $(this);
  $this.data('before', $this.html());
  return $this;
}

function updateTarget(viewportContext) {
  return function(){
    var $this = $(this);
    if ($this.data('before') !== $this.html()) {
      $this.data('before', $this.html());
      var targetId = utils.replaceAll($this.data('template-path'),'.', '-');
      if (targetId === 'theme-color') {
        updateStyle($this.html());
      } else {
        var target = viewportContext.find('#' + targetId);
        var tagName = target.prop('tagName').toLowerCase();
        if (tagName === 'a' || tagName === 'div') {
          target.attr('href', $this.html())
        } else if (tagName === 'img') {
          target.prop('src', $this.html())
        } else if (tagName === 'header') {
          target.prop('style', 'background-image: linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) ), url(\'' + $this.html() + '\')');
        } else if (tagName === 'i') {
          var classes = target.prop('class').split(' ');
          classes = classes.map(function(classy) {
            if (classy.startsWith('fa-') && classy !== 'fa-3x' && classy !== 'fa-4x') {
              return 'fa-' + $this.html().trim();
            }
            return classy;
          });
          target.prop('class', classes.join(' '));
        }
      }
    }
    return $this;
  }
}

function updateStyle(color) {
  var less = document.getElementById('template-frame').contentWindow.less;
  less.modifyVars({ '@theme-primary': color });
}

module.exports = {
  togglePageEditable,
  storeOriginal,
  updateTarget,
}
