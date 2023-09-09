// This function starts the countdown at the beginning of each quiz
function countdown(){
    displayHighScoresTimerFlag = 0;

    arrayIndexes = populateArray();

    secondsRemaining = 75;
    questionsRemaining = 10;

    timer.textContent = "Timer: " + secondsRemaining;
        

    interval = setInterval(function(){

        possibleTimerStop();

    }, 1000)

    

    generateQuestion();
    
}

// This function determines whether to stop the timer each time said timer ticks down.
function possibleTimerStop(){

    /* I set the condition of secondsRemaining <= 1 here to avoid the case where, if the timer hit zero, the system would wait 
    one additional second before displaying the elements for the user to enter his or her score.*/
    if(secondsRemaining <= 1){
        secondsRemaining = 0;
        clearInterval(interval);

        if(displayHighScoresTimerFlag === 0){
            enterHighScore();
        }
        
    } else if(questionsRemaining !== 0){

        secondsRemaining--;

    }

    timer.textContent = "Timer: " + secondsRemaining; 

}

// This function displays a question and its answers on the screen.
function generateQuestion(){

    var introduction = document.getElementById("introduction");

    if(introduction.classList.contains("display-block")){ 
    
        introduction.classList.remove("display-block");
        introduction.classList.add("display-none");
    }

    questionAndAnswers.classList.remove("display-none");
    questionAndAnswers.classList.add("display-block");

    var randomNumberBetweenZeroAndOne = Math.random();
    var randomNumberUpToArrayLength = (Math.floor(randomNumberBetweenZeroAndOne * arrayIndexes.length));

    /* Each time a question is asked, the question ID of that question is removed from the array of indexes, 
    so that questions don't get duplicated.*/
    questionId = arrayIndexes[randomNumberUpToArrayLength];
    var removalIndex = arrayIndexes.indexOf(questionId);
    arrayIndexes.splice(removalIndex, 1);
    document.getElementById("question").textContent = quizQuestions[questionId].question;
    
    for(var answerCounter = 1; answerCounter <= 4; answerCounter++){
            document.getElementById("answer-" + answerCounter).textContent = quizQuestions[questionId].choices[answerCounter - 1];
    }
    
    questionsRemaining--;
}

/* This function populates an array with indexes of each question.  This is for keeping track of which questions 
have been asked so that they don't duplicate.*/
function populateArray(){
    arrayIndexes = [];
    for(var counter = 0; counter < quizQuestions.length; counter++){
        arrayIndexes.push(counter);
    }

    return arrayIndexes;
}

// This function is called each time an answer to a question is clicked.
function answerClicked(event){
    
    var correct = false;
    if(event.currentTarget.textContent === quizQuestions[questionId].answer){
        correct = true;
    } 

    if(correct === false){
        secondsRemaining -= 10;
    }
    

    
    /* If the answer is correct, the screen displays "Correct!" in green.
    Otherwise, "Wrong!" is displayed in red.*/
    if(correct === true){

        validation.textContent = "Correct!";

        if(validation.classList.contains("red")){

            validation.classList.remove("red");

        }
        
        validation.classList.add("green");

    } else {

        validation.textContent = "Wrong!"

        if(validation.classList.contains("green")){

            validation.classList.remove("green");
        }

        validation.classList.add("red");
    }

    if(validation.classList.contains("display-none")){

        validation.classList.add("display-block");
    }

    /* When the system displays the text saying "Correct!" or Wrong!", it fades out shortly
    thereafter thanks to the following two functions.*/
    setTimeout(fadeOut, 1000);
    removeFadeOut();
    

    // If no questions remain (out of 10), or the timer is at zero, the system stops the timer.
    if(questionsRemaining > 0){
        generateQuestion();
    } else {
        possibleTimerStop();
        
        if(secondsRemaining >= 0){
            enterHighScore();
            clearInterval(interval);
        }
    }
}

// This function displays the form allowing the user to enter his or her high score.
function enterHighScore(){

    if(errorMessage.textContent !== ""){
        errorMessage.textContent = "";
    }

    document.getElementById("initials-textbox").value = "";

    var finalScore = document.getElementById("final-score");

    enterInitials.classList.add("display-block");
    finalScore.classList.add("display-block");



    if(secondsRemaining >= 0){
        finalScore.textContent = "Your final score is " + secondsRemaining;
    }
    
    questionAndAnswers.classList.remove("display-block")
    questionAndAnswers.classList.add("display-none");

}

/* This function tests the initials the user entered to make sure they are alphabetical characters.
The Xpert Learning Assistant chatbot basically gave me the regular expression.*/
function testLetters(letters){

    const regex = /^[a-zA-Z]+$/;

        if(regex.test(letters) === false){
            return false;
        }
    
    return true;
}

/* This function is called when the user enters a score.  It calls the testLetters() function to do 
validation on the entered initials, and it also converts the score to JSON to be put into persistant storage. */
function highScoreEntered(){

    if(secondsRemaining > 0){
        secondsRemaining = 0;
        timer.textContent = "Timer: " + secondsRemaining;
    }

    // The validation text element is hidden so that the scoreboard will be closer to the top of the page.
    validation.classList.add("display-none");
    validation.classList.remove("display-block");

    var letters = document.getElementById("initials-textbox").value;

    if (testLetters(letters) === false || (letters.length !== 3 && letters.length !== 4)){

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

        /* The Xpert Learning Assistant AI Chatbot helped me write this lambda expression.  It sorts the score array
        so that it will be displayed in descending order on the scoreboard.*/
        scoreArray.sort((a, b) => {

            if(a.score === b.score){
                return a.initials.localeCompare(b.initials);
            } else{
                return b.score - a.score;
            }

        });
        localStorage.setItem("scores", JSON.stringify(scoreArray));
        displayHighScoresFlag = 1

        displayHighScores();
    }
}

// This function displays the scoreboard when the user enters a score or clicks the "View High Scores" button.
function displayHighScores (){

    // If Display High Scores is clicked in the middle of a quiz, the timer resets to zero.
    if(secondsRemaining !== 0){
        secondsRemaining = 0;
    }
    

    displayHighScoresTimerFlag = 1;

    var localScores = localStorage.getItem("scores")

    if(localScores !== null){

        var scoresInLocalStorage = localScores.split("},{").length;
        
    }

    var scoresOnPage = document.getElementById("scoreboard").querySelectorAll(".score-class").length;



    
/*This condition removes the scores from the page if the the scores don't exist in local storage, or the scores on the page don't match those in local storage.
This helps the application be more resiliant across multiple tabs.  The other two conditions exist because I was hunting for a solution to display everything properly.  */
    if(localStorage.getItem("scores") === null || (scoresInLocalStorage !== scoresOnPage) || ((displayHighScoresFlag === 1) && (noScoresText.classList.contains("display-block")))){
            
        removeScoresFromPage();
    }
    
    /*This if-else condition makes sure that if the scoreboard is already displayed on the screen,
    nothing happens when the View High Scores button is clicked.*/
    if(scoreboard.classList.contains("display-none") || scoresInLocalStorage !== scoresOnPage){

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
    
            clearHighScoresButton.style.display = "inline";
    
            for(counter = 0; counter < scoreArray.length; counter++){
            
            var scoreTag = document.createElement("p");
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

            if(scoresInLocalStorage === 0 || scoresInLocalStorage === undefined){

                noScoresText.classList.remove("display-none");
                noScoresText.classList.add("display-block");
                clearHighScoresButton.style.display = "none";

            } else {

                noScoresText.classList.remove("display-block");
                noScoresText.classList.add("display-none");
            }
    
        scoreboard.classList.remove("display-none");
        scoreboard.classList.add("display-block");
    }
}

/*This function takes the user back to the screen screen when he or she clicks the "Go Back" button after entering a score.*/
function goBack(){

    scoreboard.classList.remove("display-block");
    scoreboard.classList.add("display-none");

    noScoresText.classList.add("display-block");
    noScoresText.classList.remove("display-none");

    introduction.classList.add("display-block");
    introduction.classList.remove("display-none");

    if(noScoresText.classList.contains("display-none")){
        removeScoresFromPage();
    }
}

// This function is called when the user clicks the button to clear the high scores.  It calls the removeScoresFromPage() function.
function clearHighScores(){
    localStorage.removeItem("scores");
    removeScoresFromPage();

    noScoresText.classList.remove("display-none");
    noScoresText.classList.add("display-block");

    clearHighScoresButton.style.display = "none";
    
}

/*This function actually takes the scores off of the page. */
function removeScoresFromPage(){

     // The Xpert Learning Assistant Chatbot helped me with the code for the rest of this function.
     var scoreboard = document.getElementById("scoreboard");
     var scoreboardParagraphs = scoreboard.querySelectorAll('.score-class');
 
     scoreboardParagraphs.forEach(element => {
         element.remove();
     });
}

/*The Xpert Learning Assistant gave me the code for this function.  It allows the "Correct!" and "Wrong!" text
to fade out when the user clicks on an answer to a question.*/  
function fadeOut(){

    validation.classList.add("fade-out");
}

function removeFadeOut(){

    validation.classList.remove("fade-out");
}
    
var beginButton = document.getElementById("begin-button");
var errorMessage =  document.getElementById("error-message");
var answerOneButton = document.getElementById("answer-1");
var answerTwoButton = document.getElementById("answer-2");
var answerThreeButton = document.getElementById("answer-3");
var answerFourButton = document.getElementById("answer-4");
var submitInitialsButton = document.getElementById("submit-initials");
var timer =  document.getElementById("timer");
var goBackButton = document.getElementById("go-back-button");
var clearHighScoresButton = document.getElementById("clear-high-scores-button");
var noScoresText = document.getElementById("no-scores-text");
var displayHighScoresFlag = 0;
var displayHighScoresTimerFlag = 0;

var scoreboard = document.getElementById("scoreboard");
var validation = document.getElementById("validation-string");
var viewHighScoresButton = document.getElementById("view-high-scores-button");

var introduction = document.getElementById("introduction");
var questionAndAnswers = document.getElementById("question-and-answers");
var enterInitials = document.getElementById("enter-initials");
var answers = document.getElementById("answers");

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
