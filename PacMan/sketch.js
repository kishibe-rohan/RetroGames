/*2D grid representing the game maze

0-  BARRIER
1 - FOOD
3 - POWER PELLET
4 - GHOST
5 - PACMAN 

*/


const GRID = 
[
    "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0",
    "0,1,1,1,1,1,1,3,1,1,1,1,1,1,1,1,1,1,1,0",
    "0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,3,0,0,0",
    "0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0",
    "0,1,1,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0",
    "0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0",
    "0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0",
    "0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0",
    "0,0,0,0,0,0,1,1,0,0,1,0,0,1,1,0,0,0,0,0",
    "0,1,1,1,1,1,1,1,0,4,1,4,0,1,1,1,1,3,1,0",
    "0,1,1,1,1,3,1,1,0,4,1,4,0,1,1,1,1,1,1,0",
    "0,0,0,0,0,0,1,1,0,1,0,0,0,1,1,0,0,0,0,0",
    "0,1,1,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0",
    "0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0",
    "0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0",
    "0,1,1,1,1,1,1,1,1,1,5,1,1,1,1,1,1,1,1,0",
    "0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0",
    "0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0",
    "0,1,1,1,1,3,1,1,1,1,1,1,1,1,1,1,1,3,1,0",
    "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0",
  ];

  var grid = [];
  var ghosts = [];

  var pacman;
  var score;
  var endScore;

  function setup()
  {
      createCanvas(480,600);
      score = 0;
      grid = createGrid();
  }

  function draw()
  {
      background(51);
      drawTiles();

      for(var i=0;i<ghosts.length;i++)
      {
          ghosts[i].update();
          ghosts[i].draw();
      }

      pacman.update();
      pacman.draw();

      movePacman();
  }

  //move pacman according to player input
  function movePacman()
  {
      
  if (keyIsDown(UP_ARROW)) {

    pacman.move(0, -1, true);
  } else if (keyIsDown(DOWN_ARROW)) {

    pacman.move(0, 1, true);
  } else if (keyIsDown(LEFT_ARROW)) {

    pacman.move(-1, 0, true);
  } else if (keyIsDown(RIGHT_ARROW)) {

    pacman.move(1, 0, true);
  }
  }

  //draw food and power-pellets
  function drawTiles()
  {
     for(var i=0;i<grid.length;i++)
     {
         if(grid[i].active)
         {
             if(grid[i].type!= "GHOST" && grid[i].type!= "PACMAN")
             grid[i].draw();
         }
     }

     //show score
        noStroke();
        fill(255);
        textSize(30);
        textFont('Helvetica');
        textAlign(LEFT);
        text(score, 5, height - 5);
  }


  //check if player lost or won
  function endGame(won)
  {
    textSize(60);
    fill(255);
    textAlign(CENTER);
    stroke(0);
    strokeWeight(5);

    if(won)
    {
       
            fill(255,0,0);
            text("You win!", width / 2, height / 2);
            disp -=200;

    }else {

        text("You lose!", width / 2, height / 2);
        textSize(50);
        text("Try Again!!", width / 2, height / 2 + 50);
      }

     
    
      noLoop();
}

//generate game maze according to tile types
    function createGrid()
    {
        var maze = [];  
        var ghostId = 0;

        for(var i=0;i<GRID.length;i++)
        {
            var row = GRID[i].split(",");
            for(var j=0;j<row.length;j++)
            {
                var type = TYPES[row[j]];
                var tile = new Tile(j,i,type,-1);

                switch(type)
                {
                    case "PACMAN":
                        pacman = tile;
                        maze.push(new Tile(j,i,"OPEN"));
                        break;

                    case "GHOST":
                        var behavior = (ghostId%4) +1;
                        ghosts.push(new Tile(j,i,type,behavior));
                        maze.push(new Tile(j,i,"OPEN"));
                        ghostId++;
                        break;

                    case "BARRIER":
                        maze.push(tile);
                        break;

                    case "FOOD":
                        endScore+=10;
                        maze.push(tile);
                        break;
                    
                    case "POWER PELLET":
                            endScore++;
                            maze.push(tile);
                            break;

                }
            }
        }

        return maze;
    }


    