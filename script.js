const container = document.querySelector('.container');
const questionBox = document.querySelector('#question');
const choicesBox = document.querySelector('#choices');
const timer = document.querySelector('#timer');
const next = document.querySelector('#next');
const submit = document.querySelector('#submit');
const answer = document.querySelector('#answer');
const form = document.querySelector("#registration-form")
const questionNo = document.querySelector("#questionNo")
const questionOptions= document.querySelector("#questionOptions")
const finalScore= document.querySelector("#finalScore")
const playAgain = document.querySelector('#playAgain')
const result = document.querySelector('#result')

    
const usernameError = document.querySelector("#username-error");
const emailError = document.querySelector("#email-error");
const questionError = document.querySelector("#question-error");
const formErrorsInput = document.querySelectorAll('#registration-form  input')


document.getElementById("registerButton").addEventListener("click", function (event) {
    event.preventDefault(); 

    const userName = document.querySelector("#user-name").value;
    const email = document.querySelector("#email").value;
    const numQuestions = document.querySelector("#number-question").value;

    usernameError.textContent=""
    emailError.textContent=""
    questionError.textContent=""
    

    if (userName === "" || email === "" ||  numQuestions === "" ) {
        if(userName === ""){
            usernameError.textContent="* username cannot be left blank"
        }
        if(email === ""){
            emailError.textContent="* email cannot be left blank"
        }
        if(numQuestions === ""){
            questionError.textContent="* question cannot be left blank"
        }
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.match(emailPattern)) {
        emailError.textContent="* Please enter a valid email"
        return;
    }

    if (parseInt(numQuestions) < 5) {
        questionError.textContent="* Minimum of 5 questions must be selected.";
        return;
    }


    fetchQuestions()
});


let quiz = []
var startcountdown = null
let currentQuestionIndex = 0;
let timeleft = 20
var paused = false;
var showSubmit=true
var showNext = false
var submited=false
var score = 0

const fetchQuestions = async () => {
    var numberOfQuestions = document.getElementById('number-question').value;
    var level = document.querySelector('#level-select').value;
    var questionCategory = document.querySelector('#category-select').value;
    try {
        const response = await  fetch('https://opentdb.com/api.php?amount='+ numberOfQuestions + ' &category= ' + questionCategory + '&difficulty=' + level +'&type=' + 'multiple')
        const json = await response.json();
        quiz = json.results
        
        form.classList.add('hidden')
        questionOptions.classList.remove('hidden')
        showQuestions(quiz)  
        startTimer()
    } catch (error) {
        document.querySelector('#error').textContent(error)
    }
}

const startTimer = () =>{
    clearInterval(startcountdown)
    const countdown = () => {
        if(paused != true){
            timeleft--
        }
        timer.textContent = timeleft
        if (timeleft==0 && !submited){
            displayAnswer(false)
            // nextQuestion()
        }
    }
    startcountdown = setInterval(countdown,1000)
}

const showQuestions = (quiz) => {
    timer.textContent=20
    submit.setAttribute('disabled', true)
    paused=false;
    submited=false

    submit.classList.remove('hidden')
    next.classList.add("hidden")

    questionNo.innerHTML = "Question " + (currentQuestionIndex+1)

    const questionDetails = quiz[currentQuestionIndex];
    questionBox.innerHTML = questionDetails.question;

    const randomNumber = Math.floor(Math.random() * 3);
    questionDetails.incorrect_answers.splice(randomNumber, 0, questionDetails.correct_answer);

    choicesBox.textContent = "";
    var selectedOption = null;
    questionDetails.incorrect_answers.forEach(option => {
        const label = document.createElement('label');
        label.classList.add('choice')
        const radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.name = 'option';
        radioButton.value = option;
        label.appendChild(radioButton);

        var childElement = document.createElement('span');
        childElement.innerHTML = option
        label.appendChild(childElement);

        choicesBox.appendChild(label);

        label.addEventListener('mouseover', function() {
            if( ! submited){
                label.style.border = '2px solid #007bff'; 
                label.style.cursor = "pointer"
            }else{
                label.style.cursor = 'default'
            }
        });
        label.addEventListener('mouseout', function() {
            label.style.border = ''; 
        });

        
        radioButton.addEventListener('click', ()=>{
            if ( ! submited){

                submit.removeAttribute('disabled')

                selectedOption?.parentElement.classList.remove('selected')
                selectedOption = document.querySelector('input[name="option"]:checked');
                selectedOption?.parentElement.classList.add('selected')
            }
        })
    });
}
const displayAnswer = (sub) => {
    submited = true
    paused = true
    const selectedOption = document.querySelector('input[name="option"]:checked');
    selectedOption?.parentElement.classList.remove('selected')
    
    if (selectedOption?.value == quiz[currentQuestionIndex].correct_answer){
        if (sub) {
            score++
        }
        selectedOption?.parentElement.classList.add("bg-green")
    }else{
        for(let i=0 ; i<4;i++){
            if(quiz[currentQuestionIndex].correct_answer == choicesBox.children[i].children[0].value ){
                choicesBox.children[i].classList.add('bg-green')
            }
        }
        sub && selectedOption?.parentElement.classList.add("bg-red")
    }
    submit.classList.add('hidden')
    next.classList.remove("hidden")
}

const nextQuestion = () => {
    timeleft = 20
    if (currentQuestionIndex < quiz.length-1){
        currentQuestionIndex++
        showQuestions(quiz)
    } else{
        questionOptions.classList.add('hidden')
        result.classList.remove('hidden')
        finalScore.innerHTML =  + score + " / " + quiz.length
        clearInterval(startcountdown)
    }
}


playAgain.addEventListener('click',()=>{

    result.classList.add('hidden')
    form.classList.remove('hidden')
    currentQuestionIndex = 0
    score = 0
})