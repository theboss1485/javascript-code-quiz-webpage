function countdown(){
    var secondsRemaining = 75;

    document.getElementById("timer").textContent = "Timer: " + secondsRemaining;
        
    secondsRemaining--;

    interval = setInterval(function(){
        
        document.getElementById("timer").textContent = "Timer: " + secondsRemaining;
        
        

        if(secondsRemaining === 0){
            clearInterval(interval)
            enterHighScore();
            return;
            
        }

        secondsRemaining--;

    }, 1000)

    generateQuestion();
    
}

function generateQuestion(){

    var introductoryHeader = document.getElementById("introductory-header");
    var introduction = document.getElementById("introduction")

    if(introductoryHeader.style.display !== "none"  || introduction.style.display !== "none"){
        
        introductoryHeader.style.display = "none";
        introduction.style.display = "none";
    }

    document.getElementById("question-answers-and-validation-string").style.display = "block";
    var randomNumberBetweenZeroAndOne = Math.random();
        var randomNumberUpToArrayLength = (Math.floor(randomNumberBetweenZeroAndOne * quizQuestions.length));
        questionId = populateArray()[randomNumberUpToArrayLength];
        document.getElementById("question").textContent = quizQuestions[questionId].question;
        
        for(var answerCounter = 1; answerCounter <= 4; answerCounter++){
                document.getElementById("answer-" + answerCounter).textContent = quizQuestions[questionId].choices[answerCounter - 1];
        }
    
    questionsRemaining--;
}

function populateArray(){
    var arrayIndexes = [];
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
    }

    var validation = document.getElementById("validation-string")

    if(correct === true){
        validation.textContent = "Correct!";
    } else {
        validation.textContent = "Wrong!"
    }

    if(questionsRemaining > 0){
        generateQuestion();
    } else {
        clearInterval(interval);
        enterHighScore();
    }
}

function enterHighScore(){

    document.getElementById("enter-initials").style.display = "block";
    document.getElementById("question-answers-and-validation-string").style.display = "none";

}

function displayHighScores(){
    
}
    
    


var beginButton = document.getElementById("begin-button");
var answerOneButton = document.getElementById("answer-1");
var answerTwoButton = document.getElementById("answer-2");
var answerThreeButton = document.getElementById("answer-3");
var answerFourButton = document.getElementById("answer-4");
beginButton.addEventListener("click", countdown);
answerOneButton.addEventListener('click', answerClicked);
answerTwoButton.addEventListener('click', answerClicked);
answerThreeButton.addEventListener('click', answerClicked);
answerFourButton.addEventListener('click', answerClicked);

var arrayIndexes = populateArray();
var questionId = 0;
var questionsRemaining = 10;
var interval = undefined;