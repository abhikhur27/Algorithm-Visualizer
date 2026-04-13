const arrayContainer = document.getElementById('array-container');
const algorithmSelect = document.getElementById('algorithm-select');
const sizeSlider = document.getElementById('size-slider');
const speedSlider = document.getElementById('speed-slider');
const customArrayInput = document.getElementById('custom-array');
const applyArrayBtn = document.getElementById('apply-array-btn');
const presetArrayButtons = Array.from(document.querySelectorAll('.preset-array-btn'));
const compareBtn = document.getElementById('compare-btn');
const exportArrayBtn = document.getElementById('export-array-btn');
const importArrayBtn = document.getElementById('import-array-btn');
const importArrayFile = document.getElementById('import-array-file');
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
const diagnosticSortednessEl = document.getElementById('diagnostic-sortedness');
const diagnosticDuplicatesEl = document.getElementById('diagnostic-duplicates');
const diagnosticSpreadEl = document.getElementById('diagnostic-spread');
const diagnosticInversionsEl = document.getElementById('diagnostic-inversions');
const diagnosticRecommendationEl = document.getElementById('diagnostic-recommendation');
const profileTimeEl = document.getElementById('profile-time');
const profileMemoryEl = document.getElementById('profile-memory');
const profileStabilityEl = document.getElementById('profile-stability');
const profileSweetSpotEl = document.getElementById('profile-sweet-spot');
const profileFitEl = document.getElementById('profile-fit');
const fingerprintRunsEl = document.getElementById('fingerprint-runs');
const fingerprintJumpEl = document.getElementById('fingerprint-jump');
const fingerprintMedianEl = document.getElementById('fingerprint-median');
const fingerprintUniqueEl = document.getElementById('fingerprint-unique');
const fingerprintSummaryEl = document.getElementById('fingerprint-summary');
const operationSummaryEl = document.getElementById('operation-summary');
const operationCurrentEl = document.getElementById('operation-current');
const operationCompareShareEl = document.getElementById('operation-compare-share');
const operationSwapShareEl = document.getElementById('operation-swap-share');
const operationWriteShareEl = document.getElementById('operation-write-share');
const benchmarkVerdictEl = document.getElementById('benchmark-verdict');
const benchmarkFastestEl = document.getElementById('benchmark-fastest');
const benchmarkGapEl = document.getElementById('benchmark-gap');
const benchmarkStableEl = document.getElementById('benchmark-stable');
const benchmarkCoachEl = document.getElementById('benchmark-coach');
const comparisonBody = document.getElementById('comparison-body');
const comparisonSummary = document.getElementById('comparison-summary');
const STORAGE_KEY = 'algorithm_visualizer_lab_state_v1';

const algorithmGenerators = {
  bubble: bubbleSortSteps,
  insertion: insertionSortSteps,
  merge: mergeSortSteps,
  shell: shellSortSteps,
  heap: heapSortSteps,
  quick: quickSortSteps,
  radix: radixSortSteps,
};

const algorithmNotes = {
  bubble: 'Bubble Sort repeatedly pushes larger values to the right. Worst-case complexity: O(n^2).',
  insertion: 'Insertion Sort builds a sorted prefix and inserts each next value at the correct position. Worst-case: O(n^2).',
  merge: 'Merge Sort recursively splits and merges ranges. Time complexity: O(n log n), extra memory required.',
  shell: 'Shell Sort performs gapped insertion passes, making nearly sorted arrays converge much faster than plain insertion sort.',
  heap: 'Heap Sort repeatedly extracts the max element from a binary heap. Time complexity: O(n log n), in-place.',
  quick: 'Quick Sort partitions around a pivot. Average complexity: O(n log n), worst-case O(n^2).',
  radix: 'Radix Sort groups values by digit from least-significant to most-significant place. It shines when keys are bounded non-negative integers.',
};

const algorithmProfiles = {
  bubble: { time: 'O(n^2)', memory: 'O(1)', stability: 'Yes', sweetSpot: 'Teaching pairwise swaps and very small arrays.' },
  insertion: { time: 'O(n^2) worst, O(n) near-sorted', memory: 'O(1)', stability: 'Yes', sweetSpot: 'Arrays that are already mostly in order.' },
  merge: { time: 'O(n log n)', memory: 'O(n)', stability: 'Yes', sweetSpot: 'Consistent benchmarking when duplicates matter.' },
  shell: { time: 'Gap-dependent, usually sub-quadratic', memory: 'O(1)', stability: 'No', sweetSpot: 'Medium arrays that need an in-place speedup over insertion sort.' },
  heap: { time: 'O(n log n)', memory: 'O(1)', stability: 'No', sweetSpot: 'Disorder-heavy arrays where worst-case guarantees matter.' },
  quick: { time: 'O(n log n) average', memory: 'O(log n) stack', stability: 'No', sweetSpot: 'General-purpose random-looking inputs.' },
  radix: { time: 'O(d * n)', memory: 'O(n)', stability: 'Yes', sweetSpot: 'Bounded non-negative integers with many repeated digits.' },
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

function updateDiagnostics() {
  if (!baseArray.length) return;

  const pairCount = Math.max(1, (baseArray.length * (baseArray.length - 1)) / 2);
  let inversions = 0;
  for (let i = 0; i < baseArray.length; i += 1) {
    for (let j = i + 1; j < baseArray.length; j += 1) {
      if (baseArray[i] > baseArray[j]) inversions += 1;
    }
  }

  let adjacentSorted = 0;
  for (let i = 1; i < baseArray.length; i += 1) {
    if (baseArray[i] >= baseArray[i - 1]) adjacentSorted += 1;
  }

  const uniqueCount = new Set(baseArray).size;
  const duplicateRate = Math.round(((baseArray.length - uniqueCount) / Math.max(1, baseArray.length)) * 100);
  const spread = `${Math.min(...baseArray)}-${Math.max(...baseArray)}`;
  const inversionRatio = inversions / pairCount;
  const sortedness = Math.round((adjacentSorted / Math.max(1, baseArray.length - 1)) * 100);
  const monotonicRuns = baseArray.reduce((count, value, index, values) => {
    if (index === 0) return 1;
    return value < values[index - 1] ? count + 1 : count;
  }, 0);
  const largestJump = baseArray.reduce((maxJump, value, index, values) => {
    if (index === 0) return 0;
    return Math.max(maxJump, Math.abs(value - values[index - 1]));
  }, 0);
  const sortedValues = [...baseArray].sort((a, b) => a - b);
  const medianIndex = Math.floor(sortedValues.length / 2);
  const median =
    sortedValues.length % 2 === 0
      ? ((sortedValues[medianIndex - 1] + sortedValues[medianIndex]) / 2).toFixed(1)
      : String(sortedValues[medianIndex]);

  diagnosticSortednessEl.textContent = `${sortedness}%`;
  diagnosticDuplicatesEl.textContent = `${duplicateRate}%`;
  diagnosticSpreadEl.textContent = spread;
  diagnosticInversionsEl.textContent = `${Math.round(inversionRatio * 100)}%`;
  fingerprintRunsEl.textContent = String(monotonicRuns);
  fingerprintJumpEl.textContent = String(largestJump);
  fingerprintMedianEl.textContent = median;
  fingerprintUniqueEl.textContent = `${uniqueCount}/${baseArray.length}`;

  let recommendation = 'Quick Sort is a strong default when the input has no clear structural bias.';
  if (sortedness >= 82) {
    recommendation = 'Recommendation: Insertion Sort should stay competitive here because the array is already mostly ordered.';
  } else if (duplicateRate >= 35) {
    recommendation = 'Recommendation: Merge Sort is the safer benchmark here because duplicate-heavy inputs can make partition-based runs look noisy.';
  } else if (inversionRatio >= 0.72) {
    recommendation = 'Recommendation: Heap Sort is a solid baseline for this disorder-heavy workload.';
  }

  diagnosticRecommendationEl.textContent = recommendation;
  fingerprintSummaryEl.textContent = `This array has ${monotonicRuns} monotonic run${monotonicRuns === 1 ? '' : 's'}, a largest adjacent jump of ${largestJump}, and ${uniqueCount} unique value${uniqueCount === 1 ? '' : 's'}.`;
  updateAlgorithmProfile({ sortedness, duplicateRate, inversionRatio });
}

function updateAlgorithmProfile(metrics = null) {
  const profile = algorithmProfiles[algorithmSelect.value];
  if (!profile || !profileTimeEl || !profileFitEl) return;

  profileTimeEl.textContent = profile.time;
  profileMemoryEl.textContent = profile.memory;
  profileStabilityEl.textContent = profile.stability;
  profileSweetSpotEl.textContent = profile.sweetSpot;

  const insight = metrics || {};
  let fit = `${algorithmSelect.options[algorithmSelect.selectedIndex].text} is a reasonable baseline on the current workload.`;
  if (algorithmSelect.value === 'insertion' && (insight.sortedness ?? 0) >= 80) {
    fit = 'Fit: high. The current array is already ordered enough that insertion sort should stay competitive.';
  } else if (algorithmSelect.value === 'merge' && (insight.duplicateRate ?? 0) >= 30) {
    fit = 'Fit: high. Stable merging keeps duplicate-heavy workloads easier to reason about.';
  } else if (algorithmSelect.value === 'heap' && (insight.inversionRatio ?? 0) >= 0.65) {
    fit = 'Fit: high. This workload is disorder-heavy, so heap sort offers a clean worst-case baseline.';
  } else if (algorithmSelect.value === 'radix' && (insight.duplicateRate ?? 0) >= 20) {
    fit = 'Fit: medium-high. Repeated bounded integers make radix passes easier to justify.';
  } else if (algorithmSelect.value === 'bubble' && baseArray.length > 24) {
    fit = 'Fit: low. This array is large enough that bubble sort is mainly useful as a teaching contrast.';
  }

  profileFitEl.textContent = fit;
}

function estimateTheoryOps() {
  const n = Math.max(1, currentArray.length);
  const nLogN = Math.round(n * Math.log2(Math.max(2, n)));

  if (['merge', 'quick', 'heap', 'shell'].includes(algorithmSelect.value)) {
    return `~${nLogN}`;
  }

  if (algorithmSelect.value === 'radix') {
    return `~${n * 2}`;
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
  updateOperationLens();
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

function stepShare(count, total) {
  if (!total) return '0%';
  return `${Math.round((count / total) * 100)}%`;
}

function describeStep(step, index) {
  if (!step) {
    if (!steps.length) return 'Generate an array to inspect the upcoming operation flow.';
    if (index >= steps.length) return 'Replay complete. The array is now sorted.';
    return 'Ready to start replay.';
  }

  if (step.type === 'compare') {
    return `Comparing bars ${step.indices[0] + 1} and ${step.indices[1] + 1} to decide local order.`;
  }

  if (step.type === 'swap') {
    return `Swapping bars ${step.indices[0] + 1} and ${step.indices[1] + 1} because the current ordering is invalid.`;
  }

  return `Writing value ${step.value} into slot ${step.index + 1} as the algorithm rebuilds a sorted region.`;
}

function updateOperationLens() {
  const summary = summarizeOperations(steps);
  operationSummaryEl.textContent = summary.total
    ? `${summary.total} replayable operations are queued for this run.`
    : 'Generate an array to inspect the operation mix.';
  operationCurrentEl.textContent = describeStep(steps[stepIndex] || null, stepIndex);
  operationCompareShareEl.textContent = stepShare(summary.comparisons, summary.total);
  operationSwapShareEl.textContent = stepShare(summary.swaps, summary.total);
  operationWriteShareEl.textContent = stepShare(summary.writes, summary.total);
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
  updateOperationLens();

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

function shellSortSteps(values) {
  const arr = [...values];
  const output = [];

  for (let gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < arr.length; i += 1) {
      const value = arr[i];
      let j = i;

      while (j >= gap) {
        output.push({ type: 'compare', indices: [j - gap, j] });
        if (arr[j - gap] <= value) break;

        arr[j] = arr[j - gap];
        output.push({ type: 'overwrite', index: j, value: arr[j - gap] });
        j -= gap;
      }

      if (arr[j] !== value) {
        arr[j] = value;
        output.push({ type: 'overwrite', index: j, value });
      }
    }
  }

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

function heapSortSteps(values) {
  const arr = [...values];
  const output = [];

  function heapify(length, rootIndex) {
    let largest = rootIndex;
    const left = rootIndex * 2 + 1;
    const right = rootIndex * 2 + 2;

    if (left < length) {
      output.push({ type: 'compare', indices: [left, largest] });
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < length) {
      output.push({ type: 'compare', indices: [right, largest] });
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== rootIndex) {
      [arr[rootIndex], arr[largest]] = [arr[largest], arr[rootIndex]];
      output.push({ type: 'swap', indices: [rootIndex, largest] });
      heapify(length, largest);
    }
  }

  for (let index = Math.floor(arr.length / 2) - 1; index >= 0; index -= 1) {
    heapify(arr.length, index);
  }

  for (let end = arr.length - 1; end > 0; end -= 1) {
    [arr[0], arr[end]] = [arr[end], arr[0]];
    output.push({ type: 'swap', indices: [0, end] });
    heapify(end, 0);
  }

  return output;
}

function radixSortSteps(values) {
  const arr = [...values];
  const output = [];
  const maxValue = Math.max(0, ...arr);

  for (let exp = 1; Math.floor(maxValue / exp) > 0; exp *= 10) {
    const buckets = Array.from({ length: 10 }, () => []);

    arr.forEach((value, index) => {
      output.push({ type: 'compare', indices: [index, index] });
      const digit = Math.floor(value / exp) % 10;
      buckets[digit].push(value);
    });

    let writeIndex = 0;
    buckets.forEach((bucket) => {
      bucket.forEach((value) => {
        arr[writeIndex] = value;
        output.push({ type: 'overwrite', index: writeIndex, value });
        writeIndex += 1;
      });
    });
  }

  return output;
}

function generateSteps() {
  const generator = algorithmGenerators[algorithmSelect.value];
  if (!generator) {
    throw new Error('Unknown algorithm selected.');
  }

  steps = generator(currentArray);
  stepIndex = 0;
  resetStats();
  updateOperationLens();
}

function summarizeOperations(stepList) {
  const summary = { comparisons: 0, swaps: 0, writes: 0, total: stepList.length };

  stepList.forEach((step) => {
    if (step.type === 'compare') summary.comparisons += 1;
    if (step.type === 'swap') summary.swaps += 1;
    if (step.type === 'overwrite') summary.writes += 1;
  });

  return summary;
}

function renderComparisonRows(rows) {
  if (!comparisonBody) return;

  comparisonBody.innerHTML = rows
    .map(
      (row) => `
        <tr>
          <td>${row.label}</td>
          <td>${row.comparisons}</td>
          <td>${row.swaps}</td>
          <td>${row.writes}</td>
          <td>${row.total}</td>
        </tr>
      `
    )
    .join('');
}

function updateBenchmarkVerdict(rows = []) {
  if (!benchmarkVerdictEl || !benchmarkFastestEl || !benchmarkGapEl || !benchmarkStableEl || !benchmarkCoachEl) return;

  if (!rows.length) {
    benchmarkVerdictEl.textContent = 'Run Compare All to see which sorter best fits this workload.';
    benchmarkFastestEl.textContent = '-';
    benchmarkGapEl.textContent = '-';
    benchmarkStableEl.textContent = '-';
    benchmarkCoachEl.textContent = '-';
    return;
  }

  const best = rows[0];
  const worst = rows[rows.length - 1];
  const stablePick = rows.find((row) => algorithmProfiles[row.key]?.stability === 'Yes') || best;
  const gap = worst.total - best.total;
  const gapPct = worst.total ? Math.round((gap / worst.total) * 100) : 0;

  benchmarkVerdictEl.textContent = `${best.label} leads this workload by ${gap} operations over ${worst.label}.`;
  benchmarkFastestEl.textContent = best.label;
  benchmarkGapEl.textContent = `${gap} ops (${gapPct}%)`;
  benchmarkStableEl.textContent = stablePick.label;

  if (best.key === stablePick.key) {
    benchmarkCoachEl.textContent = 'The leading algorithm is also stable, so duplicate-heavy data should stay readable.';
  } else if (stablePick.total - best.total <= Math.max(12, best.total * 0.15)) {
    benchmarkCoachEl.textContent = `${stablePick.label} is close behind and may be the better teaching baseline when stability matters.`;
  } else {
    benchmarkCoachEl.textContent = `${best.label} is the clear efficiency winner, while ${stablePick.label} remains the safer stable reference point.`;
  }
}

function compareAlgorithms() {
  if (!baseArray.length) {
    setStatus('Generate or apply an array before comparing algorithms.');
    return;
  }

  const rows = Object.entries(algorithmGenerators).map(([key, generator]) => {
    const summary = summarizeOperations(generator(baseArray));
    return {
      key,
      label: algorithmSelect.querySelector(`option[value="${key}"]`)?.textContent || key,
      ...summary,
    };
  });

  rows.sort((a, b) => a.total - b.total || a.comparisons - b.comparisons);
  renderComparisonRows(rows);
  updateBenchmarkVerdict(rows);

  if (comparisonSummary) {
    const best = rows[0];
    const worst = rows[rows.length - 1];
    comparisonSummary.textContent = `${best.label} is lightest on this input; ${worst.label} does the most work.`;
  }

  setStatus('Compared all algorithms on the current array.');
}

function resetToBase() {
  stopPlayback();
  currentArray = [...baseArray];
  steps = [];
  stepIndex = 0;
  resetStats();
  renderArray();
  updateStatsDisplay();
  updateOperationLens();
  updateBenchmarkVerdict();
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
  updateDiagnostics();
  updateAlgorithmProfile();
  updateStatsDisplay();
  updateOperationLens();
  updateBenchmarkVerdict();
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

function exportArray() {
  if (!baseArray.length) {
    setStatus('Generate or import an array before exporting.');
    return;
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    algorithm: algorithmSelect.value,
    array: baseArray,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `algorithm-visualizer-array-${baseArray.length}.json`;
  link.click();
  URL.revokeObjectURL(url);
  setStatus(`Exported current array (${baseArray.length} values).`);
}

function parseImportedArray(text) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed.array)) return parsed.array;
  } catch (error) {
    // Fall through to comma/newline parsing.
  }

  return trimmed
    .split(/[\s,]+/)
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => Number.isInteger(value));
}

function importArray(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const values = parseImportedArray(String(reader.result || ''));
      if (!Array.isArray(values) || values.length < 5 || values.length > 120) {
        throw new Error('Array length must be between 5 and 120 values.');
      }

      const normalized = values.map((value) => Math.max(4, Math.min(100, value)));
      customArrayInput.value = normalized.join(', ');
      sizeSlider.value = String(normalized.length);
      sizeValue.textContent = String(normalized.length);
      setBaseArray(normalized, `Imported array (${normalized.length} values). Values were clamped to the visual range when needed.`);
    } catch (error) {
      setStatus('Could not import that file. Use JSON, CSV, or plain text with 5-120 integers.');
    } finally {
      event.target.value = '';
    }
  };

  reader.readAsText(file);
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
  updateOperationLens();
  setStatus(`Moved back to ${stepIndex}/${steps.length}.`);
});

resetBtn.addEventListener('click', resetToBase);
compareBtn?.addEventListener('click', compareAlgorithms);
exportArrayBtn?.addEventListener('click', exportArray);
importArrayBtn?.addEventListener('click', () => importArrayFile?.click());
importArrayFile?.addEventListener('change', importArray);
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
  updateAlgorithmProfile();
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
