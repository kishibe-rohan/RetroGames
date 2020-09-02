//select the canvas element
const canvas = document.getElementById("pong");


//methods and properties to draw on the canavs
const ctx = canvas.getContext('2d');

//Ball object
const ball ={
    x:canvas.width/2,      
    y:canvas.height/2,
    radius : 10,
    velX : 5,
    velY : 5,
    speed:7,         //tweak to chnage game difficulty
    color: "WHITE"
}

//User Paddle
const user={
    x:0,     //at the left side
    y:(canvas.height-100)/2,
    height:100,
    width:10,
    score:0,
    color:"WHITE"
}

//CPU Paddle
const cpu = {
    x:canvas.width-10,     //at the right side
    y:(canvas.height-100)/2,
    height:100,
    width:10,
    score:0,
    color:"RED"
}

//middle partition
const net = {
    x: (canvas.width -2)/2,
    y:0,
    height:10,
    width:2,
    color:"WHITE"
}

//utility function to draw rectangles
function drawRect(x,y,w,h,color)
{
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
}

//utility function to draw the ball
function drawBall(x,y,r,color)
{
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);   //draw circle
    ctx.closePath();
    ctx.fill();
}

//utility function to draw the middle net
function drawNet()
{
    for(let i=0;i<=canvas.height;i+=15)
    {
        drawRect(net.x,net.y+i,net.width,net.height,net.color);
    }
}

//utility function to show text / scores on screen
function drawText(text,x,y)
{
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text,x,y);
}

//move the player acc. to the position of the mouse
function getMousePos(e)
{
  let rect = canvas.getBoundingClientRect();
  user.y = e.clientY - rect.top - user.height/2;
}

canvas.addEventListener("mousemove",getMousePos);

//reset the ball when a player scores
function resetBall()
{
  ball.x = canvas.width/2;
  ball.y = canvas.height/2;
  ball.velX = -ball.velX;
  ball.speed=7;
  
}

//collision detection
function collision(b,p)
{
    p.top = p.y;
    p.bottom = p.y+p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y-b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left<b.right && p.top<b.bottom && p.right > b.left && p.bottom > b.top;
}


//game logic and calculations
function update()
{
    //update scores based on ball position

    if(ball.x - ball.radius < 0)   //ball goes off screen to the left
    {
        cpu.score++;
        resetBall();
    }else if(ball.x + ball.radius > canvas.width)  //ball goes off screen to the right
    {
        user.score++;
        resetBall();
    }

    //move the ball 
    ball.x += ball.velX;
    ball.y += ball.velY;

    //simple AI to move the paddle of the cpu player
    const cpuspeed = 0.05  //tweak this to change difficulty
    cpu.y += ((ball.y - (cpu.y+cpu.height/2)))*cpuspeed;

    //inverse velY if the ball hits the top or bottom part of wall
    if(ball.y - ball.radius <0 || ball.y + ball.radius > canvas.height)
    {
        ball.velY = -ball.velY;
    }

    //check whose court the ball is in
    let player = (ball.x+ball.radius < canvas.width/2)?user:cpu;

    //if ball hits a paddle
    if(collision(ball,player))
    {
        let collidePoint = (ball.y - (player.y + player.height/2)); //get the collision point

        //set the collidePoint w.r.t to player paddle
        //(-p.h/2 < collidePoint <p.h/2)
        collidePoint = collidePoint/(player.height/2);

        // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees

        let angleRad = (Math.PI/4) * collidePoint;
        

        //change the X-direction and velocity of the ball

        let direction = (ball.x + ball.radius<canvas.width/2)?1:-1;  //get current direction
        ball.velX = direction*ball.speed*Math.cos(angleRad);
        ball.velY = ball.speed * Math.sin(angleRad);

        //speed up the ball everytime it hits a paddle
        ball.speed += 0.1;       //tweak to change difficulty
    }
}

//the function that draws everything on the canavs
function render()
{

    //clear the canvas
    drawRect(0,0,canvas.width,canvas.height,"#000");

    //show user score to the left
    drawText(user.score,canvas.width/4,canvas.height/5);

    //show cpu score to the right
    drawText(cpu.score,3*canvas.width/4,canvas.height/5);

    //draw middle net,player,cpu,ball
    drawNet();
    drawRect(user.x,user.y,user.width,user.height,user.color)
    drawRect(cpu.x,cpu.y,cpu.width,cpu.height,cpu.color);
    drawBall(ball.x,ball.y,ball.radius,ball.color);
    
}

//the game loop
function game()
{
   update();
   render();
}

let fps = 50;

let loop = setInterval(game,1000/fps);