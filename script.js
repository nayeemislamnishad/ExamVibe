document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('noteIt').style.display = 'none';
    document.getElementById('submittext').style.display = 'none';
    document.getElementById('answerSheet').style.display = 'none';
    document.getElementById('timer').style.display = 'none';
    document.getElementById('originalMarks').style.display = 'none';
    var ddddd= document.getElementById('generatedText');
    ddddd.style.border="solid 2px #0a147b42";
    ddddd.style.background="skyblue";
    ddddd.style.borderRadius="20px";
    ddddd.style.width="60%";
    ddddd.style.height="50px";
    ddddd.style.fontSize="20px";
    ddddd.style.padding="3px";
    ddddd.addEventListener("mouseenter", function() {
        ddddd.style.backgroundColor = "blue"; // Change background color on hover
        ddddd.style.color = "white";          // Change text color on hover
    });

    window.onbeforeunload = function () {
        if (!answersSubmitted) {
            return "Are you sure you want to leave? Your answers will be lost.";
        }
    };
});

let totalCount = 0;
let answersSubmitted = false;
let countdownTimer;
let startTime;
let endTime;
let isAutomaticSubmission = false;

// Custom Alert
function showCustomAlert(message) {
    return new Promise((resolve) => {
        document.getElementById('alertContent').innerText = message;
        document.getElementById('customAlert').style.display = 'block';
        window.resolveCustomAlert = function() {
            document.getElementById('customAlert').style.display = 'none';
            resolve();
        };
    });
}

// Custom Confirm
function showCustomConfirm(message) {
    return new Promise((resolve) => {
        document.getElementById('confirmContent').innerText = message;
        document.getElementById('customConfirm').style.display = 'block';
        window.resolveCustomConfirm = function(response) {
            document.getElementById('customConfirm').style.display = 'none';
            resolve(response);
        };
    });
}

function startTimer(duration, display) {
    document.getElementById('answers').style.display = 'none';
    document.getElementById('needToKnow').style.display = 'none';
    document.getElementById('needTag').style.display = 'none';
    document.getElementById('numberInput').style.display = 'none';
    document.getElementById('numberInputText').style.display = 'none';

    let timer = duration, minutes, seconds;
    countdownTimer = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ":" + seconds;
        if (--timer < 0) {
            clearInterval(countdownTimer);
            isAutomaticSubmission = true;
            submitAnswers();
        }
    }, 1000);
}

async function generateAnswerSheet() {
    const confirmed = await showCustomConfirm("Are you sure you want to generate the answer sheet?");
    if (confirmed) {
        startReviseTimer();
    }
}

function startReviseTimer() {
    document.getElementById("answers").style.display="none";
    let timeLeft = 3;
    const timerElement = document.getElementById('timer');
    const submitButton = document.getElementById('generatedText');

    submitButton.style.display = 'block';
    timerElement.style.display = 'none';

    submitButton.disabled = true;
    const timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            submitButton.textContent = timeLeft;
            timeLeft--;
        } else {
            clearInterval(timerInterval);
            submitButton.textContent = 'Ready... 1, 2, 3, Go!';
            
            setTimeout(() => {
                submitButton.style.display = 'none';
                startExam();
            }, 2000); 
        }
    }, 1000);
}

function startExam() {
    const questionNumber = gucco1.length;
    const startQ = startQnumber;
    const timeInSeconds = questionNumber * 20;
    const timeInMinutes = timeInSeconds / 60;
    const timerDuration = Math.ceil(timeInMinutes);
    startTime = new Date().toLocaleString();
    let answerSheetHTML = '<h2>OMR Answer Sheet</h2>';
    for (let i = 1; i <= questionNumber; i++) {
        answerSheetHTML += `<div id="question${i+startQ}"><strong> ${i+startQ}:</strong> `;
        for (let j = 0; j < 4; j++) {
            const option = String.fromCharCode(97 + j);
            answerSheetHTML += `<div class="option" onclick="selectOption(this, '${option}', ${i})">${option}</div>`;
        }
        answerSheetHTML += `</div>`;
    }
    document.getElementById('answerSheet').innerHTML = answerSheetHTML;
    hideAll();
    document.getElementById('submittext').style.display = 'block';
    var designSb = document.getElementById("submittext");
    designSb.style.fontSize="20px";
    designSb.style.border="solid 2px #0dc722";
    designSb.style.borderRadius="20px";
    document.getElementById('answerSheet').style.display = 'block';
    document.getElementById('timer').style.display = 'block';
    const timerDisplay = document.getElementById('timer');
    startTimer(timerDuration * 60, timerDisplay);
    totalCount = parseInt(questionNumber);
}

function selectOption(option, letter, questionNumber) {
    if (answersSubmitted) return;
    const options = option.parentNode.querySelectorAll('.option');
    options.forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');
    option.dataset.questionNumber = questionNumber;
    console.log(`Selected option ${letter} for Question ${questionNumber}`);
}

async function submitAnswers() {
    const idToHide = document.getElementById('submittext');
    if (!isAutomaticSubmission) {
        const confirmed = await showCustomConfirm("Are you sure you want to submit your answers? You won't be able to change them later.");
        if (!confirmed) return;
    }
    if (answersSubmitted) return;
    answersSubmitted = true;
    clearInterval(countdownTimer);
    endTime = new Date().toLocaleString();
    idToHide.style.display = 'none';
    const selectedOptions = document.querySelectorAll('.option.selected');
    const correctAnswers = gucco1.split('');
    let totalMarks = 0;
    let answeredQuestions = [];

    selectedOptions.forEach(option => {
        const selectedLetter = option.textContent.trim();
        const correctLetter = correctAnswers[option.dataset.questionNumber - 1].trim();
        const questionNumber = parseInt(option.dataset.questionNumber);
        if (selectedLetter === correctLetter) {
            option.classList.add('correct');
            totalMarks += 1;
        } else {
            option.classList.add('incorrect');
            totalMarks -= 0.25;
        }
        option.classList.remove('selected');
        answeredQuestions.push(questionNumber);
    });

    for (let i = 1; i <= totalCount; i++) {
        if (!answeredQuestions.includes(i)) {
            const questionDiv = document.getElementById(`question${i}`);
            questionDiv.innerHTML += `<div class="option skip">skipped</div>`;
        }
    }

    document.getElementById('originalMarks').style.display = 'block';
    let output = "Marks: " + totalMarks.toFixed(2) + "/" + totalCount;

    document.getElementById("originalMarks").textContent = output;

    const original_marks = (totalMarks * 100) / totalCount;
    const actual_marks = original_marks.toFixed(2);
    const feedbackMessage = getFeedbackMessage(actual_marks);
    const feedbackElement = document.createElement('div');
    feedbackElement.textContent = feedbackMessage;
    feedbackElement.classList.add('feedback-message');
    const answerSheetContainer = document.getElementById('answerSheet');
    answerSheetContainer.appendChild(feedbackElement);
    const justifyUser = document.createElement('div');
    justifyUser.innerHTML = "Start Time: " + startTime + "<br>" + "Submit Time: " + endTime;
    justifyUser.classList.add('justifyUserDesign');
    const justifyUserContainer = document.getElementById('answerSheet');
    justifyUserContainer.appendChild(justifyUser);
    const scratches = document.createElement('div');
    scratches.classList.add('scratches');
    justifyUser.appendChild(scratches);
    
    console.log(correctAnswers.length);
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.onclick = null);
    const startQ = startQnumber;
    for (let i = 1; i <= correctAnswers.length; i++) {
        const correctLetter = correctAnswers[i - 1];
        const questionDiv = document.getElementById(`question${i+startQ}`);
        questionDiv.innerHTML += `<div class="correct-answer">Correct Answer: ${correctLetter}</div>`;
    }

    isAutomaticSubmission = false;

    window.onbeforeunload = function () {
        if (!answersSubmitted) {
            return "Are you sure you want to leave? Your answers will be lost.";
        }
    };

    window.onbeforeunload = function () {
        if (totalMarks !== null) {
            return "You have submitted your answers. Are you sure you want to leave the page?";
        }
    };
}

function hideAll() {
    const divIdsToHide = ['questionNumber', 'timerDuration', 'generatedText', 'questionnumbertext', 'timetext', 'headtext'];
    divIdsToHide.forEach(id => {
        const divToHide = document.getElementById(id);
        if (divToHide) {
            divToHide.style.display = 'none';
        }
    });
}

function getFeedbackMessage(marks) {
    if (marks >= 85 && marks <= 100) {
        return `You will top in any national level exam InshaAllah. You Obtained: ${marks}/100`;
    } else if (marks >= 75 && marks < 85) {
        return `Keep going, you're doing well. At least you will get a good subject in university exams InshaAllah! You obtained: ${marks}/100`;
    } else if (marks >= 50 && marks < 75) {
        return `You can do better, keep practicing. Have to do better! You obtained: ${marks}/100`;
    } else {
        return `Don't give up, keep working hard! Your Position is not good. You obtained: ${marks}/100`;
    }
}
