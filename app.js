const setListEl = document.getElementById("set-list");
const questionTitleEl = document.getElementById("question-title");
const answerTextEl = document.getElementById("answer-text");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

let questionSets = [];
let currentSetIndex = 0;
let currentQuestionIndex = 0;

function loadSetList() {
  setListEl.innerHTML = "";
  questionSets.forEach((set, index) => {
    const li = document.createElement("li");
    li.textContent = set.title;
    li.dataset.index = index;
    if (index === currentSetIndex) li.classList.add("active");
    li.setAttribute("tabindex", "0");
    li.setAttribute("role", "button");
    li.setAttribute("aria-pressed", index === currentSetIndex ? "true" : "false");

    li.addEventListener("click", () => {
      currentSetIndex = index;
      currentQuestionIndex = 0;
      updateActiveSet();
      loadQuestion();
    });

    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        li.click();
      }
    });

    setListEl.appendChild(li);
  });
}

function updateActiveSet() {
  [...setListEl.children].forEach((li) => {
    li.classList.remove("active");
    li.setAttribute("aria-pressed", "false");
    if (parseInt(li.dataset.index) === currentSetIndex) {
      li.classList.add("active");
      li.setAttribute("aria-pressed", "true");
    }
  });
}

function loadQuestion() {
  const currentSet = questionSets[currentSetIndex];
  const questionObj = currentSet.questions[currentQuestionIndex];
  questionTitleEl.textContent = questionObj.question;
  answerTextEl.textContent = questionObj.answer;

  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.disabled = currentQuestionIndex === currentSet.questions.length - 1;
}

prevBtn.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  const currentSet = questionSets[currentSetIndex];
  if (currentQuestionIndex < currentSet.questions.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
  }
});

// Fetch the questions.json file and initialize the app
fetch("questions.json")
  .then((res) => res.json())
  .then((data) => {
    questionSets = data;
    loadSetList();
    loadQuestion();
  })
  .catch((error) => {
    questionTitleEl.textContent = "Failed to load questions.";
    answerTextEl.textContent = "";
    console.error(error);
  });
