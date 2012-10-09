Item = function(player, index) {
  this.player = player;
  this.index = index;
  this.id = this.player.team + "_" + this.index;
  this.gravity = 9.81;
  this.t = 0;
  this.angle = 0;
  this.v0 = 0;
  this.x = 90 * (this.index) + 50;
  this.y = 105;

  this.rad = function(degrees) {
    return (degrees / 180) * Math.PI;
  };

  this.time = function() {
    return (this.t / 1000) * 3.5;
  };

  this.ratio = function() {
    return 200 + (1.1 * Math.abs(this.angle - 45));
  };

  this.vx = function() {
    var radians = this.rad(this.angle);

    return this.v0 * Math.cos(radians) - 3.5;
  };

  this.vy = function() {
    var radians = this.rad(this.angle);

    return this.v0 * Math.sin(radians);
  };

  this.position_x = function() {
    return this.x + (this.vx() * this.time()) - 1.85;
  };

  this.position_y = function() {
    return this.y + (this.vy() * this.time()) - (this.gravity * Math.pow(this.time(), 2) * 0.5) * this.ratio();
  };

  this.find_collisions = function() {
    var team_index;
    if(this.player.team == game.first_team)
      team_index = 1;
    else
      team_index = 0;

    var items = this.player.game.players[team_index].items;
    
    for(var i=0; i < items.length; i++) {
      (function(current_item, item){
        if(current_item.collides_with(item)){
          item.destroy();
        }
      })(this, items[i]);
    }
  };

  this.collides_with = function(item) {
    return $('#' + this.id).hittest('#' + item.id);
  };

  this.destroy = function() {
    var id = this.id;
    var self = this;
    window.setTimeout(function(){
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
          if(self.player.team == self.player.game.first_team)
            self.player.game.items_destroyed[0] += 1;
          else if(self.player.team == self.player.game.first_team)
            self.player.game.items_destroyed[1] += 1;

          self.player.game.checkForWinner();
        }
      });
    }, 10);
  };

  this.fly = function() {
    var item_in_dom = $('#' + this.id);
    var interval = window.setInterval(function(item) {
      item.x = item.position_x(item.x);
      item.y = item.position_y(item.y);

      if(item.t > 2) {
        if(parseInt(item.y) <= 105) {
          item.y = 105;
          window.clearInterval(interval);
          item.find_collisions();
          window.setTimeout(function(){
            item.destroy();
          }, 800);
        }
      }

      var css_x = '';

      if(item.player.team == game.first_team)
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