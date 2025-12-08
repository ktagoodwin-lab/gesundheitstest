// Gesundheits-Quiz — branching logic preserved
// Percentage removed: progress bar remains but numeric percent text removed

// Questions and branching (unchanged)
const questions = {
  sleepHours: {
    id: 'sleepHours',
    text: 'Wie viele Stunden schlafen Sie jeden Tag?',
    options: [
      { value: '<4', label: '< 4' },
      { value: '4-8', label: '4–8' },
      { value: '>8', label: '> 8' }
    ]
  },
  tvSleep: {
    id: 'tvSleep',
    text: 'Schlafen Sie beim Fernsehen?',
    options: [
      { value: 'ja', label: 'Ja' },
      { value: 'nein', label: 'Nein' }
    ]
  },
  phoneBeforeSleep: {
    id: 'phoneBeforeSleep',
    text: 'Benutzen Sie Ihr Handy vor dem Schlafen?',
    options: [
      { value: 'ja', label: 'Ja' },
      { value: 'nein', label: 'Nein' }
    ]
  },
  nightWake: {
    id: 'nightWake',
    text: 'Wie oft werden Sie in der Nacht wach?',
    options: [
      { value: 'oft', label: 'Oft' },
      { value: 'selten', label: 'Selten' },
      { value: 'nie', label: 'Nie' }
    ]
  },
  coffeeCups: {
    id: 'coffeeCups',
    text: 'Wie viele Tassen Kaffee trinken Sie täglich?',
    options: [
      { value: 'mehr als 3', label: 'Mehr als 3' },
      { value: '1-3', label: '1–3' },
      { value: 'keine', label: 'Keine' }
    ]
  },
  energyDrinks: {
    id: 'energyDrinks',
    text: 'Trinken Sie oft Energydrinks?',
    options: [
      { value: 'ja', label: 'Ja' },
      { value: 'nein', label: 'Nein' }
    ]
  },
  workMuch: {
    id: 'workMuch',
    text: 'Arbeiten Sie viel?',
    options: [
      { value: 'ja', label: 'Ja' },
      { value: 'nein', label: 'Nein' }
    ]
  },
  sports: {
    id: 'sports',
    text: 'Treiben Sie regelmäßig Sport?',
    options: [
      { value: 'ja', label: 'Ja' },
      { value: 'nein', label: 'Nein' }
    ]
  },
  healthyDiet: {
    id: 'healthyDiet',
    text: 'Achten Sie auf gesunde Ernährung?',
    options: [
      { value: 'ja', label: 'Ja' },
      { value: 'nein', label: 'Nein' }
    ]
  },
  nicotine: {
    id: 'nicotine',
    text: 'Rauchen Sie oder benutzen Sie Nikotinprodukte?',
    options: [
      { value: 'ja', label: 'Ja' },
      { value: 'nein', label: 'Nein' }
    ]
  },
  alcohol: {
    id: 'alcohol',
    text: 'Trinken Sie mehr als dreimal pro Woche Alkohol?',
    options: [
      { value: 'ja', label: 'Ja' },
      { value: 'nein', label: 'Nein' }
    ]
  },
  stressed: {
    id: 'stressed',
    text: 'Sind Sie oft gestresst oder unkonzentriert?',
    options: [
      { value: 'ja', label: 'Ja' },
      { value: 'nein', label: 'Nein' }
    ]
  }
};

const results = {
  excellent: {
    title: 'Herzlichen Glückwunsch!',
    text:
      'Sie sind ein Vorbild für andere! Achten Sie darauf, dass das auch in Zukunft so bleibt. So werden Sie sich an einem langen und gesunden Leben erfreuen können.'
  },
  active: {
    title: 'Sie sind schon auf einem guten Weg! ',
    text:
      'Regelmäßige Bewegung und Pausen tun Ihnen gut. Spazieren gehen, mit Freunden kochen und erholsame Zeiten werden Ihnen helfen, bestehende schlechte Angewohnheiten durch gute zu ersetzen.'},
  
  concerning: {
    title: 'Sie sollten schnell handeln!',
    text:
      'Ihre schlechten Angewohnheiten können mit der Zeit gesundheitsgefährdend werden. Achten Sie mehr auf Ihren Körper, ernähren Sie sich gesünder und gönnen Sie sich ab und zu eine Pause!'
  }
};

const state = {
  currentId: 'sleepHours',
  history: [],
  answers: {}
};

/* DOM refs */
const questionText = document.getElementById('questionText');
const optionsDiv = document.getElementById('options');
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');
const quizDiv = document.getElementById('quiz');
const resultDiv = document.getElementById('result');
const progressInner = document.getElementById('progressBarInner'); // bar only (no text)

/* Render question as large buttons (no radio inputs) */
function renderQuestion() {
  const q = questions[state.currentId];
  if (!q) {
    showResult(computeResultKey());
    return;
  }

  questionText.textContent = q.text;
  optionsDiv.innerHTML = '';
  nextBtn.disabled = true;

  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option';
    btn.setAttribute('role', 'listitem');
    btn.dataset.value = opt.value;
    btn.id = `opt-${q.id}-${sanitizeForId(opt.value)}`;
    btn.innerHTML = `<span class="label-text">${opt.label}</span>`;

    // restore previous selection
    if (state.answers[q.id] === opt.value) {
      btn.classList.add('selected');
      nextBtn.disabled = false;
    }

    btn.addEventListener('click', () => {
      // clear other selected options in this question
      const siblings = optionsDiv.querySelectorAll('.option');
      siblings.forEach(s => s.classList.remove('selected'));
      btn.classList.add('selected');

      // save answer immediately
      state.answers[q.id] = opt.value;
      nextBtn.disabled = false;
    });

    optionsDiv.appendChild(btn);
  });

  backBtn.disabled = state.history.length === 0;
  updateProgress();
}

function sanitizeForId(s) {
  return String(s).replace(/\s+/g, '-').replace(/[^\w-]/g, '').toLowerCase();
}

function saveAnswer() {
  const selected = optionsDiv.querySelector('.option.selected');
  if (!selected) return;
  state.answers[state.currentId] = selected.dataset.value;
}

function getNextIdFromLogic() {
  const id = state.currentId;
  const a = state.answers;

  if (id === 'sleepHours') {
    if (a.sleepHours === '<4') return 'tvSleep';
    if (a.sleepHours === '4-8') return 'phoneBeforeSleep';
    if (a.sleepHours === '>8') return 'nightWake';
  }

  if (id === 'tvSleep') {
    if (a.tvSleep === 'ja') return 'nightWake';
    if (a.tvSleep === 'nein') return 'phoneBeforeSleep';
  }

  if (id === 'phoneBeforeSleep') {
    if (a.phoneBeforeSleep === 'ja') return 'nightWake';
    if (a.phoneBeforeSleep === 'nein') return 'energyDrinks';
  }

  if (id === 'nightWake') {
    if (a.nightWake === 'oft') return 'coffeeCups';
    if (a.nightWake === 'selten') return 'workMuch';
    if (a.nightWake === 'nie') return 'sports';
  }

  if (id === 'coffeeCups') {
    if (a.coffeeCups === 'mehr als 3') return 'energyDrinks';
    if (a.coffeeCups === '1-3') return 'sports';
    if (a.coffeeCups === 'keine') return 'sports';
  }

  if (id === 'energyDrinks') {
    if (a.energyDrinks === 'ja') return 'nicotine';
    if (a.energyDrinks === 'nein') return 'sports';
  }

  if (id === 'workMuch') return 'sports';

  if (id === 'sports') {
    if (a.sports === 'ja') return 'healthyDiet';
    if (a.sports === 'nein') return 'alcohol';
  }

  if (id === 'healthyDiet') {
    if (a.healthyDiet === 'ja') return null;
    if (a.healthyDiet === 'nein') return 'alcohol';
  }

  if (id === 'nicotine') return 'stressed';
  if (id === 'alcohol') return 'stressed';
  if (id === 'stressed') return null;

  return null;
}

function computeResultKey() {
  const a = state.answers;

  if (
    a.sports === 'ja' &&
    a.healthyDiet === 'ja' &&
    (a.nicotine !== 'ja') &&
    (a.coffeeCups !== 'mehr als 3') &&
    (a.energyDrinks !== 'ja') &&
    (a.alcohol !== 'ja')
  ) {
    return 'excellent';
  }

  if (a.sports === 'ja' || a.energyDrinks === 'nein') return 'active';

  if (
    a.nicotine === 'ja' ||
    a.energyDrinks === 'ja' ||
    a.coffeeCups === 'mehr als 3' ||
    a.alcohol === 'ja' ||
    a.stressed === 'ja' ||
    a.sleepHours === '<4'
  ) {
    return 'concerning';
  }

  return 'active';
}

function showResult(key) {
  // Hide quiz section completely
  quizDiv.style.display = 'none';
  
  // Show result section
  resultDiv.classList.remove('hidden');
  resultDiv.setAttribute('aria-hidden', 'false');
  
  const r = results[key] || results.active;
  document.getElementById('resultTitle').textContent = r.title;
  document.getElementById('resultText').textContent = r.text;
  setProgress(100);
}

nextBtn.addEventListener('click', () => {
  saveAnswer();
  state.history.push(state.currentId);
  const nextId = getNextIdFromLogic();
  if (!nextId) {
    showResult(computeResultKey());
    return;
  }
  state.currentId = nextId;
  renderQuestion();
});

backBtn.addEventListener('click', () => {
  if (state.history.length === 0) return;
  const prev = state.history.pop();
  state.currentId = prev;
  renderQuestion();
});

document.getElementById('restartBtn').addEventListener('click', () => {
  state.currentId = 'sleepHours';
  state.history = [];
  state.answers = {};
  
  // Hide result and show quiz section
  resultDiv.classList.add('hidden');
  resultDiv.setAttribute('aria-hidden', 'true');
  quizDiv.style.display = '';
  quizDiv.classList.remove('hidden');
  
  renderQuestion();
});

/* Progress handling: only update bar width (no numeric percent shown) */
function setProgress(percent) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  if (progressInner) progressInner.style.width = clamped + '%';
}

function updateProgress() {
  // estimate remaining steps dynamically by simulating the path from current state
  const simulated = simulateRemainingSteps(state.currentId, Object.assign({}, state.answers));
  const answered = Object.keys(state.answers).length;
  const total = Math.max(1, answered + simulated.remaining);
  const percent = Math.round((answered / total) * 100);
  setProgress(percent);
}

function simulateRemainingSteps(startId, answersSoFar) {
  let cur = startId;
  let count = 0;
  while (cur) {
    count++;
    if (count > 20) break;
    const existing = answersSoFar[cur];
    if (!existing) break;
    const next = (function simulateNext(id) {
      const a = answersSoFar;
      if (id === 'sleepHours') {
        if (a.sleepHours === '<4') return 'tvSleep';
        if (a.sleepHours === '4-8') return 'phoneBeforeSleep';
        if (a.sleepHours === '>8') return 'nightWake';
      }
      if (id === 'tvSleep') {
        if (a.tvSleep === 'ja') return 'nightWake';
        if (a.tvSleep === 'nein') return 'phoneBeforeSleep';
      }
      if (id === 'phoneBeforeSleep') {
        if (a.phoneBeforeSleep === 'ja') return 'nightWake';
        if (a.phoneBeforeSleep === 'nein') return 'energyDrinks';
      }
      if (id === 'nightWake') {
        if (a.nightWake === 'oft') return 'coffeeCups';
        if (a.nightWake === 'selten') return 'workMuch';
        if (a.nightWake === 'nie') return 'sports';
      }
      if (id === 'coffeeCups') {
        if (a.coffeeCups === 'mehr als 3') return 'energyDrinks';
        if (a.coffeeCups === '1-3') return 'sports';
        if (a.coffeeCups === 'keine') return 'sports';
      }
      if (id === 'energyDrinks') {
        if (a.energyDrinks === 'ja') return 'nicotine';
        if (a.energyDrinks === 'nein') return 'sports';
      }
      if (id === 'workMuch') return 'sports';
      if (id === 'sports') {
        if (a.sports === 'ja') return 'healthyDiet';
        if (a.sports === 'nein') return 'alcohol';
      }
      if (id === 'healthyDiet') {
        if (a.healthyDiet === 'ja') return null;
        if (a.healthyDiet === 'nein') return 'alcohol';
      }
      if (id === 'nicotine') return 'stressed';
      if (id === 'alcohol') return 'stressed';
      if (id === 'stressed') return null;
      return null;
    })(cur);
    cur = next;
  }
  const remaining = cur ? Math.min(6, 1 + (count === 0 ? 3 : 2)) : 0;
  return { remaining };
}

/* init */
renderQuestion();
updateProgress();
