Player = function(game, team) {
  this.game = game;
  this.team = team;
  this.items = [];

  for(var i=0; i<game.items_per_player; i++) {
    this.items.push(new Item(this, i));
  }
};