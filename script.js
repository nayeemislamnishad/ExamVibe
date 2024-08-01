document.addEventListener('DOMContentLoaded', () => {
     document.getElementById('noteIt').style.display = 'none';
    document.getElementById('submittext').style.display = 'none';
    document.getElementById('answerSheet').style.display = 'none';
    document.getElementById('timer').style.display = 'none';
    document.getElementById('originalMarks').style.display = 'none';
    var ddddd = document.getElementById('generatedText');
    ddddd.style.border = "solid 2px #0a147b42";
    ddddd.style.background = "skyblue";
    ddddd.style.borderRadius = "20px";
    ddddd.style.width = "60%";
    ddddd.style.height = "50px";
    ddddd.style.fontSize = "20px";
    ddddd.style.padding = "3px";
    ddddd.addEventListener("mouseenter", function () {
        ddddd.style.backgroundColor = "gold"; // Change background color on hover
        ddddd.style.color = "black";          // Change text color on hover
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
        window.resolveCustomAlert = function () {
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
        window.resolveCustomConfirm = function (response) {
            document.getElementById('customConfirm').style.display = 'none';
            resolve(response);
        };
    });
}

function startTimer(duration, display) {
    document.getElementById('answers').style.display = 'none';
    // document.getElementById('needToKnow').style.display = 'none';   only for reverse mode
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
    document.getElementById("answers").style.display = "none";
    document.getElementById("numberInput").style.display = "none"; 
    document.getElementById("timePerQuestion").style.display = "none";
    
    document.getElementById("timePerQuestionText").style.display = "none";
    document.getElementById("numberInputText").style.display = "none"; 
    document.getElementById("needTag").style.display = "none";


    // try
    const questionNumber = gucco1.length;
    const startQ = startQnumber;
    const timePerQuestion = parseInt(document.getElementById('timePerQuestion').value, 10);
    const timeInSeconds = questionNumber * timePerQuestion;
    const timeInMinutes = timeInSeconds / 60;
    const timerDuration = customRound(timeInMinutes);
   console.log(timerDuration);
const resultDiv = document.getElementById('minuteGarbage');
resultDiv.textContent = `${timerDuration} minutes`;





    let timeLeft = 30;
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

function customRound(number) {
    // Check if the number is an integer
    if (Number.isInteger(number)) {
        return number; // If it's already an integer, return it as is
    }
    
    // Get the floor of the number
    let floor = Math.floor(number);
    // Check if the number is closer to the floor or ceiling value
    if (number - floor > 0.5) {
        return floor + 1; // Round up
    } else {
        return floor; // Round down
    }
}





function startExam() {
    const questionNumber = gucco1.length;
    const startQ = startQnumber;
    const timePerQuestion = parseInt(document.getElementById('timePerQuestion').value, 10);
    const timeInSeconds = questionNumber * timePerQuestion;
    const timeInMinutes = timeInSeconds / 60;
    const timerDuration = customRound(timeInMinutes);
   console.log(timerDuration);
const resultDiv = document.getElementById('minuteGarbage');
resultDiv.textContent = `${timerDuration} minutes`;







    startTime = new Date().toLocaleString();
    let answerSheetHTML = '<h2>OMR Answer Sheet</h2>';
    for (let i = 1; i <= questionNumber; i++) {
        answerSheetHTML += `<div id="question${i + startQ}"><strong> ${i + startQ}:</strong> `;
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
    designSb.style.fontSize = "20px";
    designSb.style.border = "solid 2px #0dc722";
    designSb.style.borderRadius = "20px";
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
function formatNumber(number) {
    if (Number.isInteger(number)) {
        return number; // Return integer as is
    } else {
        // Convert number to a string with up to two decimal places
        return parseFloat(number.toFixed(2));
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    
    scrollToTop();
    document.getElementById('originalMarks').style.display = 'block';
    // let output = "Marks: " + totalMarks.toFixed(2) + "/" + totalCount;
    let output = "Marks: " + formatNumber(totalMarks) + "/" + totalCount;


    
    document.getElementById("originalMarks").textContent = output;

    const original_marks = (totalMarks * 100) / totalCount;
    // const actual_marks = original_marks.toFixed(2);
    const actual_marks =formatNumber(original_marks);
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



    // for (let i = 1; i <= correctAnswers.length; i++) {
    //     const correctLetter = correctAnswers[i - 1].trim();
    //     const questionDiv = document.getElementById(`question${i + startQ}`);
    //     const options = questionDiv.querySelectorAll('.option');
    //     options.forEach(option => {
    //         if (option.textContent.trim() === correctLetter) {
    //             option.classList.add('correctAnswer');
    //         }
    //     });
    // }
    for (let i = 1; i <= correctAnswers.length; i++) {
        const correctLetter = correctAnswers[i - 1];
        const questionDiv = document.getElementById(`question${i+startQ}`);
        questionDiv.innerHTML += `<div class="correct-answer">Correct Answer: ${correctLetter}</div>`;
    }






    if (isAutomaticSubmission) {
        await showCustomAlert("Time's up! Your answers have been automatically submitted.");
    } else {
        await showCustomAlert("Your answers have been successfully submitted.");
    }

    
window.onbeforeunload = function () {
    if (answersSubmitted) {
        return "You have already submitted your answers. Are you sure you want to leave?";
    }
    if (!answersSubmitted) {
        return "Are you sure you want to leave? Your answers will be lost.";
    }
};

}







// function getFeedbackMessage(score) {
//     if (score === 100) {
//         return "Excellent! You got all the answers correct!";
//     } else if (score >= 80) {
//         return "Great job! You have a strong understanding of the material.";
//     } else if (score >= 60) {
//         return "Good effort! There's still room for improvement.";
//     } else if (score >= 40) {
//         return "You passed, but consider reviewing the material.";
//     } else {
//         return "You did not pass. It might help to go over the material again.";
//     }
// }


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










function hideAll() {
    // document.getElementById('noteIt').style.display = 'none';
    document.getElementById('generatedText').style.display = 'none';
}

window.onbeforeunload = function () {
    if (answersSubmitted) {
        return "You have already submitted your answers. Are you sure you want to leave?";
    }
    if (!answersSubmitted) {
        return "Are you sure you want to leave? Your answers will be lost.";
    }
};

