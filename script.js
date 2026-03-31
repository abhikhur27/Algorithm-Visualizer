const arrayContainer = document.getElementById('array-container');
const algorithmSelect = document.getElementById('algorithm-select');
const sizeSlider = document.getElementById('size-slider');
const speedSlider = document.getElementById('speed-slider');
const customArrayInput = document.getElementById('custom-array');
const applyArrayBtn = document.getElementById('apply-array-btn');
const presetArrayButtons = Array.from(document.querySelectorAll('.preset-array-btn'));
const sizeValue = document.getElementById('size-value');
const speedValue = document.getElementById('speed-value');
const randomizeBtn = document.getElementById('randomize-btn');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const stepBtn = document.getElementById('step-btn');
const backBtn = document.getElementById('back-btn');
const resetBtn = document.getElementById('reset-btn');
const statusText = document.getElementById('status-text');
const comparisonsEl = document.getElementById('comparisons');
const swapsEl = document.getElementById('swaps');
const writesEl = document.getElementById('writes');
const stepProgressEl = document.getElementById('step-progress');
const theoryOpsEl = document.getElementById('theory-ops');
const algoNote = document.getElementById('algo-note');
const STORAGE_KEY = 'algorithm_visualizer_lab_state_v1';

const algorithmNotes = {
  bubble: 'Bubble Sort repeatedly pushes larger values to the right. Worst-case complexity: O(n^2).',
  insertion: 'Insertion Sort builds a sorted prefix and inserts each next value at the correct position. Worst-case: O(n^2).',
  merge: 'Merge Sort recursively splits and merges ranges. Time complexity: O(n log n), extra memory required.',
  quick: 'Quick Sort partitions around a pivot. Average complexity: O(n log n), worst-case O(n^2).',
};

let baseArray = [];
let currentArray = [];
let steps = [];
let stepIndex = 0;
let timerId = null;
let isRunning = false;
let stats = {
  comparisons: 0,
  swaps: 0,
  writes: 0,
};

function loadPersistedState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch (error) {
    return null;
  }
}

function persistState() {
  const payload = {
    algorithm: algorithmSelect.value,
    size: sizeSlider.value,
    speed: speedSlider.value,
    customArray: customArrayInput.value,
    baseArray,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function randomArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 92) + 8);
}

function patternedArray(size, mode) {
  if (mode === 'reversed') {
    return Array.from({ length: size }, (_, index) => Math.max(4, Math.round(((size - index) / size) * 96)));
  }

  if (mode === 'few') {
    const buckets = [15, 28, 42, 57, 72, 86];
    return Array.from({ length: size }, () => buckets[Math.floor(Math.random() * buckets.length)]);
  }

  const sorted = Array.from({ length: size }, (_, index) => Math.max(4, Math.round(((index + 1) / size) * 96)));
  const swaps = Math.max(1, Math.floor(size * 0.14));

  for (let i = 0; i < swaps; i += 1) {
    const a = Math.floor(Math.random() * size);
    const b = Math.floor(Math.random() * size);
    [sorted[a], sorted[b]] = [sorted[b], sorted[a]];
  }

  return sorted;
}

function setStatus(message) {
  statusText.textContent = message;
}

function updateNote() {
  algoNote.textContent = algorithmNotes[algorithmSelect.value];
}

function updateStatsDisplay() {
  comparisonsEl.textContent = String(stats.comparisons);
  swapsEl.textContent = String(stats.swaps);
  writesEl.textContent = String(stats.writes);
  stepProgressEl.textContent = `${Math.min(stepIndex, steps.length)} / ${steps.length}`;
  theoryOpsEl.textContent = estimateTheoryOps();
}

function estimateTheoryOps() {
  const n = Math.max(1, currentArray.length);
  const nLogN = Math.round(n * Math.log2(Math.max(2, n)));

  if (algorithmSelect.value === 'merge' || algorithmSelect.value === 'quick') {
    return `~${nLogN}`;
  }

  return `~${n * n}`;
}

function resetStats() {
  stats = { comparisons: 0, swaps: 0, writes: 0 };
  updateStatsDisplay();
}

function renderArray(highlight = {}) {
  const compareSet = new Set(highlight.compare || []);
  const swapSet = new Set(highlight.swap || []);

  arrayContainer.innerHTML = '';
  currentArray.forEach((value, index) => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${value}%`;

    if (highlight.done) {
      bar.classList.add('done');
    } else if (swapSet.has(index)) {
      bar.classList.add('swap');
    } else if (compareSet.has(index)) {
      bar.classList.add('compare');
    }

    arrayContainer.appendChild(bar);
  });
}

function clearTimer() {
  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function stopPlayback() {
  isRunning = false;
  clearTimer();
}

function finishPlayback() {
  stopPlayback();
  renderArray({ done: true });
  setStatus(`Completed in ${stepIndex} steps.`);
}

function applyStep(step) {
  if (!step) return;

  if (step.type === 'compare') {
    stats.comparisons += 1;
    renderArray({ compare: step.indices });
    return;
  }

  if (step.type === 'swap') {
    const [i, j] = step.indices;
    [currentArray[i], currentArray[j]] = [currentArray[j], currentArray[i]];
    stats.swaps += 1;
    renderArray({ swap: step.indices });
    return;
  }

  if (step.type === 'overwrite') {
    currentArray[step.index] = step.value;
    stats.writes += 1;
    renderArray({ swap: [step.index] });
  }
}

function rebuildToStep(targetStep) {
  currentArray = [...baseArray];
  stats = { comparisons: 0, swaps: 0, writes: 0 };

  for (let i = 0; i < targetStep; i += 1) {
    const step = steps[i];
    if (!step) continue;

    if (step.type === 'compare') {
      stats.comparisons += 1;
    } else if (step.type === 'swap') {
      const [a, b] = step.indices;
      [currentArray[a], currentArray[b]] = [currentArray[b], currentArray[a]];
      stats.swaps += 1;
    } else if (step.type === 'overwrite') {
      currentArray[step.index] = step.value;
      stats.writes += 1;
    }
  }
}

function runOneStep() {
  if (stepIndex >= steps.length) {
    finishPlayback();
    return;
  }

  const step = steps[stepIndex];
  applyStep(step);
  stepIndex += 1;
  updateStatsDisplay();

  if (stepIndex >= steps.length) {
    finishPlayback();
  }
}

function parseCustomArray() {
  const raw = customArrayInput.value.trim();
  if (!raw) return null;

  const values = raw
    .split(',')
    .map((token) => Number.parseInt(token.trim(), 10))
    .filter((value) => Number.isInteger(value));

  if (!values.length) return null;
  if (values.length < 5 || values.length > 120) return null;

  return values.map((value) => Math.max(4, Math.min(100, value)));
}

function startPlayback() {
  if (isRunning) return;
  if (stepIndex >= steps.length) {
    finishPlayback();
    return;
  }

  isRunning = true;
  setStatus(`Running ${algorithmSelect.options[algorithmSelect.selectedIndex].text}...`);

  timerId = window.setInterval(() => {
    runOneStep();
  }, Number(speedSlider.value));
}

function bubbleSortSteps(values) {
  const arr = [...values];
  const output = [];

  for (let i = 0; i < arr.length - 1; i += 1) {
    for (let j = 0; j < arr.length - i - 1; j += 1) {
      output.push({ type: 'compare', indices: [j, j + 1] });
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        output.push({ type: 'swap', indices: [j, j + 1] });
      }
    }
  }

  return output;
}

function insertionSortSteps(values) {
  const arr = [...values];
  const output = [];

  for (let i = 1; i < arr.length; i += 1) {
    let j = i;

    while (j > 0) {
      output.push({ type: 'compare', indices: [j - 1, j] });
      if (arr[j - 1] <= arr[j]) break;

      [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
      output.push({ type: 'swap', indices: [j - 1, j] });
      j -= 1;
    }
  }

  return output;
}

function mergeSortSteps(values) {
  const arr = [...values];
  const output = [];

  function merge(left, mid, right) {
    const leftSlice = arr.slice(left, mid + 1);
    const rightSlice = arr.slice(mid + 1, right + 1);

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftSlice.length && j < rightSlice.length) {
      output.push({ type: 'compare', indices: [left + i, mid + 1 + j] });

      if (leftSlice[i] <= rightSlice[j]) {
        arr[k] = leftSlice[i];
        output.push({ type: 'overwrite', index: k, value: leftSlice[i] });
        i += 1;
      } else {
        arr[k] = rightSlice[j];
        output.push({ type: 'overwrite', index: k, value: rightSlice[j] });
        j += 1;
      }
      k += 1;
    }

    while (i < leftSlice.length) {
      arr[k] = leftSlice[i];
      output.push({ type: 'overwrite', index: k, value: leftSlice[i] });
      i += 1;
      k += 1;
    }

    while (j < rightSlice.length) {
      arr[k] = rightSlice[j];
      output.push({ type: 'overwrite', index: k, value: rightSlice[j] });
      j += 1;
      k += 1;
    }
  }

  function divide(left, right) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);
    divide(left, mid);
    divide(mid + 1, right);
    merge(left, mid, right);
  }

  divide(0, arr.length - 1);
  return output;
}

function quickSortSteps(values) {
  const arr = [...values];
  const output = [];

  function partition(low, high) {
    const pivot = arr[high];
    let i = low;

    for (let j = low; j < high; j += 1) {
      output.push({ type: 'compare', indices: [j, high] });
      if (arr[j] < pivot) {
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          output.push({ type: 'swap', indices: [i, j] });
        }
        i += 1;
      }
    }

    if (i !== high) {
      [arr[i], arr[high]] = [arr[high], arr[i]];
      output.push({ type: 'swap', indices: [i, high] });
    }

    return i;
  }

  function sort(low, high) {
    if (low >= high) return;

    const pivotIndex = partition(low, high);
    sort(low, pivotIndex - 1);
    sort(pivotIndex + 1, high);
  }

  sort(0, arr.length - 1);
  return output;
}

function generateSteps() {
  const algorithms = {
    bubble: bubbleSortSteps,
    insertion: insertionSortSteps,
    merge: mergeSortSteps,
    quick: quickSortSteps,
  };

  const generator = algorithms[algorithmSelect.value];
  if (!generator) {
    throw new Error('Unknown algorithm selected.');
  }

  steps = generator(currentArray);
  stepIndex = 0;
  resetStats();
}

function resetToBase() {
  stopPlayback();
  currentArray = [...baseArray];
  steps = [];
  stepIndex = 0;
  resetStats();
  renderArray();
  updateStatsDisplay();
  setStatus('Reset complete. Ready to run.');
}

function setBaseArray(nextBase, message) {
  stopPlayback();
  baseArray = [...nextBase];
  currentArray = [...nextBase];
  steps = [];
  stepIndex = 0;
  resetStats();
  renderArray();
  updateStatsDisplay();
  if (message) {
    setStatus(message);
  }
  persistState();
}

function regenerateArray() {
  const size = Number(sizeSlider.value);
  setBaseArray(randomArray(size), 'New array generated.');
}

function applyCustomArray() {
  const parsed = parseCustomArray();
  if (!parsed) {
    setStatus('Provide 5-120 comma-separated integers (example: 9, 45, 12, 80).');
    return;
  }

  setBaseArray(parsed);
  sizeSlider.value = String(parsed.length);
  sizeValue.textContent = String(parsed.length);
  setStatus(`Custom array applied (${parsed.length} values).`);
  persistState();
}

function applyShapePreset(mode) {
  const size = Number(sizeSlider.value);
  const next = patternedArray(size, mode);
  const labelMap = {
    nearly: 'Nearly sorted',
    reversed: 'Reversed',
    few: 'Few-unique',
  };
  setBaseArray(next, `${labelMap[mode] || 'Preset'} array generated (${size} values).`);
}

startBtn.addEventListener('click', () => {
  if (!steps.length || stepIndex >= steps.length) {
    generateSteps();
  }
  startPlayback();
});

pauseBtn.addEventListener('click', () => {
  if (!isRunning) return;
  stopPlayback();
  setStatus('Paused. You can step manually or resume.');
});

stepBtn.addEventListener('click', () => {
  if (isRunning) return;
  if (!steps.length || stepIndex >= steps.length) {
    generateSteps();
  }
  runOneStep();
  setStatus(`Stepped to ${stepIndex}/${steps.length}.`);
});

backBtn.addEventListener('click', () => {
  if (isRunning) return;
  if (!steps.length) {
    setStatus('No execution history yet. Press Start or Step first.');
    return;
  }
  if (stepIndex <= 0) {
    setStatus('Already at the initial state.');
    return;
  }

  stepIndex = Math.max(0, stepIndex - 1);
  rebuildToStep(stepIndex);
  renderArray();
  updateStatsDisplay();
  setStatus(`Moved back to ${stepIndex}/${steps.length}.`);
});

resetBtn.addEventListener('click', resetToBase);
randomizeBtn.addEventListener('click', regenerateArray);
applyArrayBtn.addEventListener('click', applyCustomArray);
presetArrayButtons.forEach((button) => {
  button.addEventListener('click', () => applyShapePreset(button.dataset.shape));
});

sizeSlider.addEventListener('input', () => {
  sizeValue.textContent = sizeSlider.value;
  regenerateArray();
});

speedSlider.addEventListener('input', () => {
  speedValue.textContent = speedSlider.value;
  persistState();
  if (isRunning) {
    clearTimer();
    timerId = window.setInterval(runOneStep, Number(speedSlider.value));
  }
});

algorithmSelect.addEventListener('change', () => {
  stopPlayback();
  steps = [];
  stepIndex = 0;
  updateNote();
  setStatus('Algorithm changed. Press Start to run the new strategy.');
  renderArray();
  updateStatsDisplay();
  persistState();
});

const persistedState = loadPersistedState();
if (persistedState) {
  if (persistedState.algorithm) algorithmSelect.value = persistedState.algorithm;
  if (persistedState.size) sizeSlider.value = String(persistedState.size);
  if (persistedState.speed) speedSlider.value = String(persistedState.speed);
  if (typeof persistedState.customArray === 'string') customArrayInput.value = persistedState.customArray;
}

sizeValue.textContent = sizeSlider.value;
speedValue.textContent = speedSlider.value;
updateNote();

if (Array.isArray(persistedState?.baseArray) && persistedState.baseArray.length >= 5) {
  setBaseArray(persistedState.baseArray, 'Restored your last array + control settings.');
} else {
  regenerateArray();
}

updateStatsDisplay();
