
function Cell(i,j,w)
{
    this.i=i;
    this.j=j;
    this.x = i*w;
    this.y = j*w;
    this. w = w;
    this.neighbourMines = 0;

    if(random(1) < 0.1)         //tweak to increase/decrease amount of mines
    {
        this.mine = true; 
    }
    else{
        this.mine = false;
    }
    
    this.revealed = false;
}

Cell.prototype.show = function()
{
    stroke(0);
    fill(150);
    rect(this.x,this.y,this.w,this.w);

    if(this.revealed)
    {
        if(this.mine)
        {
           
            fill(0);
            ellipse(this.x+this.w*0.5,this.y+this.w*0.5,this.w*0.5)
        }
        else{
            fill(200);
            rect(this.x,this.y,this.w,this.w);
            if(this.neighbourMines>=3)
            {
                fill(255,0,0);
                textAlign(CENTER);
                text(this.neighbourMines,this.x+this.w*0.5,this.y+this.w-6)
            }else if(this.neighbourMines<3 && this.neighbourMines>0)
            {
                fill(0,0,255);
                textAlign(CENTER);
                text(this.neighbourMines,this.x+this.w*0.5,this.y+this.w-6)
            }

        }
    }
}

Cell.prototype.contains = function(x,y)    //check if the cell is pressed
{
  return (x>this.x && x<this.x + this.w) && (y>this.y && y<this.y + this.w);
}

Cell.prototype.reveal = function()
{
    this.revealed = true;
    if(this.neighbourMines == 0 && !this.mine)
    {
        this.floodFill();
    }
}

Cell.prototype.countMines = function()           //count neighbouring mines
{
    if (this.mine) {
        return -1;
      }
      var mines = 0;
      for (var xoff = -1; xoff <= 1; xoff++) {
        var celli = this.i + xoff;
        if (celli < 0 || celli >= cols) continue;
    
        for (var yoff = -1; yoff <= 1; yoff++) {
          var cellj = this.j + yoff;
          if (cellj < 0 || cellj >= rows) continue;
    
          neighbor = grid[celli][cellj];
          if (neighbor.mine) {
            mines++;
          }
        }
      }
      this.neighbourMines = mines;

}

//floodfill neighbours if current cell has no adjacent mines
Cell.prototype.floodFill = function()
{
    for(let xoff = -1;xoff<=1;xoff++)
    {
        var celli = this.i + xoff;
        if(celli<0 || celli>=cols)
        continue;

        for(let yoff = -1;yoff<=1;yoff++)
    {
        var cellj = this.j + yoff;
        if(cellj<0 || cellj>=rows)
        continue;

        var neighbor = grid[celli][cellj];

        if(!neighbor.revealed)
        {
            neighbor.reveal();
        }

        
    }

    }
}