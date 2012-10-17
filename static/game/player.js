Player = function(game, team) {
  this.game = game;
  this.team = team;
  this.items = [];

  for(var i = 0; i < this.game.items_per_player; i++) {
    this.items.push(new Item(this, i));
  }

  //angles: between 24 - 32

  this.prepareItem = function() {
    for(var i = 0; i < this.items.length; i++) {
      if(!this.items[i].destroyed) {
        var strategy = this.game.getStrategy(this.game.level, this.game.randomValue(0, 2), i);

        this.items[i].angle = strategy.angle;
        this.items[i].v0 = strategy.v0;

        return this.items[i];
      }
    }
  };
};