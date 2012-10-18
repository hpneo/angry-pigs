Player = function(game, team) {
  this.game = game;
  this.team = team;
  this.items = [];

  for(var i = 0; i < this.game.items_per_player; i++) {
    this.items.push(new Item(this, i));
  }

  this.getEnemy = function() {
    var team_index = this.game.teamToIndex(this.team);
    var enemy_team;
    var enemy = undefined;
    if(team_index == 0)
      enemy_team = 1;
    else
      enemy_team = 0;

    var items = this.game.players[enemy_team].items;

    for(var i = 0; i < items.length; i++) {
      if(items[i].destroyed === false) {
        enemy = items[i];
        break;
      }
    }

    return enemy;
  }

  //angles: between 24 - 32

  this.prepareItem = function() {
    var enemy = this.getEnemy();
    for(var i = 0; i < this.items.length; i++) {
      if(!this.items[i].destroyed) {
        var strategy = this.game.getStrategy(this.game.level, enemy.index, i);

        this.items[i].angle = strategy.angle;
        this.items[i].v0 = strategy.v0;

        return this.items[i];
      }
    }
  };
};