$(function () {
  // initialize canvas and context when able to
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  window.addEventListener("load", loadJson);

  function setup() {
    if (firstTimeSetup) {
      halleImage = document.getElementById("player");
      projectileImage = document.getElementById("projectile");
      cannonImage = document.getElementById("cannon");
      $(document).on("keydown", handleKeyDown);
      $(document).on("keyup", handleKeyUp);
      firstTimeSetup = false;
      //start game
      setInterval(main, 1000 / frameRate);
    }

    // Create walls - do not delete or modify this code
    createPlatform(-50, -50, canvas.width + 100, 50); // top wall
    createPlatform(-50, canvas.height - 10, canvas.width + 100, 200, "navy"); // bottom wall
    createPlatform(-50, -50, 50, canvas.height + 500); // left wall
    createPlatform(canvas.width, -50, 50, canvas.height + 100); // right wall

    //////////////////////////////////
    // ONLY CHANGE BELOW THIS POINT //
    //////////////////////////////////

    // TODO 1 - Enable the Grid
    //toggleGrid();

    // TODO 2 - Create Platforms
    //createPlatform(x,y,width,height);
    createPlatform(230, 240, 20, 380);
    createPlatform(100, 615, 150, 20);
    createPlatform(190, 510, 40, 20);
    createPlatform(0, 410, 40, 20);
    createPlatform(190, 290, 40, 20);
    createPlatform(230, 240, 480, 20);
    createPlatform(860, 160, 80, 20);
    createPlatform(890, 180, 20, 240);
    createPlatform(340, 400, 20, 340);
    createPlatform(330, 0, 20, 140);
    createPlatform(440, 120, 120, 140);
    createPlatform(640, 0, 20, 140);
    createPlatform(1090, 240, 40, 20);
    createPlatform(1090, 260, 20, 80);
    createPlatform(1090, 340, 320, 20);
    createPlatform(1280, 140, 80, 20);
    createPlatform(350, 400, 560, 20);
    createPlatform(980, 380, 20, 80);
    createPlatform(980, 460, 160, 20);
    createPlatform(900, 360, 100, 20);
    createPlatform(1120, 480, 20, 60);
    createPlatform(1220, 360, 20, 180);
    createPlatform(350, 610, 100, 20);
    createPlatform(1350, 610, 50, 20);
    createPlatform(600, 540, 60, 20);
    createPlatform(775, 540, 60, 20);

    // TODO 3 - Create Collectables
    createCollectable("max", 140, 510);
    createCollectable("max", 400, 320);
    createCollectable("max", 480, 70);
    createCollectable("max", 1300, 90);
    createCollectable("max", 1280, 400);
    createCollectable("max", 590, 300, 1, 0.7);
    createCollectable("max", 390, 670);
    createCollectable("steve", 800, 480);

    // TODO 4 - Create Cannons

    createCannon("top", 180, 1200);
    createCannon("top", 450, 1520);
    createCannon("top", 660, 1530);
    createCannon("right", 780, 1140);

    //////////////////////////////////
    // ONLY CHANGE ABOVE THIS POINT //
    //////////////////////////////////
  }

  registerSetup(setup);
});
