const container = document.querySelector('.container');
const questionBox = document.querySelector('#question');
const choicesBox = document.querySelector('#choices');
const next = document.querySelector('#next');
const submit = document.querySelector('#submit');
const answer = document.querySelector('#answer');


let quiz = []

const fetchQuestions = async () => {
    const response = await  fetch("https://opentdb.com/api.php?amount=10&category=10&difficulty=easy&type=multiple")
    const json = await response.json();
    quiz = json.results

    showQuestions(quiz)
}

let currentQuestionIndex = 0;


const showQuestions = (quiz) => {
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

const displayAnswer = () => {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    answer.innerHTML = selectedOption.value
}

const nextQuestion = () => {
    currentQuestionIndex++
    showQuestions(quiz)
}


fetchQuestions()
