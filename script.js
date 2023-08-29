const container = document.querySelector('.container');
const questionBox = document.querySelector('#question');
const choicesBox = document.querySelector('#choices');
const timer = document.querySelector('#timer');
const next = document.querySelector('#next');
const submit = document.querySelector('#submit');
const answer = document.querySelector('#answer');
const form = document.querySelector("#registration-form")
const questionOptions= document.querySelector("#questionOptions")
const finalScore= document.querySelector("#finalScore")


let quiz = []
const fetchQuestions = async (e) => {
    e.preventDefault()
    console.log(1);

    var numberOfQuestions = document.getElementById('number-question').value;
    var level = document.querySelector('input[name="level"]:checked').value;
    var questionCategory = document.querySelector('input[name="category"]:checked').value;
    try {
        const response = await  fetch('https://opentdb.com/api.php?amount='+ numberOfQuestions + ' &category= ' + questionCategory + '&difficulty=' + level +'&type=' + 'multiple')
        const json = await response.json();
        console.log(json);
        quiz = json.results
        
        form.classList.add('hidden')
        questionOptions.classList.remove('hidden')
        showQuestions(quiz)  
        startTimer()
    } catch (error) {
        console.log(error);
    }
}

document.getElementById("registerButton").addEventListener("click", fetchQuestions);

var startcountdown = null
let currentQuestionIndex = 0;
let timeleft = 20
var paused = false;
var showSubmit=true
var showNext = false

const startTimer = () =>{
    clearInterval(startcountdown)
    const countdown = () => {
        if(paused != true){
            timeleft--
        }
        timer.textContent = timeleft
        if (timeleft==0){
            displayAnswer()
            // nextQuestion()
        }
    }
    startcountdown = setInterval(countdown,1000)
}


const showQuestions = (quiz) => {

    timeleft = 20
    paused=false;
    submit.classList.remove('hidden')
    next.classList.add("hidden")

    const questionDetails = quiz[currentQuestionIndex];
    questionBox.innerHTML = questionDetails.question;

    const randomNumber = Math.floor(Math.random() * 3);
    questionDetails.incorrect_answers.splice(randomNumber, 0, questionDetails.correct_answer);

    choicesBox.textContent = "";
    questionDetails.incorrect_answers.forEach(option => {
        const label = document.createElement('label');
        const radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.name = 'option';
        radioButton.value = option;
        label.appendChild(radioButton);

        var childElement = document.createElement('span');
        childElement.innerHTML = option
        label.appendChild(childElement);

        choicesBox.appendChild(label);

    });
}

var score = 0
const displayAnswer = () => {
    
    // console.log(document.querySelector('#choices').children[0].children[0].value)
    paused = true
    const selectedOption = document.querySelector('input[name="option"]:checked');
    
    if (selectedOption?.value == quiz[currentQuestionIndex].correct_answer){
        score++
        selectedOption?.parentElement.classList.add("bg-green")
    }else{
        for(let i=0 ; i<4;i++){
            if(quiz[currentQuestionIndex].correct_answer == choicesBox.children[i].children[0].value ){
                choicesBox.children[i].classList.add('bg-green')
            }
        }
        selectedOption?.parentElement.classList.add("bg-red")
    }
    // answer.innerHTML = selectedOption?.value + " " + score

    submit.classList.add('hidden')
    next.classList.remove("hidden")
}

const nextQuestion = () => {
    if (currentQuestionIndex < quiz.length-1){
        currentQuestionIndex++
        showQuestions(quiz)
    } else{
        timer.classList.add('hidden')
        questionOptions.classList.add('hidden')
        finalScore.innerHTML = "Your score : " + score + " / " + quiz.length
        clearInterval(startcountdown)
    }
}


// fetchQuestions()
