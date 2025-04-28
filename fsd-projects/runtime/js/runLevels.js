var runLevels = function (window) {
  window.opspark = window.opspark || {};

  var draw = window.opspark.draw;
  var createjs = window.createjs;
  let currentLevel = 0;

  window.opspark.runLevelInGame = function (game) {
    // some useful constants
    var groundY = game.groundY;

    // this data will allow us to define all of the
    // behavior of our game
    var levelData = window.opspark.levelData;

    // set this to true or false depending on if you want to see hitzones
    game.setDebugMode(true);

    // TODOs 5 through 11 go here
    // BEGIN EDITING YOUR CODE HERE

    function createSawBlade(inputx, inputy) {
      var hitZoneSize = 25;
      var damageFromObstacle = 10;
      var sawBladeHitZone = game.createObstacle(hitZoneSize, damageFromObstacle);
      sawBladeHitZone.x = inputx;
      sawBladeHitZone.y = inputy;
      game.addGameItem(sawBladeHitZone);
      var obstacleImage = draw.bitmap("img/sawblade.png");
      sawBladeHitZone.addChild(obstacleImage);
      obstacleImage.x = -25;
      obstacleImage.y = -25;
    };

    createSawBlade(430, 320);
    createSawBlade(1364, 290);
    createSawBlade(736, 270);
    
    function createEnemy() {
      var enemy = game.createGameItem("enemy", 25);
      var redSquare = draw.rect(50, 50, "red");
      redSquare.x = -25;
      redSquare.y = -25;
      enemy.addChild(redSquare);
      enemy.x = 400;
      enemy.y = groundY - 50;
      game.addGameItem(enemy);

      enemy.velocityx = 10;
      enemy.rotationalVelocity = 20;
      enemy.onPlayerCollision = function () {
        game.changeIntegrity(-10)
      };
      enemy.onProjectileCOllision = function () {
        game.increaseScore(100);
        enemy.fadeOut();
      };
    }

    createEnemy(400, groundY - 10);
    createEnemy(800, groundY - 100);
    createEnemy(1200, groundY - 50);

    function createReward () {
      var reward = game.createGameItem('reward', 25);
      var yellowSquare = draw.rect(50, 60, "yellow");
      yellowSquare.x = -25;
      yellowSquare.y = -25;
      reward.addChild(yellowSquare);
    }

    function startLevel() {
      // TODO 13 goes below here



      //////////////////////////////////////////////
      // DO NOT EDIT CODE BELOW HERE
      //////////////////////////////////////////////
      if (++currentLevel === levelData.length) {
        startLevel = () => {
          console.log("Congratulations!");
        };
      }
    }
    startLevel();
  };
};

// DON'T REMOVE THIS CODE //////////////////////////////////////////////////////
if (
  typeof process !== "undefined" &&
  typeof process.versions.node !== "undefined"
) {
  // here, export any references you need for tests //
  module.exports = runLevels;
}
