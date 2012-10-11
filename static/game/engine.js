Game = function() {
  this.items_per_player = 3;
  this.items_destroyed = [0, 0];
  this.first_team = 'birds';
  this.second_team = 'pigs';
  this.players = [new Player(this, this.first_team), new Player(this, this.second_team)];
  this.current_item = null;
  this.x1 = 0;
  this.y1 = 0;
  this.x2 = 0;
  this.y2 = 0;
  this.level = 0;
  this.finished = false;

  this.finishGame = function() {
    this.finished = true;
  }

  this.initGame = function() {
    for(var i = 0; i < this.players.length; i++) {
      for(var j = 0; j < this.players[i].items.length; j++) {
        $("#" + this.players[i].items[j].id).css({
          bottom : '105px',
          opacity : 1
        });
      }
    }
  }

  this.updateScores = function(item) {
    var team_index;
    if(item.player.team == this.first_team)
      team_index = 0;
    else if(item.player.team == this.second_team)
      team_index = 1;
    
    this.items_destroyed[team_index] += 1;

    if(team_index == 0)
      counter = $(".player_info:eq(1) .count");
    else if(team_index == 1)
      counter = $(".player_info:eq(0) .count");

    if(!this.finished)
      counter.text(this.items_destroyed[team_index]);
  }

  this.angle = function() {
    var m = (this.y2 - this.y1) / (this.x2 - this.x1);

    return Math.abs(Math.atan(m) * 180 / Math.PI);
  }
  this.distance = function() {
    return Math.sqrt(Math.pow((this.x2 - this.x1), 2) + Math.pow(this.y2 - this.y1, 2)) * 1.5;
  }

  this.next_player = function() {
    if(this.current_player.team == this.first_team)
      this.current_player = this.players[1];
    else
      this.current_player = this.players[0];

    return this.current_player;
  }

  this.checkForWinner = function() {
    if(this.items_destroyed[0] == this.items_per_player)
      this.winner = this.second_team;
    else if(this.items_destroyed[1] == this.items_per_player)
      this.winner = this.first_team;

    if(this.winner){
      this.finishGame();
      $('body').append("<h1 id=\"winner\">" + this.winner + " won!</h1>");
      $('#winner').delay(100).animate({
        opacity: 0.9,
        top: 160,
        easing: 'easeInOutElastic'
      }, 600);
    }
  }

  this.randomValue = function(from, to) {
    return Math.floor(Math.random()*(to-from+1)+from);
  }

  Game.init_events(this);
};