/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var scores, roundScore, activePlayer, gamePlaying; //it doesn't have to be defined here, it has to be declared so we can use it later 
// math.floor usuwa ulamki, * 6 daje zakres od 0 do 5, + 1 przesuwa zakres o 1 - zatem od 1 do 6
var beforeDice; // kurnaaaaa
var beforeDice2;
var customScore;
var maxScore;

init();


document.querySelector('.button').addEventListener('click', function() {
            customScore = document.getElementById('points').value;
            // if custome score jest true czyli to nie jest 0, null albo "" ktore sa COERCED to false
            if(customScore) {
              maxScore = customScore;  
            } else {
              maxScore = 100;
            }
            
            document.querySelector('.how-many-points').style.display = 'none';
            gamePlaying = true;
});
// 3. update the round score only if the number was NOT 1
    

document.querySelector('.btn-roll').addEventListener('click', function() {
    if (gamePlaying){
         // 1. random number
    var dice = Math.floor(Math.random() * 6) + 1;   
     // 2. display the result na kostce // umiescic wszystko w jednej zmiennej zamiast powtarzac selection // dajemy to w tym scope bo tylko tutaj tego potrzebujemy

   //numerek sie wygeneruje i przypisze do obrazka, dlatego dice- 
    var diceDOM = document.querySelector('.dice');
    diceDOM.style.display = 'block';
    diceDOM.src = 'dice-' + dice + '.png';
        
    var dice2 = Math.floor(Math.random() * 6) + 1;
    var dice2DOM = document.querySelector('.dice2');
    dice2DOM.style.display = 'block';
    dice2DOM.src = 'dice2-' + dice2 + '.png';    
        
       
    if (dice !== 1 && dice2 !== 1) {
        roundScore += dice + dice2;
        document.querySelector('#current-' + activePlayer).textContent = roundScore;
    } else {
          nextPlayer();
      }
        
   /* if (dice2 === 6 && beforeDice2 === 6) {
       scores[activePlayer] = 0;
        document.querySelector('#score-' + activePlayer).textContent = '0';
        twoSix(); 
    } else if (dice2 !== 1) {
        roundScore += dice2;
        document.querySelector('#current-' + activePlayer).textContent = roundScore;
    } else {
          nextPlayer();
      }            
        
    beforeDice = dice; // mozna uzyc jescze raz kiedy funkcja ruszy. kiedy funckja odda wynik (click, function), wartosc tego bedzie zgubiona. dlatego trzeba to zadeklarowac w global scope
    beforeDice2 = dice2;
   */
    }
    });       
        /*else if (dice1 === 6 && beforeDice1 !== 6) {
        roundScore += dice1;
        document.querySelector('#current-' + activePlayer).textContent = roundScore;
    } else if (dice1 === 6 && beforeDice1 === 6){
        scores[activePlayer] = 0;
        document.querySelector('#score-' + activePlayer).textContent = '0';
        twoSix(); */   
        /* else if (dice2 === 6 && beforeDice2 === 6) {
           scores[activePlayer] = 0;
           document.querySelector('#score-' + activePlayer).textContent = '0';
           twoSix();
       } */
          /* scores[activePlayer] = 0;
           document.querySelector('#score-' + activePlayer).textContent = '0';
           twoSix(); */
        

/*jesli gra jest grana - true, jesli false, nic sie nie zrobi*/

document.querySelector('.btn-hold').addEventListener('click', function() {
    if (gamePlaying) {
        // add CURRENT score to GLOBAL score
    scores[activePlayer] += roundScore; //scores = scores + roundscore
   
    // update the UI
    document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
    
         // check if the player won the game
    if (scores[activePlayer] >= maxScore) {
        document.querySelector('#name-' + activePlayer).textContent = 'WINNER!';
        document.querySelector('.dice').style.display = 'none';
        document.querySelector('.dice2').style.display = 'none';
        document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner'); //zamiast powatarzac style. i manipulowac, lepiej utworzyc osobna klase w css
        document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active'); 
        gamePlaying = false;
    } else {
        // next player
        nextPlayer();
    }
 }
    
});

document.querySelector('.btn-new').addEventListener('click', function() {
    if (gamePlaying) {
        init();
    } else {
        init();
    }
}); 
 
// nie mozna sie powtarzac
  
function nextPlayer () {
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    /* analogicznie:   if (activePlayer === 0) {
                            activePlayer = 1;
                        } else {
                            activePlayer = 0;
                        } */
       roundScore = 0;
        // zeby sie od razu wyswietlilo w interfejsie
       document.getElementById('current-0').textContent = '0';
       document.getElementById('current-1').textContent = '0';  
       
       //document.querySelector('.player-0-panel').classList.remove('active'); //bez kropki
       //document.querySelector('.player-1-panel').classList.add('active');
        document.querySelector('.player-0-panel').classList.toggle('active'); // toggle - daje albo zabiera
        document.querySelector('.player-1-panel').classList.toggle('active');
        document.querySelector('.dice').style.display = 'none';
        document.querySelector('.dice2').style.display = 'none';
}


/*
function twoSix () {
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
     analogicznie:   if (activePlayer === 0) {
                            activePlayer = 1;
                        } else {
                            activePlayer = 0;
                        } 
       roundScore = 0;
        // zeby sie od razu wyswietlilo w interfejsie
       document.getElementById('current-0').textContent = '0';
       document.getElementById('current-1').textContent = '0';  
       
       //document.querySelector('.player-0-panel').classList.remove('active'); //bez kropki
       //document.querySelector('.player-1-panel').classList.add('active');
        document.querySelector('.player-0-panel').classList.toggle('active'); // toggle - daje albo zabiera
        document.querySelector('.player-1-panel').classList.toggle('active');
        
}
*/

function init() {
    scores = [0, 0];
    activePlayer = 0;
    roundScore = 0;
    gamePlaying = false; //trzeba dodac wszedzie gdzie trzeba pamietac czy gra jest aktywna czy nieaktywna
    maxScore = 0;
    customScore = 0;
    //zmienianie CSS
document.querySelector('.dice').style.display = 'none';
document.querySelector('.dice2').style.display = 'none';    
document.querySelector('.how-many-points').style.display = 'block';
document.getElementById('points').value = 'none';
// wybieramy klase, a nie id, zawsze kropka i string
// style, kropka, property z css rowna sie value

// function call zawsze z nawiasami. jak chcemy uzyc funckji w evencie BEZ NAWIASOW, bo to event bedzie ja przywolywal
// mozna tez pisac funkcje bezposrednio w evencie, wtedy uzywa sie anonymous, funckaj bez nazwy ktora tylko tam jest i nie mozna jej uzyc poza 

document.getElementById('score-0').textContent = '0'; // bez zadnych znaczkow, sama nazwa
document.getElementById('score-1').textContent = '0';
document.getElementById('current-0').textContent = '0';
document.getElementById('current-1').textContent = '0';
document.getElementById('name-0').textContent = 'Player 1';
document.getElementById('name-1').textContent = 'Player 2';
document.querySelector('.player-0-panel').classList.remove('winner');
document.querySelector('.player-1-panel').classList.remove('winner');
document.querySelector('.player-0-panel').classList.remove('active');
document.querySelector('.player-1-panel').classList.remove('active');
document.querySelector('.player-0-panel').classList.add('active'); //wywalic wszystkie klasy i dopiero wtedy nadawac   
}
// wszystko, co zaczyna sie na poczatku gry




// document.querySelector('#current-' + activePlayer).textContent = dice; // setter - set the value

// hasztag do przywolywania id w css
// js wezmie oba formaty(type coercion) a var activeplayer ma 0 wiec current takze dostanie 0. jesli zmienie na jedynke to do string tez zoastanie przypisany 1 i losowana bedzie liczba z drugiego boxa
// text.content daje tylko plain text i implementacja HTML do js konczy sie przerzuceniem dokladnie tekstu z <> itd

// document.querySelector('#current-' + activePlayer).innerHTML = '<em>' + dice + '</em>';
// stuff z HTML musi byc w string bo inaczej js rozpatruje to jako czesc kodu, ZMIENIANIE HTML


// var x = document.querySelector('#score-0').textContent; // getter - get the value
// w ten sposob mozna zczytywac wartosci i pakowac do zmiennych

// STATE VARIABLE - TELLS CONDITION OF THE SYSTEM trzeba to zdefiniowac w global scope zeby wszyscy mieli do niej dostep


/*
YOUR 3 CHALLENGES
Change the game to follow these rules:

1. A player looses his ENTIRE score when he rolls two 6 in a row. After that, it's the next player's turn. (Hint: Always save the previous dice roll in a separate variable)
2. Add an input field to the HTML where players can set the winning score, so that they can change the predefined score of 100. (Hint: you can read that value with the .value property in JavaScript. This is a good oportunity to use google to figure this out :)
3. Add another dice to the game, so that there are two dices now. The player looses his current score when one of them is a 1. (Hint: you will need CSS to position the second dice, so take a look at the CSS code for the first one.)
*/













