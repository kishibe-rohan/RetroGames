var grid;
var cols;
var rows;
var w = 20;

function makeGrid(cols,rows)          //create a grid of desired number of rows,cols
{
   var grid = new Array(cols);
   for(var i=0;i<cols;i++)
   {
       grid[i] = new Array(rows);
   }

   return grid;
}


function setup()
{
    createCanvas(windowWidth,windowHeight);
    cols =floor(width/w);
    rows =floor(height/w);
    grid = makeGrid(cols,rows);

    for(var i=0;i<cols;i++)
    {
        for(var j=0;j<rows;j++)
        {
            grid[i][j] = new Cell(i,j,w);
        }
    }

     
    for(var i=0;i<cols;i++)
    {
        for(var j=0;j<rows;j++)
        {
            grid[i][j].countMines();
        }
    }

}

function draw()
{
    background(200);
    for(var i=0;i<cols;i++)
    {
        for(var j=0;j<rows;j++)
        {
            grid[i][j].show();
        }
    }

   
}

function mousePressed()        //check which cell is clicked
{
    for(var i=0;i<cols;i++)
    {
        for(var j=0;j<rows;j++)
        {
           if(grid[i][j].contains(mouseX,mouseY))
           {
               if(grid[i][j].mine)
               {
                   revealAll();         //if lost,reveal all cells
               }
               else
               grid[i][j].reveal();
           }
        }
    }
}

revealAll = function()
{
    for(var i=0;i<cols;i++)
    {
        for(var j=0;j<rows;j++)
        {
            grid[i][j].reveal();
        }
    }

    alert("You Lost!! :( Try Again!!")
}

