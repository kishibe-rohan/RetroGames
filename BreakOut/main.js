const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const reset = document.querySelector(".reset");

canvas.width = 500;
canvas.height = 500;

//generate and draw bricks
var brickRows = 3;
var brickCols = 5;
var brickWidth = 70;
var brickHeight = 20;
var brickPadding = 20;
var brickOffsetTop = 30;
var brickOffsetLeft = 35;

var bricks = [];


//generate 2-D grid of bricks
function generateBricks()
{
    for(let c=0;c<brickCols;c++)
    {
        bricks[c] = [];
        for(let r = 0;r<brickRows;r++)
        {
            bricks[c][r] = {x:0,y:0,status:1};  //new brick object
        }
    }
}

function drawBricks()
{
    for(var c=0;c<brickCols;c++)
    {
        for(var r=0;r<brickRows;r++)
        {
            if(bricks[c][r].status ===1)  //is intact
            {
               var brickX = c * (brickWidth+brickPadding) + brickOffsetLeft;
               var brickY = r * (brickHeight+brickPadding) +brickOffsetTop;
               bricks[c][r].x = brickX;
               bricks[c][r].y = brickY;

               ctx.beginPath();
               ctx.rect(brickX,brickY,brickWidth,brickHeight);
               ctx.fillStyle = "rgba(0,0,0,1)";
               ctx.fill();
               ctx.strokeStyle="rgba(255,255,0,1)";
               ctx.strokeRect(brickX,brickY-2,brickWidth+2,brickHeight+2);
               ctx.closePath();
            }
        }
    }
}

//generateBricks();
//drawBricks();




let rightPressed = false;
let leftPressed = false;

//get player input
document.addEventListener("keydown",keyDownHandler);
document.addEventListener("keyup",keyUpHandler);

function keyDownHandler(e)
{
    if(e.key=="Right" || e.key =="ArrowRight")
    rightPressed = true;
    else if(e.key == "Left" || e.key =="ArrowLeft")
    leftPressed = true;
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = false;
    }
  }

reset.addEventListener("click",()=>{
    score = 0;
    drawBricks();
})

let score = 0;

//show score 
function drawScore()
{
   ctx.font = "16px Arial";
   ctx.fillStyle = "#ffffff";
   ctx.fillText("Score:" +score,8,20);
}

let speed = 5;    //tweak to set difficulty

//the ball object
let ball={
    x:canvas.height /2,
    y:canvas.height - 50,
    dx:speed,
    dy: 1-speed,
    radius:7,
    draw:function()
    {
        ctx.beginPath()
        ctx.fillStyle = "#ff0000";
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
        ctx.fill()
        ctx.closePath()
       
    }

}

//the paddle object

let paddle = {
    height:10,
    width:70,
    x:canvas.width/2 - 70/2,
    draw:function()
    {
        ctx.beginPath()
        ctx.rect(this.x,canvas.height - this.height,this.width,this.height)
        ctx.fillStyle = "#ffff00";
        ctx.fill();
        ctx.closePath()
    }
}

//function to move the paddle as per player input
function movePaddle()
{
    if(rightPressed)
    {
        paddle.x += 7;  //move right

        //boundary check
        if(paddle.x + paddle.width > canvas.width)
        {
            paddle.x = canvas.width - paddle.width;
        }
    }else if(leftPressed)
    {
        paddle.x -= 7;  //move left
        //boundar check
        if(paddle.x < 0)
        {
            paddle.x = 0;
        }
    }
}

//function to check collision with bricks,update score
function collisionDetection()
{
    for(var c=0;c<brickCols;c++)
    {
        for(var r=0;r<brickRows;r++)
        {
            var b = bricks[c][r];
            if(b.status ==1)  //if intact
            {
              if(ball.x>=b.x && 
                ball.x <= b.x+brickWidth &&
                ball.y >= b.y && ball.y <= b.y + brickHeight)
                {
                    ball.dy *= -1;
                    b.status = 0;
                    score++;
                }
            }
        }
    }
}

//function for game logic and rendering
function play()
{

    //draw everything to the screen
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawBricks();
    ball.draw();
    paddle.draw();
    movePaddle();
    collisionDetection();
    drawScore();

    //move the ball
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    //reverse ball direction based on wall collisions
    if(ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0)
    {
        ball.dx *= -1;
    }

    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius <0)
    {
        ball.dy *= -1;
    }

    //reset if game over
    if(ball.y + ball.radius > canvas.height)
    {
        score = 0;
        generateBricks();
        ball.dx = speed;
        ball.dy = 1 -speed;
    }

    //bounce off paddle
    if(ball.x >= paddle.x 
        && ball.x <= paddle.x + paddle.width
        && ball.y + ball.radius >= canvas.height - paddle.height)
        {
            ball.dy *= -1;
        }

       requestAnimationFrame(play); 
}

generateBricks()
play()