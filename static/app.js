function hide_menu(menu) {
  var css_attrs = {};

  if(menu.hasClass('down')) {
    css_attrs = { top : '-600px' };
  }
  else if(menu.hasClass('left')) {
    css_attrs = { left : '-80%' };
  }

  menu.delay(200).animate(css_attrs, {
    duration : 1000,
    easing : 'easeInOutElastic'
  });
}

function show_menu(menu) {
  var css_attrs = {};

  if(menu.hasClass('down')) {
    css_attrs = { top : '120px' };
  }
  else if(menu.hasClass('left')) {
    css_attrs = { left : '13%' };
  }

  menu.delay(200).animate(css_attrs, {
    duration : 1000,
    easing : 'easeInOutElastic'
  });
}

$(document).ready(function() {
  $('.menu').delay(200).animate({
    top : '120px'
  }, {
    duration : 1000,
    easing : 'easeInOutElastic'
  });

  $(document).on('click', '.close', function(e){
    e.preventDefault();

    hide_menu($(this).parent().parent());
  });

  $(document).on('click', '#choose-level-menu a', function(e){
    e.preventDefault();

    var level = parseInt($(this).attr('id').replace('level-', ''));

    game.level = level;

    hide_menu($('#choose-level-menu'));
    show_menu($('#play-menu'));
  });

  $(document).on('click', '#choose-birds a', function(e){
    e.preventDefault();

    var img = $(this).find('img');

    var index = $('#choose-birds').find('a.selected').length;

    $('.player.left').find('#birds_' + index).css({
      background : 'url("' + img.attr('src') + '") no-repeat center center'
    });
    $(this).toggleClass("selected");
  });

  $(document).on('click', '#main-menu a', function(e){
    e.preventDefault();

    menu_id = "#" + $(this).attr('id') + "-menu";

    if($(menu_id).length) {
      show_menu($(menu_id));
      hide_menu($('#main-menu'));
    }
  });
});
