Item = function(player, index) {
  this.player = player;
  this.index = index;
  this.destroyed = false;
  this.id = this.player.team + "_" + this.index;
  this.gravity = 9.81;
  this.t = 0;
  this.angle = 0;
  this.v0 = 0;
  this.x0 = 90 * (this.index) + 50;
  this.x = this.x0;
  this.y0 = 105;
  this.y = this.y0;
  this.lives = 3;

  this.rad = function(degrees) {
    return (degrees / 180) * Math.PI;
  };

  this.time = function() {
    return (this.t / 140) * 3.5;
  };

  this.vx = function() {
    var radians = this.rad(this.angle);

    return this.v0 * Math.cos(radians);
  };

  this.vy = function() {
    var radians = this.rad(this.angle);

    return this.v0 * Math.sin(radians);
  };

  this.position_x = function() {
    return this.x0 + (this.vx() * this.time() * 2.1);
  };

  this.position_y = function() {
    return this.y0 + (this.vy() * this.time()) - (this.gravity * Math.pow(this.time(), 2) * 0.5) * 7.8;
  };

  this.find_collisions = function() {
    var team_index;
    if(this.player.team == this.player.game.first_team)
      team_index = 1;
    else
      team_index = 0;

    var items = this.player.game.players[team_index].items;
    
    for(var i=0; i < items.length; i++) {
      var result = (function(current_item, item){
        if(current_item.collides_with(item)){
          item.decreaseLives();
          if (item.lives == 0) {
            item.destroy();
          }
          return true;
        }
        return false;
      })(this, items[i]);
      if(result)
        break;
    }
  };

  this.collides_with = function(item) {
    return $('#' + this.id).hittest('#' + item.id);
  };

  this.decreaseLives = function() {
    if (this.lives > 0) {
      this.lives -= 1;
    }
    this.player.game.updateScores(this);
    this.player.game.updateLives(this);
  }

  this.destroy = function(callback) {
    var id = this.id;

    window.setTimeout(function(item){
      var element = $('#' + id);
      var original_bottom = parseFloat(element.css('bottom'));
      var destination_bottom = original_bottom + 800;

      element.animate({
        'opacity': 0,
        'bottom': destination_bottom + "px"
      }, {
        easing: 'easeInBack',
        duration: 600,
        complete: function() {
          item.destroyed = true;
          item.y = destination_bottom;

          item.player.game.updateScores(item);

          item.player.game.checkForWinner();
          if(callback)
            callback();
        }
      });
    }, 610, this);
  };

  this.fly = function() {
    var item_in_dom = $('#' + this.id);
    var interval = window.setInterval(function(item) {
      item.x = item.position_x();
      item.y = item.position_y();

      if(item.t > 2) {
        if(parseInt(item.y) <= 105) {
          item.y = 105;
          window.clearInterval(interval);
          
          item.find_collisions();
          
          item.destroy(function(){
            if(!game.finished) {
              window.setTimeout(function(){
                var player = game.next_player();
                
                if(player.team == game.second_team) {
                  var item = player.prepareItem();
                  if(item)
                    item.fly();
                }
              }, 1200);
            }
          });
        }
      }

      var css_x = '';

      if(item.player.team == item.player.game.first_team)
        css_x = 'left';
      else
        css_x = 'right';

      var css = {};
      css[css_x] = item.x + "px";
      css['bottom'] = item.y + "px";

      item_in_dom.css(css);

      item.t++;

    }, 22, this);
  };
};