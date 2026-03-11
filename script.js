const arrayContainer = document.getElementById('array-container');
const algorithmSelect = document.getElementById('algorithm-select');
const sizeSlider = document.getElementById('size-slider');
const speedSlider = document.getElementById('speed-slider');
const sizeValue = document.getElementById('size-value');
const speedValue = document.getElementById('speed-value');
const randomizeBtn = document.getElementById('randomize-btn');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const stepBtn = document.getElementById('step-btn');
const resetBtn = document.getElementById('reset-btn');
const statusText = document.getElementById('status-text');
const comparisonsEl = document.getElementById('comparisons');
const swapsEl = document.getElementById('swaps');
const writesEl = document.getElementById('writes');
const algoNote = document.getElementById('algo-note');

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

function randomArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 92) + 8);
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
  setStatus('Reset complete. Ready to run.');
}

function regenerateArray() {
  stopPlayback();
  const size = Number(sizeSlider.value);
  baseArray = randomArray(size);
  currentArray = [...baseArray];
  steps = [];
  stepIndex = 0;
  resetStats();
  renderArray();
  setStatus('New array generated.');
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

resetBtn.addEventListener('click', resetToBase);
randomizeBtn.addEventListener('click', regenerateArray);

sizeSlider.addEventListener('input', () => {
  sizeValue.textContent = sizeSlider.value;
  regenerateArray();
});

speedSlider.addEventListener('input', () => {
  speedValue.textContent = speedSlider.value;
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
});

sizeValue.textContent = sizeSlider.value;
speedValue.textContent = speedSlider.value;
updateNote();
regenerateArray();