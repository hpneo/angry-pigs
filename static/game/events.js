Game.init_events = function(game) {   
  $(document).ready(function(){

    var player_items_length = [game.players[0].items.length, game.players[1].items.length];

    for(var i=0; i < player_items_length[0]; i++) {
      $('.player.left').append('<div class="' + game.players[0].team + '" id="' + game.players[0].items[i].id + '"></div>');
    }

    for(var i=0; i < player_items_length[1]; i++) {
      $('.player.right').append('<div class="' + game.players[1].team + '" id="' + game.players[1].items[i].id + '"></div>');
    }

    $(document).on('dragstart', 'body', function(e){
      e.preventDefault();
    });

    $(document).keyup(function(e){
      if(!game.finished) {
        if(game.current_item){
          current_item_el = $('#' + game.current_item.id);

          if(current_item_el.hasClass(game.first_team)){
            x = 'left';
            move_back = -20;
            move_forward = +20;
          }
          else{
            x = 'right';
            move_back = +20;
            move_forward = -20;
          }

          current_x = parseInt(current_item_el.css(x).replace('px', ''));
          
          var new_x = 0;

          switch(e.keyCode){
            case 37:
              new_x = (current_x + move_back);
            break;
            case 39:
              new_x = (current_x + move_forward);
            break;
          }
          if(new_x >= 0 && new_x <= 270) {
            game.current_item.x = new_x;
            current_item_el.css(x, new_x + 'px');
          }
        }
      }
    });

    $('body').click(function(e){
      if(!game.finished) {
        if(e.target){
          var item_id = e.target.id;

          if(item_id.split('_')[0] == game.first_team)
            var player = game.players[0];
          else
            var player = game.players[1];

          game.current_player = player;
          game.current_item = player.items[parseInt(item_id.split('_')[1])];
        }
      }
    });

    $('body').mousedown(function(e){
      if(!game.finished) {
        game.x1 = e.clientX;
        game.y1 = e.clientY;

        if(e.target){
          var item_id = e.target.id;

          if(item_id.split('_')[0] == game.first_team)
            var player = game.players[0];
          else
            var player = game.players[1];

          game.current_player = player;
          game.current_item = player.items[parseInt(item_id.split('_')[1])];
        }
      }
    }).mouseup(function(e){
      if(!game.finished) {
        game.x2 = e.clientX;
        game.y2 = e.clientY;

        if(game.current_item) {
          game.current_item.angle = game.angle();
          game.current_item.v0 = game.distance();

          if(!isNaN(game.current_item.angle))
            game.current_item.fly();
        }
      }
    });
  });
};