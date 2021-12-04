
function pickRandomIndex(min=0, max = 5) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function sequenceChecker( wrd ){

    if (!word) {
        return ''
    }


    const rightSequence = {
        'HLMT': 'HTML',
        'EXTT': 'TEXT',
        'STIL': 'LIST',
        'DRIG': 'GRID',
        'DROW': 'WORD',
        'DEON': 'NODE',
        'DEOC': 'CODE',
        'GLAN': 'LANG',
        'MEAG': 'GAME'
    };

    return rightSequence[wrd];
}


function wordPicker(){
    const wordsList = ['HLMT', 'EXTT', 'STIL', 'DRIG', 'DROW', 'DEON', 'DEOC', 'GLAN', 'MEAG'];

    const word = wordsList[pickRandomIndex(0, wordsList.length -1)]
    return word;
}

function gameSuccess () {
    const remainingBoxes = document.querySelectorAll('.pick-box .box');

    return !remainingBoxes.length;
}

function rightOrder(data, target) {
    const word = window.word;
    const rightOrder = sequenceChecker(word);
    const boxCount = data.slice(data.length -1) || 0;
    const currentLetter = word[boxCount];


    const currentDropPosition = target.getAttribute('data');
    return rightOrder[currentDropPosition] === currentLetter
}


function onDrop(e) {
    e.preventDefault();
    if (e && e.dataTransfer) {
        var data = e.dataTransfer.getData('text');
    }
    else {
        data = previousTarget;
    }

    if (rightOrder(data, e.target)) {
        e.target.appendChild(document.getElementById(data));
        e.target.classList.add("complete");

        if (gameSuccess()) {
            //show success message
            document.querySelector('.won-msg').classList.remove('hide');
            document.querySelector('.lost-msg').classList.add('hide');
            //hide timer if game finished
            
            clearAllTimers();
        }

        previousTarget = null;

    }

    e.target.classList.remove('highlight')



    return false;

}

function onDragOver (e) {
    e.preventDefault()
}

let previousTarget = null;

function dragStart(e) {
    if (e && e.dataTransfer) {
        e.dataTransfer.setData('text', e.target.id);
        return
    }

    //remove all existing highlights
    const allHighlights = document.querySelectorAll('.highlight');
    allHighlights.forEach(i => {
        i.classList.remove('highlight');
    });
    //adds highlight to the current element 
    e.target.classList.add('highlight')
    previousTarget =  e.target.id;
}

function generateBoxes() {
    const word = window.word = wordPicker();
    const wordArray = word.split('');

    const leftContainer = document.querySelector('.pick-box');
    leftContainer.innerHTML = '';
    wordArray.forEach((word, i) => {
        const wrapper = document.createElement('div');
        const box = document.createElement('div');
        box.classList.add('box');
        box.setAttribute('id', 'box-' + i);
        box.setAttribute("draggable", 'true');
        box.addEventListener('dragstart', dragStart)
        box.addEventListener('mousedown', dragStart)
        box.addEventListener('touchstart', dragStart)
        box.innerText = word;
        leftContainer.appendChild(wrapper);
        wrapper.appendChild(box);

    });

    const rightContainer = document.querySelector('.drop-box');

    rightContainer.innerHTML = '';
    wordArray.forEach((item, i) => {
        const box = document.createElement('div');
        box.classList.add('box');
        box.setAttribute('data', i);
        box.setAttribute("droppable", 'true');
      
        box.addEventListener('drop', onDrop);
        // supporting touch events
        box.addEventListener('mouseup', onDrop);
        box.addEventListener('touchend', onDrop);
        box.addEventListener('click', onDrop);

        box.addEventListener('dragover', onDragOver)

        rightContainer.appendChild(box);

    });
}

let timeout;
let interval;
function startTimer(){
    const allowedLimit = 20 * 1000;

    let remainingTime = allowedLimit;
    showTimer();

    interval = setInterval( () => {
        remainingTime = remainingTime - 100;
        document.querySelector('.time').innerText = remainingTime;

        if (remainingTime > 8000) {
            document.querySelector('.time').style.color = 'black';
            document.querySelector('.time').style.fontWeight = 400;
        }
        if (remainingTime < 8000) {
            document.querySelector('.time').style.color = 'red';
            document.querySelector('.time').style.fontWeight = 600;
        }

        if (remainingTime < 100) {
            clearInterval(interval);
            document.querySelector('.time').innerText = '';
            hideTimer();
        }
    }, 100);

    timeout = setTimeout( endGame, allowedLimit);
}

function hideTimer() {
    document.querySelector('.timer').classList.remove('show');
    document.querySelector('.timer').classList.add('hide'); 
}

function showTimer() {
    document.querySelector('.timer').classList.remove('hide');
    document.querySelector('.timer').classList.add('show');
}

function clearAllTimers() {
    clearInterval(interval);
    clearTimeout(timeout);
    hideTimer();
}

function startGame() {
    clearAllTimers();
    document.querySelector('.won-msg').classList.add('hide');
    document.querySelector('.won-msg').classList.remove('show');

    document.querySelector('.lost-msg').classList.add('hide');
    document.querySelector('.lost-msg').classList.remove('show');
    document.querySelector('.game-zone').classList.remove('disabled');

    generateBoxes();
    startTimer();
}

function disableGame(){
    document.querySelector('.game-zone').classList.add('disabled');
}

function endGame () {
    //disable game section
    //show you loose

    if (!gameSuccess()) {
        disableGame();
        document.querySelector('.lost-msg').classList.remove('hide');
        document.querySelector('.lost-msg').classList.add('show');
        clearAllTimers();
    }
}

$().ready(() => {
    $('#start-btn').on('click', startGame);
});
