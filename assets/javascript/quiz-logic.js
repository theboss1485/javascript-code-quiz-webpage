function countdown(){

    arrayIndexes = populateArray();

    secondsRemaining = 75;
    questionsRemaining = 10;

    timer.textContent = "Timer: " + secondsRemaining;
        
    secondsRemaining--;

    interval = setInterval(function(){

        
        
        possibleTimerStop();


        

    }, 1000)

    

    generateQuestion();
    
}

function possibleTimerStop(){
    if(secondsRemaining <= 0){
        secondsRemaining = 0;
        clearInterval(interval)
        enterHighScore();
    } else if(questionsRemaining !== 0){

        secondsRemaining--;

    }

    timer.textContent = "Timer: " + secondsRemaining; 

}

function generateQuestion(){

    var introduction = document.getElementById("introduction")

    if(introduction.classList.contains("display-block")){ 
    
        introduction.classList.remove("display-block");
        introduction.classList.add("display-none");
    }

    

    questionAndAnswers.classList.remove("display-none");
    questionAndAnswers.classList.add("display-block");

    var randomNumberBetweenZeroAndOne = Math.random();
    var randomNumberUpToArrayLength = (Math.floor(randomNumberBetweenZeroAndOne * arrayIndexes.length));

    questionId = arrayIndexes[randomNumberUpToArrayLength];
    var removalIndex = arrayIndexes.indexOf(questionId);
    arrayIndexes.splice(removalIndex, 1);
    document.getElementById("question").textContent = quizQuestions[questionId].question;
    
    for(var answerCounter = 1; answerCounter <= 4; answerCounter++){
            document.getElementById("answer-" + answerCounter).textContent = quizQuestions[questionId].choices[answerCounter - 1];
    }
    
    questionsRemaining--;
}

function populateArray(){
    arrayIndexes = [];
    for(var counter = 0; counter < quizQuestions.length; counter++){
        arrayIndexes.push(counter);
    }

    return arrayIndexes;
}

function answerClicked(event){
    var correct = false;
    if(event.currentTarget){
        if (event.currentTarget === answerOneButton){
            if(answerOneButton.textContent === quizQuestions[questionId].answer){
                correct = true;
            } 
    
        } else if(event.currentTarget === answerTwoButton){
            if(answerTwoButton.textContent === quizQuestions[questionId].answer){
                correct = true;
            } 

        } else if(event.currentTarget === answerThreeButton){
            if(answerThreeButton.textContent === quizQuestions[questionId].answer){
                correct = true;
            } 

        } else if(event.currentTarget === answerFourButton){
            if(answerFourButton.textContent === quizQuestions[questionId].answer){
                correct = true;
            }
        } 

        if(correct === false){
            secondsRemaining -= 10;
        }
    }

    

    if(correct === true){
        validation.textContent = "Correct!";
    } else {
        validation.textContent = "Wrong!"
    }

    if(validation.classList.contains("display-none")){
        validation.classList.add("display-block");
    }

    setTimeout(fadeOut, 1000);
    removeFadeOut();
    

    if(questionsRemaining > 0){
        generateQuestion();
    } else {
        possibleTimerStop();
        
        if(secondsRemaining > 0){
            enterHighScore();
            clearInterval(interval)
        }
    }
}

function enterHighScore(){

    var finalScore = document.getElementById("final-score");

    enterInitials.classList.add("display-block");
    finalScore.classList.add("display-block");



    if(secondsRemaining >= 0){
        finalScore.textContent = "Your final score is " + secondsRemaining;
    }
    
    questionAndAnswers.classList.remove("display-block")
    questionAndAnswers.classList.add("display-none");

}

function testLetters(letters){

    const regex = /^[a-zA-Z]+$/;

        if(regex.test(letters) === false){
            return false;
        }
    
    return true;
}

function highScoreEntered(){

    var letters = document.getElementById("initials-textbox").value;

    var errorMessage =  document.getElementById("error-message");

    //The first part of this condition was given to me by the Xpert Learning Assistant chatbot.
    if (testLetters(letters) === false || (letters.length !== 3 && letters.length !== 4)){

        errorMessage.style.color = "red";
        errorMessage.textContent = "Error!  Please enter 3 or 4 alphabetical characters!";

    } else {

        enterInitials.classList.remove("display-block");
        enterInitials.classList.add("display-none");
    
        var jsonScoreArray = JSON.parse(localStorage.getItem("scores"));
        if(jsonScoreArray === null){
            var scoreArray = [];
        } else{
            var scoreArray = jsonScoreArray;
        }
        
        letters = letters.toUpperCase();
        

        var score = {initials: letters, score: secondsRemaining};
        scoreArray.push(score);

        // This Xpert Learning Assistant AI Chatbot helped me write this lambda expression.
        scoreArray.sort((a, b) => {

            if(a.score === b.score){
                return a.initials.localeCompare(b.initials);
            } else{
                return b.score - a.score;
            }

        });
        localStorage.setItem("scores", JSON.stringify(scoreArray));
        displayHighScores()
    }
}

function displayHighScores(){

    /*This if-else condition makes sure that if the scoreboard is already displayed on the screen,
    nothing happens when the View High Scores button is clicked.*/
    if(scoreboard.classList.contains("display-none")){

        if(introduction.classList.contains("display-block")){
            introduction.classList.remove("display-block");
            introduction.classList.add("display-none");
    
        }
    
        if(questionAndAnswers.classList.contains("display-block")){
            questionAndAnswers.classList.remove("display-block");
            questionAndAnswers.classList.add("display-none");
        }
    
        if(enterInitials.classList.contains("display-block")){
            enterInitials.classList.remove("display-block");
            enterInitials.classList.add("display-none");
        }
    
        var scoreArray = JSON.parse(localStorage.getItem("scores"));
    
        if(scoreArray === null){
            scoreArray = [];
        }
    
        var existingElement = undefined;
    
        if(scoreArray.length === 0){

            //This is a check just to make sure the Clear High Scores button doesn't display if there are no scores.
            if(clearHighScoresButton.style.display !== "none"){

                clearHighScoresButton.style.display = "none";
            }
    
            noScoresText.classList.remove("display-none");
            noScoresText.classList.add("display-block");
        
        } else {
    
            clearHighScoresButton.style.display = "inline";
    
            for(counter = 0; counter < scoreArray.length; counter++){
            
            var scoreTag = document.createElement("p")
            scoreTag.textContent = scoreArray[counter].initials + " - " + scoreArray[counter].score;
    
            if(counter === 0){
    
                existingElement = document.getElementById("high-scores-heading");
    
            } else {
    
                existingElement = document.getElementById("score-" + counter);
                
            }
    
            scoreTag.id = "score-" + (counter + 1);
            scoreTag.classList.add("score-class");
            
            existingElement.insertAdjacentElement("afterend", scoreTag);
            
            }
    
            if(noScoresText.classList.contains("display-block")){
                noScoresText.classList.remove("display-block");
                noScoresText.classList.add("display-none");
            }
        }
    
    
        
        
        scoreboard.classList.remove("display-none");
        scoreboard.classList.add("display-block");
    }



}

function goBack(){

    scoreboard.classList.remove("display-block");
    scoreboard.classList.add("display-none");

    noScoresText.classList.add("display-block");
    noScoresText.classList.remove("display-none");

    introduction.classList.add("display-block");
    introduction.classList.remove("display-none");

    removeScoresFromPage();


   

}

function clearHighScores(){
    localStorage.removeItem("scores");
    removeScoresFromPage();

    
    noScoresText.classList.remove("display-none");
    noScoresText.classList.add("display-block");

    clearHighScoresButton.style.display = "none";
    
}

function removeScoresFromPage(){
     // The Xpert Learning Assistant Chatbot the code for the rest of this function.
     var scoreboard = document.getElementById("scoreboard");
     var scoreboardParagraphs = scoreboard.querySelectorAll('.score-class');
 
     scoreboardParagraphs.forEach(element => {
         element.remove();
     });
}

//The Xpert Learning Assistant gave me the code for this function.
function fadeOut(){

    validation.classList.add("fadeOut");
}

function removeFadeOut(){

    validation.classList.remove("fadeOut");
}
    
    


var beginButton = document.getElementById("begin-button");
var answerOneButton = document.getElementById("answer-1");
var answerTwoButton = document.getElementById("answer-2");
var answerThreeButton = document.getElementById("answer-3");
var answerFourButton = document.getElementById("answer-4");
var submitInitialsButton = document.getElementById("submit-initials");
var timer =  document.getElementById("timer");
var goBackButton = document.getElementById("go-back-button");
var clearHighScoresButton = document.getElementById("clear-high-scores-button");
var noScoresText = document.getElementById("no-scores-text");

var scoreboard = document.getElementById("scoreboard");
var validation = document.getElementById("validation-string")
var viewHighScoresButton = document.getElementById("view-high-scores-button");

var introduction = document.getElementById("introduction");
var questionAndAnswers = document.getElementById("question-and-answers");
var enterInitials = document.getElementById("enter-initials");


beginButton.addEventListener("click", countdown);
answerOneButton.addEventListener('click', answerClicked);
answerTwoButton.addEventListener('click', answerClicked);
answerThreeButton.addEventListener('click', answerClicked);
answerFourButton.addEventListener('click', answerClicked);
submitInitialsButton.addEventListener('click', highScoreEntered);
goBackButton.addEventListener('click', goBack);
clearHighScoresButton.addEventListener('click', clearHighScores);
viewHighScoresButton.addEventListener('click', displayHighScores);



var arrayIndexes = null;
var scores = [];
var questionId = 0;
var questionsRemaining = 0;
var interval = undefined;
var secondsRemaining = 0;

// if(localStorage.getItem("scores") === null){
//     var jsonScores = JSON.stringify(scores);
//     localStorage.setItem("scores", jsonScores);
// }