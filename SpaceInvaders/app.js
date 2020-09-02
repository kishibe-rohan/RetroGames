document.addEventListener('DOMContentLoaded', () => {

  //select DOM elements
    const squares = document.querySelectorAll('.grid div')
    const resultDisplay = document.querySelector('#result')
    let width = 15
    let currentShooterIndex = 202
    let currentShooterleftIndex = 201
    let currentShooterrightIndex = 203
    let currentShooterupIndex = 187
    let currentInvaderIndex = 0
    let alienInvadersTakenDown = []   //track the number of invaders killed
    let result = 0
    let direction = 1  //movement of invaders(left/right)
    let invaderId
    
  
    //define the alien invaders
    const alienInvaders = [             //index of invaders on the grid
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15,16,17,18,19,20,21,22,23,24,
        30,31,32,33,34,35,36,37,38,39
      ]
  
    //draw the alien invaders
    alienInvaders.forEach( invader => squares[currentInvaderIndex + invader].classList.add('invader'))
  
    //draw the shooter
    squares[currentShooterIndex].classList.add('shooter')
    squares[currentShooterleftIndex].classList.add('shooter')
    squares[currentShooterrightIndex].classList.add('shooter')
    squares[currentShooterupIndex].classList.add('shooter')
  
    //move the shooter along a line horizontally
    function moveShooter(e) {
      squares[currentShooterIndex].classList.remove('shooter')
      squares[currentShooterleftIndex].classList.remove('shooter')
      squares[currentShooterrightIndex].classList.remove('shooter')
      squares[currentShooterupIndex].classList.remove('shooter')
      switch(e.keyCode) {
        case 37:
          if(currentShooterleftIndex % width !== 0)
          {
            currentShooterleftIndex -= 1
            currentShooterrightIndex -= 1
            currentShooterupIndex -= 1
            currentShooterIndex -= 1
            break
          } 
        case 39:
          if(currentShooterrightIndex % width < width - 1)
          {
            
                currentShooterleftIndex += 1
                currentShooterrightIndex += 1
                currentShooterupIndex += 1
                currentShooterIndex += 1
                break
              } 
          
         
      }

      squares[currentShooterIndex].classList.add('shooter')
      squares[currentShooterleftIndex].classList.add('shooter')
      squares[currentShooterrightIndex].classList.add('shooter')
      squares[currentShooterupIndex].classList.add('shooter')
    }

    document.addEventListener('keydown', moveShooter)
  
    //move the alien invaders
    function moveInvaders() {
      const leftEdge = alienInvaders[0] % width === 0         //check if hits left edge
      const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1  //check if hits right edge
  

      //reverse direction as per edge hit
        if((leftEdge && direction === -1) || (rightEdge && direction === 1)){
          direction = width
        } else if (direction === width) {
        if (leftEdge) direction = 1
        else direction = -1
        }

        //move the aliens down 
        for (let i = 0; i <= alienInvaders.length - 1; i++) {
          squares[alienInvaders[i]].classList.remove('invader')
        }
        for (let i = 0; i <= alienInvaders.length - 1; i++) {
        
                alienInvaders[i] += direction;
                
        
          
        }
        for (let i = 0; i <= alienInvaders.length - 1; i++) {
        //ADD IF ALIVE LATER
          if (!alienInvadersTakenDown.includes(i)){
            squares[alienInvaders[i]].classList.add('invader')
          }
        }
  
        //check if alien collides with the shooter? Game Over
      if(squares[currentShooterupIndex].classList.contains('invader', 'shooter')) {
        resultDisplay.textContent = 'Game Over'
        squares[currentShooterIndex].classList.add('boom')
        clearInterval(invaderId)
      }
  
      //aliens reached vertical end of the screen? Game Over
      for (let i = 0; i <= alienInvaders.length - 1; i++){
        if(alienInvaders[i] > (squares.length - (width -1))){
          resultDisplay.textContent = 'Game Over'
          clearInterval(invaderId)
        }
      }
  
      //ADD LATER
      if(alienInvadersTakenDown.length === alienInvaders.length) {
        console.log(alienInvadersTakenDown.length)
        console.log(alienInvaders.length)
        resultDisplay.textContent = 'You Win'
        clearInterval(invaderId)
      }
    }
    invaderId = setInterval(moveInvaders, 500)
  
    //shoot at aliens
    function shoot(e) {
      let laserId
      let currentLaserIndex = currentShooterupIndex
      //move the laser from the shooter to the alien invader
      function moveLaser() {
        squares[currentLaserIndex].classList.remove('laser')
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add('laser')

        //check if shot an alien
        if(squares[currentLaserIndex].classList.contains('invader')) {
          squares[currentLaserIndex].classList.remove('laser')
          squares[currentLaserIndex].classList.remove('invader')
          squares[currentLaserIndex].classList.add('boom')
  
          setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 250)
          clearInterval(laserId)
  
          const alienTakenDown = alienInvaders.indexOf(currentLaserIndex)
          alienInvadersTakenDown.push(alienTakenDown)
          result++
          resultDisplay.textContent = result
        }
  
        if(currentLaserIndex < width) {
          clearInterval(laserId)
          setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100)
        }
      }
      
      switch(e.keyCode) {
        case 32:
          laserId = setInterval(moveLaser, 100)
          break
      }
    }
  
    document.addEventListener('keyup', shoot)
  })
  