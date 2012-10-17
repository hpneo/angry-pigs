Strategy = function(game) {
  this.angle = 0;
  this.v0 = 0;
  this.game = game;
  this.angle_limits = [24, 30];
  this.v0_limits = [200, 230];

  this.random = function() {
    this.angle = this.game.randomValue(this.angle_limits[0], this.angle_limits[1]);
    this.v0 = this.game.randomValue(this.v0_limits[0], this.v0_limits[1]);

    return this;
  };

  this.minMax = function(first_team_index, second_team_index) {
    var base_angle = this.game.randomValue(this.angle_limits[0], this.angle_limits[1]);
    var angles = [];
    var ts = [];
    var vs = [];

    var x = [];

    for(var i = 0; i < 6; i++) {
      angles.push(base_angle + i);
    }

    for(var i = 0; i < angles.length; i++) {
      ts[i] = [];
      vs[i] = [];

      for(var j = 0; j < 6; j++) {
        vs[i][j] = this.game.randomValue(this.v0_limits[0], this.v0_limits[1]);
        ts[i][j] = [];

        for(var k = 0; k < 6; k++) {
          ts[i][j][k] = this.game.randomValue(100, 140);
        }
      }
    }

    for(var i = 0; i < angles.length; i++) {
      x[0] = Math.min.apply(Math, angles);

      for(var j = 0; j < vs[i].length; j++) {
        x[1] = Math.max.apply(Math, vs[i]);

        for(var k = 0; k < ts[i][j].length; k++) {
          x[2] = Math.min.apply(Math, ts[i][j]);
        }
      }
    }

    this.angle = x[0];
    this.v0 = x[1];

    return this;
  };

  this.bestMove = function(first_team_index, second_team_index) {
    var base_angle = this.game.randomValue(this.angle_limits[0], this.angle_limits[1]);
    var angles = [];
    var ts = [];
    var vs = [];

    var x = [];

    for(var i = 0; i < 6; i++) {
      angles.push(base_angle + i);
    }

    for(var i = 0; i < angles.length; i++) {
      ts[i] = [];
      vs[i] = [];

      for(var j = 0; j < 6; j++) {
        ts[i][j] = this.game.randomValue(100, 140);
        vs[i][j] = [];

        for(var k = 0; k < 6; k++) {
          vs[i][j][k] = this.game.randomValue(this.v0_limits[0], this.v0_limits[1]);
        }
      }
    }

    for(var i = 0; i < angles.length; i++) {
      x[i] = [];

      for(var j = 0; j < ts[i].length; j++) {
        x[i][j] = [];

        for(var k = 0; k < vs[i][j].length; k++) {
          x[i][j][k] = Math.cos((angles[i] / 180) * Math.PI) * ts[i][j] * vs[i][j][k];
        }
      }
    }

    var strategy = {
      angle : 0,
      v0 : 0
    };

    for(var i = 0; i < x.length; i++) {
      for(var j = 0; j < x[i].length; j++) {
        for(var k = 0; k < x[i][j].length; k++) {
          var diff = Math.abs(this.game.f(first_team_index, second_team_index) - x[i][j][k]);
          
          if (diff < 10) {
            strategy.angle = angles[i];
            strategy.v0 = vs[i][j][k];
            break;
          }
        }
      }
    }

    while(strategy.angle == 0 || strategy.v0 == 0) {
      console.log('bestMove')
      strategy = this.bestMove(first_team_index, second_team_index);
    }

    return strategy;
  };
};