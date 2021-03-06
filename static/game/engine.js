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
  this.y2 = 0
  this.level = 0;
  this.finished = false;
  this.second_team_x = [50, 140, 230];
  this.first_team_x = [1206, 1156, 1106];
  this.strategy = new Strategy(this);

  this.getStrategy = function(level, first_team_index, second_team_index) {
    switch(level) {
      case 0:
        console.log('random');
        return this.strategy.random(first_team_index, second_team_index);
      break;
      case 1:
        console.log('minMax');
        return this.strategy.minMax(first_team_index, second_team_index);
      break;
      case 2:
        console.log('bestMove');
        return this.strategy.bestMove(first_team_index, second_team_index);
      break;
    }
  }

  this.f = function(first_team_index, second_team_index) {
    return (this.first_team_x[first_team_index] - this.second_team_x[second_team_index]) / 0.0525;
  }

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

  this.teamToIndex = function(team) {
    var team_index;
    if(team == this.first_team)
      team_index = 0;
    else if(team == this.second_team)
      team_index = 1;

    return team_index;
  }

  this.updateLives = function(item) {
    var team_index = this.teamToIndex(item.player.team);

    counter = $(".player_info:eq(" + team_index + ") .lives");

    counter.html(item.player.items.map(function(item) { return item.lives; }));
  };

  this.updateScores = function(item) {
    var team_index = this.teamToIndex(item.player.team);
    
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
      $.ajax({
        url : "/create_rating",
        type : "POST",
        data : {
          rating : {
            player : 'Birds',
            points : this.items_destroyed[1]
          }
        },
        success : function(data) {
          if(data)
            console.log(data);
        }
      });
    }
  }

  this.randomValue = function(from, to) {
    return Math.floor(Math.random()*(to-from+1)+from);
  }

  Game.init_events(this);
};