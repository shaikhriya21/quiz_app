// Quiz data
const quizQuestions = [
  {
    question: "What is data structure?",
    options: [
      "A programming language",
      "A collections of algorithms",
      "A way to store and organize data",
      "A type of computer hardware"
    ],
    answer: 2
  },
  {
    question: "Which data structure is used for implementing recursion?",
    options: ["Stack", "Queue", "List", "Array"],
    answer: 0
  },
  {
    question: "The data structure required to check whether an expression contains a balanced parenthesis is?",
    options: ["Queue", "Stack", "Tree", "Array"],
    answer: 1
  },
  {
    question: "Which data structure is needed to convert infix notation to postfix notation?",
    options: ["Tree", "Branch", "Stack", "Queue"],
    answer: 2
  },
  {
    question: "The data structure required for Breadth First Traversal on a graph is?",
    options: ["Stack", "Queue", "Tree", "Array"],
    answer: 1
  },
  {
    question: "Which data structure is based on the Last In First Out (LIFO)?",
    options: ["Array", "Queue", "Linked List", "Stack"],
    answer: 3
  },
  {
    question: "Which of the following is not a type of Queue?",
    options: ["Ordinary Queue", "Priority Queue", "Circular Queue", "Single ended Queue"],
    answer: 3
  },
  {
    question: "Which algorithm is used in the top Tree data structure?",
    options: ["Backtracking", "Divide and Conquer", "Branch", "Greedy"],
    answer: 1
  },
  {
    question: "Which of the following is also known as rope data structure?",
    options: ["Linked List", "Array", "Binary Tree", "List"],
    answer: 2
  },
  {
    question: "Which data structure is used for finding the shortest path in a weighted graph?",
    options: ["Stack", "Queue", "Dijkstra's Algorithm", "Tree"],
    answer: 2
  }
];

// Pages
const pages = {
  welcome: document.getElementById('page-welcome'),
  signin: document.getElementById('page-signin'),
  dashboard: document.getElementById('page-dashboard'),
  quiz: document.getElementById('page-quiz'),
  score: document.getElementById('page-score'),
  review: document.getElementById('page-review')
};

// Buttons and Inputs
const btnContinue = document.getElementById('btnContinue');
const signinForm = document.getElementById('signin-form');
const inputName = document.getElementById('name');
const inputNumber = document.getElementById('number');

const btnStartQuiz = document.getElementById('btnStartQuiz');
const questionEl = document.getElementById('question');
const timerEl = document.getElementById('timer');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('nextBtn');

const scoreEl = document.getElementById('score');
const btnPlayAgain = document.getElementById('btnPlayAgain');
const btnGoHome = document.getElementById('btnGoHome');
const btnReviewAnswers = document.getElementById('btnReviewAnswers');

const reviewContent = document.getElementById('review-content');
const btnBackToScore = document.getElementById('btnBackToScore');

let currentQuestionIndex = 0;
let score = 0;
let wrong = 0;
let timer = null;
let timeLeft = 15;
let userAnswers = new Array(quizQuestions.length).fill(null);

function showPage(pageName) {
  for (const key in pages) {
    if (key === pageName) pages[key].classList.remove('hidden');
    else pages[key].classList.add('hidden');
  }
}

// Welcome to Signin
btnContinue.addEventListener('click', () => {
  showPage('signin');
});

// Sign In Form Submission
signinForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = inputName.value.trim();
  const number = inputNumber.value.trim();

  if (name && number.length === 10) {
    showPage('dashboard');
  } else {
    alert("Please enter a valid 10 digit number and your name.");
  }
});

// Start Quiz button
btnStartQuiz.addEventListener('click', () => {
  score = 0;
  wrong = 0;
  currentQuestionIndex = 0;
  userAnswers.fill(null);
  showPage('quiz');
  showQuestion();
  startTimer();
  nextBtn.classList.add('hidden');
});

function showQuestion() {
  resetOptions();
  timeLeft = 15;
  timerEl.textContent = `Time Left: ${timeLeft}s`;

  const currentQ = quizQuestions[currentQuestionIndex];
  questionEl.textContent = currentQ.question;

  optionsEl.innerHTML = '';
  currentQ.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.classList.add('option-btn');
    btn.textContent = opt;
    btn.addEventListener('click', () => selectOption(i));
    optionsEl.appendChild(btn);
  });
}

function resetOptions() {
  const optionButtons = optionsEl.querySelectorAll('button');
  optionButtons.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('correct', 'wrong');
  });
}

function disableOptions() {
  const optionButtons = optionsEl.querySelectorAll('button');
  optionButtons.forEach(btn => btn.disabled = true);
}

function selectOption(selectedIndex) {
  clearInterval(timer);
  disableOptions();
  nextBtn.classList.remove('hidden');

  const correctIndex = quizQuestions[currentQuestionIndex].answer;
  const optionButtons = optionsEl.querySelectorAll('button');

  optionButtons.forEach((btn, i) => {
    if (i === correctIndex) btn.classList.add('correct');
    if (i === selectedIndex && i !== correctIndex) btn.classList.add('wrong');
  });

  userAnswers[currentQuestionIndex] = selectedIndex;

  if (selectedIndex === correctIndex) score++;
  else wrong++;
}

nextBtn.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizQuestions.length) {
    showQuestion();
    startTimer();
    nextBtn.classList.add('hidden');
  } else {
    clearInterval(timer);
    showScore();
  }
});

function startTimer() {
  timerEl.textContent = `Time Left: ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      disableOptions();
      nextBtn.classList.remove('hidden');

      // If user didn't select any option before time out
      if (userAnswers[currentQuestionIndex] === null) {
        userAnswers[currentQuestionIndex] = null;
        wrong++;
      }
    }
  }, 1000);
}

function showScore() {
  showPage('score');
  scoreEl.innerHTML = `
    <p>Total Questions: ${quizQuestions.length}</p>
    <p>Correct Answers: <strong>${score}</strong></p>
    <p>Wrong Answers: <strong>${wrong}</strong></p>
  `;
}

btnPlayAgain.addEventListener('click', () => {
  showPage('dashboard');
});

btnGoHome.addEventListener('click', () => {
  showPage('welcome');
});

btnReviewAnswers.addEventListener('click', () => {
  showReviewPage();
});

function showReviewPage() {
  showPage('review');
  renderReviewContent();
}

function renderReviewContent() {
  reviewContent.innerHTML = ''; // clear old content
  quizQuestions.forEach((q, i) => {
    const userSelected = userAnswers[i];
    const correctIndex = q.answer;

    const div = document.createElement('div');
    div.classList.add('review-item');

    const qTitle = document.createElement('h3');
    qTitle.textContent = `${i + 1}. ${q.question}`;
    div.appendChild(qTitle);

    q.options.forEach((opt, idx) => {
      const optDiv = document.createElement('div');
      optDiv.classList.add('answer');
      if (idx === correctIndex) {
        optDiv.textContent = `Correct Answer: ${opt}`;
        optDiv.classList.add('correct-answer');
      }
      if (idx === userSelected && userSelected !== correctIndex) {
        optDiv.textContent = `Your Answer: ${opt}`;
        optDiv.classList.add('wrong-answer');
      }
    div.appendChild(optDiv);
    });

    if (userSelected === null) {
      const noAnswerDiv = document.createElement('div');
      noAnswerDiv.classList.add('answer', 'wrong-answer');
      noAnswerDiv.textContent = "No Answer Selected";
      div.appendChild(noAnswerDiv);
    }

    reviewContent.appendChild(div);
  });
}

btnBackToScore.addEventListener('click', () => {
  showPage('score');
});

// Initialize with welcome page
showPage('welcome');
