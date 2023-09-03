document.getEventListner('DomContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue',
    ]

    //Teriominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ]

    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]

    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]

    const iTetromino = [
       [1,width+1,width*2+1,width*3+1], 
       [width,width+1,width+2,width+3],
       [1,width+1,width*2+1,width*3+1],
       [width,width+1,width+2,width+3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, oTetromino, tTetromino]

    let currentPosition = 4
    let currentRotation = 0

    console.log(theTetrominoes[0][0])

    //Randomly choose a Tetromino and its 1st rotation
    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]

    //draw the Tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroudColor = colors[random]


        })
    }

    //undraw the Tetriomino
    function undraw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('totromino')
            squares[currentPosition + index].style.backroundColor = ''
        })
    }

    //The assigining of fuctions to keyCodes
    function control(e) {
        if(e.keyCode === 37) {
            moveLeft()
        }else if (e.keyCode === 38){
            rotate()
        }else if (e.keyCode === 39){
            moveRight()
        }else if (e.keyCode === 40){
            moveDown()
        }
    }
    document.addEventListener('keyup', control)

    //The move down funtion
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    //The freeze funtion
    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //start a new tetriomino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }

    }

    //moving the tetriominoes to the right unless it is on the edge or if they are blocked
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
        if(!isAtRightEdge) currentPosition +=1
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -=1
        }
        draw()
    }

    ///The funtion that fixes the rotation of the tetriominoes at its Edges
    function isAtRight() {
        return current.some(index => (currentPosition + index + 1) % width === 0)
    }

    function isAtLeft() {
        return current.some(index => (currentPosition + index) % width === 0)
    }

    function checkRotatedPosition(P){
        P = P || currentPosition  //get current position. Check if the piece is near the left side
        if ((P+1) % width < 4) {
            if (isAtRight()){
                currentPosition += 1
                checkRotatedPosition(P)
            }
        }
        else if (P % width > 5){
            if (isAtLeft()) {
                currentPosition -= 1
                checkRotatedPosition(P)
            }
        }
    }


    //rotate the retromino
    function rotate() {
        undraw()
        currentRotation ++
        if(currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        checkRotatedPosition()
        draw()
    }


    //show up-next tetromino in the mini-grid dispaly
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0

    // the  Tetraminoes without rotation
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2],
        [0, displayWidth, displayWidth+1, displayWidth*2+1],
        [1, displayWidth, displayWidth+1, displayWidth+1],
        [0, 1, displayWidth, displayWidth+1],
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
    ]

    //display the shape in the mini-grid display
    function displayShape() {
        displayShape.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroudColor = '' 
        })
        upNextTetrominoes[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroudColor = colors[nextRandom]
        })
    }

    //funtionality for the start and pause button
    startBtn.addEventListener('click', () =>{
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else{
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
        }
    })

    //ADD score
    function addScore() {
        for (let i =0; i < 199; i +=width){
            const row = [i, i+1, i+2, i+3, i+4, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score +=10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroudColor = ''
                })
                const squaresRemoved = squares.splice(1, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    //game over
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
        scoreDisplay.innerHTML = 'end'
        clearInterval(timerId)
    }



})