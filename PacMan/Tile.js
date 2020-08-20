const TYPES = 
[
    "BARRIER",
    "FOOD",
    "OPEN",
    "POWER PELLET",
    "GHOST",
    "PACMAN"
];


var blink = 200;
const GRID_SIZE = 20;
const TILE_SIZE = 25;

//constructor for tile based on position,type,ghost 
function Tile(x,y,type,behavior)
{
    this.x = x;
    this.y = y;
    this.type = type;

    this.destination = (-1,1);  
    this.moving = false;
    this.active = true;    //not eaten?

    if(this.type == "PACMAN")
    {
        this.speed = 0.3;        //change according to preferred difficulty
    }
    else
    this.speed = 0.1;
   
    this.behavior = behavior;  //for ghosts
    //this.chasing = true;
}

//pacman movement and ghost "AI"

Tile.prototype.update = function()
{
    if(!this.active)
    return;

    if(this.moving)  
    {
        //linear interpolate based on destination
        this.x = lerp(this.x,this.destination.x,this.speed);
        this.y = lerp(this.y,this.destination.y,this.speed);

        //calculate distance from destination
       
		var distanceX = Math.abs(this.x - this.destination.x);
		var distanceY = Math.abs(this.y - this.destination.y);

        if (distanceX < 0.1 && distanceY < 0.1) { // round to the nearest position

            this.x = this.destination.x;
            this.y = this.destination.y;
            this.moving = false;
        }

        
    }

    //pacman eating 
    if(this.type == "PACMAN")
    {
        var currTile = getTile(Math.floor(this.x),Math.floor(this.y));
        if(currTile.active)
        {
            switch(currTile.type)
            {
                
        case "FOOD":
            score++;	// eat
            currTile.active = false; //eaten
            break;
  
          case "POWER PELLET":
            score += 10;	
            currTile.active = false;
            break;
            }
        }

        if(this.score >= endScore)
        {
            endGame(true);
        }
       
    }

    //handle ghost movements
    else if(this.type == "GHOST")
    {
        
        if(this.moving)
        return;
 

        var possibleMoves = [
            getTile(this.x - 1, this.y),	// left
            getTile(this.x + 1, this.y),	// right
            getTile(this.x, this.y - 1),	// top
            getTile(this.x, this.y + 1),	// bottom
          ];

        if(this.behavior == 1 || this.behavior ==3)
        {
            var edistance = dist(pacman.x,pacman.y,this.x,this.y);

            if(edistance < 0.3)   //pacman ran into a ghost
            endGame(false);
     
            possibleMoves.sort(function(a,b)
            {
                var aD = dist(a.x, a.y, pacman.x, pacman.y);
                var bD = dist(b.x, b.y, pacman.x, pacman.y);
          
                return aD - bD;
            });

            for(var i=0;i<possibleMoves.length;i++)
            {
              if(this.move(possibleMoves[i].x,possibleMoves[i].y,false))
              break;
            }
            
        }
        else if(this.behavior == 2 || this.behavior ==4)
        {
            var mdistance  = sqrt((pacman.x-this.x)*(pacman.x-this.x) +(pacman.y-this.y)*(pacman.y-this.y));
            if(mdistance < 0.5)
            endGame(false);

            possibleMoves.sort(function(a,b)
            {
                var aD = sqrt((pacman.x-a.x)*(pacman.x-a.x) +(pacman.y-a.y)*(pacman.y-a.y));
                var bD = sqrt((pacman.x-b.x)*(pacman.x-b.x) +(pacman.y-b.y)*(pacman.y-b.y));
          
                return aD - bD;
            });

            for(var i=0;i<possibleMoves.length;i++)
            {
              if(this.move(possibleMoves[i].x,possibleMoves[i].y,false))
              break;
            }
        }
    }  
}

Tile.prototype.draw = function()
{
    switch(this.type)
    {
        case "BARRIER":
            strokeWeight(5);
            stroke(0);
            fill(0,0,255);
            rect(this.x*TILE_SIZE,this.y*TILE_SIZE,TILE_SIZE,TILE_SIZE);
            break;

        case "FOOD":
            ellipseMode(CORNER);
            noStroke();
            fill("#FFFF00");
            ellipse(this.x *TILE_SIZE + TILE_SIZE/3,this.y * TILE_SIZE +TILE_SIZE/3,TILE_SIZE/3);
            break;

        case "POWER PELLET":
            ellipseMode(CORNER);
            stroke(255);
            strokeWeight(2);
            if(blink == 200)
            {
                fill("#FF2222");
                blink -= 200;
            }else if(blink ==0)
            {
                fill(0);
                blink += 200;
            }
            ellipse(this.x * TILE_SIZE + TILE_SIZE/4, this.y * TILE_SIZE + TILE_SIZE/4, TILE_SIZE/2);
            break;
        
        case "PACMAN":

                ellipseMode(CORNER);
                stroke("#FFFF00");
                strokeWeight(5);
                fill("#FFFF33");
                ellipse(this.x * TILE_SIZE + TILE_SIZE/4, this.y * TILE_SIZE +TILE_SIZE/4, TILE_SIZE/2);
                break;

        case "GHOST":
            ellipseMode(CORNER);
            if(this.behavior == 1)
                fill("(#FF0000");
            else if(this.behavior == 2)
                fill("#FFB8FF");
            else if(this.behavior == 3)
                fill("#00FFFF");
            else  if(this.behavior == 4)
                fill("#FFB852");  
            noStroke();
            ellipse(this.x * TILE_SIZE + TILE_SIZE/4, this.y * TILE_SIZE + TILE_SIZE/4, TILE_SIZE/2);
            break;
            
    }
}

Tile.prototype.move = function(x,y,relative)
{
    if(this.moving)   //already in motion?
    return false;

    var destX,destY;

    if(relative)
    {
        destX = this.x + x;
        destY = this.y + y;
    }else{
        destX = x;
        destY = y;
    }

    var destTile = getTile(destX,destY);
    var type = destTile.type;

    //prevent running into each other
    if ((type == "BARRIER" && this.type != "BARRIER") || 	// only certain tiles may
      (type == "GHOST" && this.type == "GHOST")) 				// move to other certain tiles
    return false; 

    this.moving = true;  //begin moving
    this.destination = createVector(destX ,destY);

    return true;
}

//get tile with given co-ordinates
function getTile(x,y)
{
    return grid[y*GRID_SIZE +x];
}