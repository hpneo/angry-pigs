Player = function(game, team) {
  this.game = game;
  this.team = team;
  this.items = [];

  for(var i = 0; i<game.items_per_player; i++) {
    this.items.push(new Item(this, i));
  }

  //angles: between 24 - 32

  this.prepareItem = function() {

    var angle = this.game.randomValue(24, 32);
    var v0 = this.game.randomValue(270, 290);

    //angle + v0 == 300

    for(var i = 0; i < this.items.length; i++) {
      if(!this.items[i].destroyed) {
        this.items[i].angle = angle;
        this.items[i].v0 = v0;
        return this.items[i];
      }
    }
  };
};