const arrayContainer = document.getElementById('array-container');
const algorithmSelect = document.getElementById('algorithm-select');
const sizeSlider = document.getElementById('size-slider');
const speedSlider = document.getElementById('speed-slider');
const customArrayInput = document.getElementById('custom-array');
const applyArrayBtn = document.getElementById('apply-array-btn');
const presetArrayButtons = Array.from(document.querySelectorAll('.preset-array-btn'));
const compareBtn = document.getElementById('compare-btn');
const shareArrayBtn = document.getElementById('share-array-btn');
const exportArrayBtn = document.getElementById('export-array-btn');
const exportCompareBtn = document.getElementById('export-compare-btn');
const copyBriefBtn = document.getElementById('copy-brief-btn');
const importArrayBtn = document.getElementById('import-array-btn');
const importArrayFile = document.getElementById('import-array-file');
const gauntletBtn = document.getElementById('gauntlet-btn');
const sizeValue = document.getElementById('size-value');
const speedValue = document.getElementById('speed-value');
const randomizeBtn = document.getElementById('randomize-btn');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const stepBtn = document.getElementById('step-btn');
const backBtn = document.getElementById('back-btn');
const resetBtn = document.getElementById('reset-btn');
const statusText = document.getElementById('status-text');
const stepScrubber = document.getElementById('step-scrubber');
const scrubberValue = document.getElementById('scrubber-value');
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
const matchupSummaryEl = document.getElementById('matchup-summary');
const matchupBestEl = document.getElementById('matchup-best');
const matchupBaselineEl = document.getElementById('matchup-baseline');
const matchupRiskEl = document.getElementById('matchup-risk');
const matchupSelectedEl = document.getElementById('matchup-selected');
const experimentCoachSummaryEl = document.getElementById('experiment-coach-summary');
const experimentCoachBestEl = document.getElementById('experiment-coach-best');
const experimentCoachContrastEl = document.getElementById('experiment-coach-contrast');
const experimentCoachAngleEl = document.getElementById('experiment-coach-angle');
const experimentCoachWatchEl = document.getElementById('experiment-coach-watch');
const operationSummaryEl = document.getElementById('operation-summary');
const operationCurrentEl = document.getElementById('operation-current');
const operationCompareShareEl = document.getElementById('operation-compare-share');
const operationSwapShareEl = document.getElementById('operation-swap-share');
const operationWriteShareEl = document.getElementById('operation-write-share');
const teachingCutSummaryEl = document.getElementById('teaching-cut-summary');
const teachingCutListEl = document.getElementById('teaching-cut-list');
const benchmarkVerdictEl = document.getElementById('benchmark-verdict');
const benchmarkFastestEl = document.getElementById('benchmark-fastest');
const benchmarkGapEl = document.getElementById('benchmark-gap');
const benchmarkStableEl = document.getElementById('benchmark-stable');
const benchmarkRunnerUpEl = document.getElementById('benchmark-runner-up');
const benchmarkSelectedGapEl = document.getElementById('benchmark-selected-gap');
const benchmarkCoachEl = document.getElementById('benchmark-coach');
const comparisonBody = document.getElementById('comparison-body');
const comparisonSummary = document.getElementById('comparison-summary');
const comparisonHistorySummary = document.getElementById('comparison-history-summary');
const comparisonHistoryBody = document.getElementById('comparison-history-body');
const stabilitySummaryEl = document.getElementById('stability-summary');
const stabilityStreakEl = document.getElementById('stability-streak');
const stabilitySpreadEl = document.getElementById('stability-spread');
const stabilityBaselineEl = document.getElementById('stability-baseline');
const stabilityCueEl = document.getElementById('stability-cue');
const contrastSummaryEl = document.getElementById('contrast-summary');
const contrastAnchorEl = document.getElementById('contrast-anchor');
const contrastOpponentEl = document.getElementById('contrast-opponent');
const contrastAngleEl = document.getElementById('contrast-angle');
const contrastHistoryEl = document.getElementById('contrast-history');
const gauntletSummaryEl = document.getElementById('gauntlet-summary');
const gauntletLeaderEl = document.getElementById('gauntlet-leader');
const gauntletBaselineEl = document.getElementById('gauntlet-baseline');
const gauntletUpsetEl = document.getElementById('gauntlet-upset');
const gauntletCueEl = document.getElementById('gauntlet-cue');
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
let lastComparisonRows = [];
let comparisonHistory = [];
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
    comparisonHistory,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function syncUrlState() {
  const params = new URLSearchParams(window.location.search);
  params.set('algorithm', algorithmSelect.value);
  params.set('size', sizeSlider.value);
  params.set('speed', speedSlider.value);

  const customArray = customArrayInput.value.trim();
  if (customArray) {
    params.set('custom', customArray);
  } else {
    params.delete('custom');
  }

  if (baseArray.length) {
    params.set('array', baseArray.join(','));
  } else {
    params.delete('array');
  }

  const nextUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', nextUrl);
}

function hydrateFromUrlState() {
  const params = new URLSearchParams(window.location.search);
  if (![...params.keys()].length) return null;

  const algorithm = params.get('algorithm');
  if (algorithm && algorithmGenerators[algorithm]) {
    algorithmSelect.value = algorithm;
  }

  const nextSize = Number.parseInt(params.get('size') || '', 10);
  if (Number.isInteger(nextSize) && nextSize >= 10 && nextSize <= 80) {
    sizeSlider.value = String(nextSize);
  }

  const nextSpeed = Number.parseInt(params.get('speed') || '', 10);
  if (Number.isInteger(nextSpeed) && nextSpeed >= 20 && nextSpeed <= 300) {
    speedSlider.value = String(nextSpeed);
  }

  const custom = params.get('custom');
  if (typeof custom === 'string') {
    customArrayInput.value = custom;
  }

  const sharedArray = parseImportedArray(params.get('array') || '');
  if (Array.isArray(sharedArray) && sharedArray.length >= 5 && sharedArray.length <= 120) {
    return sharedArray.map((value) => Math.max(4, Math.min(100, value)));
  }

  return null;
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
  syncScrubber();
}

function syncScrubber() {
  if (!stepScrubber || !scrubberValue) return;
  stepScrubber.max = String(Math.max(0, steps.length));
  stepScrubber.value = String(Math.min(stepIndex, steps.length));
  stepScrubber.disabled = isRunning || steps.length === 0;
  scrubberValue.textContent = `${Math.min(stepIndex, steps.length)} / ${steps.length}`;
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
  updateWorkloadMatchup({ sortedness, duplicateRate, inversionRatio });
  updateAlgorithmProfile({ sortedness, duplicateRate, inversionRatio });
  updateExperimentCoach({ sortedness, duplicateRate, inversionRatio, spread: Math.max(...baseArray) - Math.min(...baseArray) });
}

function updateExperimentCoach(metrics = null) {
  if (!experimentCoachSummaryEl || !experimentCoachBestEl || !experimentCoachContrastEl || !experimentCoachAngleEl || !experimentCoachWatchEl) {
    return;
  }

  if (!baseArray.length) {
    experimentCoachSummaryEl.textContent = 'Generate an array to stage the next contrast test.';
    experimentCoachBestEl.textContent = '-';
    experimentCoachContrastEl.textContent = '-';
    experimentCoachAngleEl.textContent = '-';
    experimentCoachWatchEl.textContent = '-';
    return;
  }

  const selected = algorithmSelect.value;
  const sortedness = metrics?.sortedness ?? 50;
  const duplicateRate = metrics?.duplicateRate ?? 0;
  const spread = metrics?.spread ?? Math.max(...baseArray) - Math.min(...baseArray);

  const coach = {
    summary: 'Use the current array as a baseline, then run one preset contrast so the algorithm tradeoff becomes legible.',
    best: 'Nearly Sorted preset',
    contrast: 'Reversed preset',
    angle: 'Compare a friendly input against a hostile one with the same sorter selected.',
    watch: 'Use Compare All after each run so the contrast is anchored in operation counts, not just animation feel.',
  };

  if (selected === 'bubble' || selected === 'insertion') {
    coach.best = sortedness >= 70 ? 'Keep this workload or reload Nearly Sorted.' : 'Nearly Sorted preset';
    coach.contrast = 'Reversed preset';
    coach.angle = 'Frame the selected sorter as an input-shape specialist rather than a generic winner.';
    coach.watch = 'Narrate how quickly the best case collapses once local order disappears.';
  } else if (selected === 'shell') {
    coach.best = sortedness >= 50 ? 'Nearly Sorted preset' : 'Current workload';
    coach.contrast = 'Reversed preset';
    coach.angle = 'Show Shell Sort as the in-place bridge between insertion-style locality and heavier sorters.';
    coach.watch = 'Use the write count to show whether the gap passes are actually reducing churn.';
  } else if (selected === 'merge' || selected === 'heap' || selected === 'quick') {
    coach.best = spread <= 35 ? 'Randomize for a wider spread.' : 'Current workload is already a fair benchmark.';
    coach.contrast = 'Few Unique preset';
    coach.angle = 'Use duplicate-heavy data to show whether fast also means well behaved for this sorter.';
    coach.watch = 'Call out whether the selected algorithm wins on total work or simply avoids the worst-case blow-up.';
  } else if (selected === 'radix') {
    coach.best = 'Few Unique preset';
    coach.contrast = 'Randomize, then switch to Quick Sort or Merge Sort.';
    coach.angle = 'Frame Radix Sort as a data-domain specialist, not a universal replacement.';
    coach.watch = 'Mention that its advantage depends on bounded non-negative integers in this app.';
  }

  if (duplicateRate >= 35) {
    coach.summary = 'This workload is duplicate-heavy, so the best demo is a stability-flavored contrast rather than a pure speed race.';
  } else if (sortedness >= 75) {
    coach.summary = 'This workload is already close to sorted, which makes it ideal for explaining why input shape matters as much as asymptotic complexity.';
  } else if (spread <= 24) {
    coach.summary = 'The value band is tight, so this is a good spot to discuss when the data domain changes the right algorithm pick.';
  }

  experimentCoachSummaryEl.textContent = coach.summary;
  experimentCoachBestEl.textContent = coach.best;
  experimentCoachContrastEl.textContent = coach.contrast;
  experimentCoachAngleEl.textContent = coach.angle;
  experimentCoachWatchEl.textContent = coach.watch;
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

function updateWorkloadMatchup(metrics) {
  if (!matchupSummaryEl || !matchupBestEl || !matchupBaselineEl || !matchupRiskEl || !matchupSelectedEl) {
    return;
  }

  const selectedLabel = algorithmSelect.options[algorithmSelect.selectedIndex]?.text || 'Selected algorithm';
  let bestFit = 'Quick Sort';
  let baseline = 'Merge Sort';
  let risk = 'Bubble Sort';
  let selectedRead = `${selectedLabel} reads like a neutral baseline on this workload.`;
  let summary = 'This array looks general-purpose, so compare a fast partition-based sort against a stable merge baseline.';

  if ((metrics.sortedness ?? 0) >= 82) {
    bestFit = 'Insertion Sort';
    baseline = 'Shell Sort';
    risk = 'Bubble Sort';
    summary = 'High pre-existing order should reward algorithms that preserve a nearly sorted prefix instead of rebuilding the array from scratch.';
  } else if ((metrics.duplicateRate ?? 0) >= 35) {
    bestFit = 'Merge Sort';
    baseline = 'Radix Sort';
    risk = 'Quick Sort';
    summary = 'Duplicate-heavy workloads favor stable or digit-bucketed passes more than naive partitioning.';
  } else if ((metrics.inversionRatio ?? 0) >= 0.72) {
    bestFit = 'Heap Sort';
    baseline = 'Merge Sort';
    risk = 'Insertion Sort';
    summary = 'Disorder is high enough that worst-case-safe n log n baselines should outperform incremental fix-up strategies.';
  }

  if (algorithmSelect.value === 'insertion') {
    selectedRead =
      (metrics.sortedness ?? 0) >= 82
        ? 'Insertion Sort is aligned with the current order bias and should stay competitive.'
        : 'Insertion Sort is playable here, but it needs stronger existing order to become the best fit.';
  } else if (algorithmSelect.value === 'merge') {
    selectedRead =
      (metrics.duplicateRate ?? 0) >= 35
        ? 'Merge Sort is aligned with the duplicate-heavy shape and offers a clean stable baseline.'
        : 'Merge Sort is a safe benchmark even if the workload does not strongly demand stability.';
  } else if (algorithmSelect.value === 'heap') {
    selectedRead =
      (metrics.inversionRatio ?? 0) >= 0.72
        ? 'Heap Sort matches the current disorder-heavy profile and gives a dependable worst-case baseline.'
        : 'Heap Sort is robust here, but the workload does not clearly require its worst-case posture.';
  } else if (algorithmSelect.value === 'quick') {
    selectedRead =
      (metrics.duplicateRate ?? 0) >= 35
        ? 'Quick Sort is the main risk pick here because duplicate-heavy inputs can produce noisy partition costs.'
        : 'Quick Sort still reads like the fast default when the array has no strong structural bias.';
  } else if (algorithmSelect.value === 'radix') {
    selectedRead =
      (metrics.duplicateRate ?? 0) >= 20
        ? 'Radix Sort becomes more plausible when bounded integer keys repeat across the array.'
        : 'Radix Sort works, but the current array shape does not clearly justify digit-pass overhead.';
  } else if (algorithmSelect.value === 'bubble') {
    selectedRead = 'Bubble Sort remains a teaching contrast here rather than a likely winner.';
  } else if (algorithmSelect.value === 'shell') {
    selectedRead =
      (metrics.sortedness ?? 0) >= 70
        ? 'Shell Sort is a sensible fast baseline when the array is partially ordered but not insertion-friendly enough.'
        : 'Shell Sort is viable here, though the workload does not strongly demand its gap-pass behavior.';
  }

  matchupSummaryEl.textContent = summary;
  matchupBestEl.textContent = bestFit;
  matchupBaselineEl.textContent = baseline;
  matchupRiskEl.textContent = risk;
  matchupSelectedEl.textContent = selectedRead;
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
  syncScrubber();
}

function finishPlayback() {
  stopPlayback();
  renderArray({ done: true });
  setStatus(`Completed in ${stepIndex} steps.`);
  updateOperationLens();
  syncScrubber();
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
  updateTeachingCut(summary);
}

function updateTeachingCut(summary) {
  if (!teachingCutSummaryEl || !teachingCutListEl) return;

  if (!steps.length) {
    teachingCutSummaryEl.textContent = 'Generate steps to get a compact narration path.';
    teachingCutListEl.innerHTML = '';
    return;
  }

  const selectedIndexes = [0, Math.floor(steps.length * 0.25), Math.floor(steps.length * 0.5), Math.floor(steps.length * 0.75), steps.length - 1]
    .filter((value, index, values) => value >= 0 && values.indexOf(value) === index);
  const dominant = summary.writes > summary.swaps && summary.writes > summary.comparisons
    ? 'write-heavy'
    : summary.swaps > summary.writes
      ? 'swap-heavy'
      : 'comparison-heavy';

  teachingCutSummaryEl.textContent = `${algorithmSelect.options[algorithmSelect.selectedIndex].text} is ${dominant} on this input; narrate these checkpoints instead of every operation.`;
  teachingCutListEl.innerHTML = selectedIndexes
    .map((index) => `<li><strong>Step ${index + 1}</strong>: ${describeStep(steps[index], index)}</li>`)
    .join('');
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
  syncScrubber();
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

function renderComparisonHistory() {
  if (!comparisonHistorySummary || !comparisonHistoryBody) return;
  if (!comparisonHistory.length) {
    comparisonHistorySummary.textContent = 'No benchmark history saved yet.';
    comparisonHistoryBody.innerHTML = '<article class="comparison-history-item"><strong>Waiting for a compare-all run.</strong><p>Benchmark a workload to keep a reusable before/after snapshot for future demos.</p></article>';
    renderStabilityRead();
    return;
  }

  comparisonHistorySummary.textContent = `${comparisonHistory.length} compare-all snapshot${comparisonHistory.length === 1 ? '' : 's'} saved locally.`;
  comparisonHistoryBody.innerHTML = comparisonHistory
    .map((entry) => `
      <article class="comparison-history-item">
        <strong>${entry.best} led on ${entry.arrayLabel}.</strong>
        <p>${entry.summary}</p>
        <p>Array preview: ${entry.arrayPreview}</p>
      </article>
    `)
    .join('');
  renderStabilityRead();
}

function renderStabilityRead() {
  if (!stabilitySummaryEl || !stabilityStreakEl || !stabilitySpreadEl || !stabilityBaselineEl || !stabilityCueEl) return;

  if (!comparisonHistory.length) {
    stabilitySummaryEl.textContent = 'Run Compare All a few times to inspect winner consistency.';
    stabilityStreakEl.textContent = '-';
    stabilitySpreadEl.textContent = '-';
    stabilityBaselineEl.textContent = '-';
    stabilityCueEl.textContent = '-';
    return;
  }

  const winners = comparisonHistory.map((entry) => entry.best);
  const leader = winners[0];
  let streak = 0;
  for (const winner of winners) {
    if (winner !== leader) break;
    streak += 1;
  }

  const winnerCounts = winners.reduce((acc, winner) => {
    acc[winner] = (acc[winner] || 0) + 1;
    return acc;
  }, {});
  const uniqueWinners = Object.keys(winnerCounts);
  const repeatableBaseline = uniqueWinners.sort((a, b) => winnerCounts[b] - winnerCounts[a])[0];

  stabilitySummaryEl.textContent =
    uniqueWinners.length === 1
      ? `${leader} has won every saved compare-all snapshot so far.`
      : `${leader} led the latest run, but ${uniqueWinners.length} different algorithms have won across recent workloads.`;
  stabilityStreakEl.textContent = `${leader} x${streak}`;
  stabilitySpreadEl.textContent = `${uniqueWinners.length} winner${uniqueWinners.length === 1 ? '' : 's'} in ${comparisonHistory.length} runs`;
  stabilityBaselineEl.textContent = `${repeatableBaseline} (${winnerCounts[repeatableBaseline]} wins)`;

  if (uniqueWinners.length === 1) {
    stabilityCueEl.textContent = 'This workload family is behaving consistently, so the same winner is a credible demo anchor.';
  } else if (streak >= 2) {
    stabilityCueEl.textContent = 'The latest winner is building a streak, so contrast it against one earlier upset to show where the boundary moves.';
  } else {
    stabilityCueEl.textContent = 'Winner churn is high, so frame this tool around input-shape sensitivity rather than a universal best sorter.';
  }
}

function renderContrastPlanner(rows = lastComparisonRows) {
  if (!contrastSummaryEl || !contrastAnchorEl || !contrastOpponentEl || !contrastAngleEl || !contrastHistoryEl) return;

  if (!rows.length) {
    contrastSummaryEl.textContent = 'Run Compare All to pick an anchor sorter and its best contrast.';
    contrastAnchorEl.textContent = '-';
    contrastOpponentEl.textContent = '-';
    contrastAngleEl.textContent = '-';
    contrastHistoryEl.textContent = '-';
    return;
  }

  const leader = rows[0];
  const runnerUp = rows[1] || rows[0];
  const worst = rows[rows.length - 1];
  const gapToRunnerUp = Math.max(0, runnerUp.total - leader.total);
  const closeRace = runnerUp !== leader && gapToRunnerUp <= Math.max(12, leader.total * 0.12);
  const contrast = closeRace ? runnerUp : worst;
  const winnerCounts = comparisonHistory.reduce((acc, entry) => {
    acc[entry.best] = (acc[entry.best] || 0) + 1;
    return acc;
  }, {});
  const leaderHistory = winnerCounts[leader.label] || 0;

  contrastSummaryEl.textContent = `${leader.label} is the anchor; ${contrast.label} gives the clearest contrast on this workload.`;
  contrastAnchorEl.textContent = `${leader.label} (${leader.total} ops)`;
  contrastOpponentEl.textContent = `${contrast.label} (${contrast.total} ops)`;
  contrastAngleEl.textContent = closeRace
    ? `${runnerUp.label} stayed within ${gapToRunnerUp} ops, so this is a specialist-vs-specialist comparison.`
    : `${contrast.label} trails by ${Math.max(0, contrast.total - leader.total)} ops, which makes the workload fit boundary obvious fast.`;
  contrastHistoryEl.textContent =
    leaderHistory >= 2
      ? `${leader.label} has already won ${leaderHistory} recent snapshot${leaderHistory === 1 ? '' : 's'}, so the anchor looks repeatable.`
      : 'Winner history is still mixed, so this run is best framed as one workload-specific read rather than a universal rule.';
}

function runPresetGauntlet() {
  if (!gauntletSummaryEl || !gauntletLeaderEl || !gauntletBaselineEl || !gauntletUpsetEl || !gauntletCueEl) return;

  const size = Number(sizeSlider.value);
  const workloads = [
    { label: 'Randomized', values: randomArray(size) },
    { label: 'Nearly Sorted', values: patternedArray(size, 'nearly') },
    { label: 'Reversed', values: patternedArray(size, 'reversed') },
    { label: 'Few Unique', values: patternedArray(size, 'few') },
  ];

  const results = workloads.map((workload) => {
    const rows = Object.entries(algorithmGenerators)
      .map(([key, generator]) => {
        const summary = summarizeOperations(generator(workload.values));
        return {
          key,
          label: algorithmSelect.querySelector(`option[value="${key}"]`)?.textContent || key,
          total: summary.total,
        };
      })
      .sort((a, b) => a.total - b.total);

    return { workload: workload.label, rows };
  });

  const winCounts = {};
  const podiumCounts = {};
  results.forEach(({ rows }) => {
    rows.forEach((row, index) => {
      podiumCounts[row.label] = (podiumCounts[row.label] || 0) + (rows.length - index);
    });
    winCounts[rows[0].label] = (winCounts[rows[0].label] || 0) + 1;
  });

  const leader = Object.keys(winCounts).sort((a, b) => winCounts[b] - winCounts[a])[0];
  const baseline = Object.keys(podiumCounts).sort((a, b) => podiumCounts[b] - podiumCounts[a])[0];
  const biggestUpset = results
    .map(({ workload, rows }) => ({
      workload,
      winner: rows[0],
      runnerUp: rows[1] || rows[0],
      margin: (rows[1]?.total || rows[0].total) - rows[0].total,
    }))
    .sort((a, b) => b.margin - a.margin)[0];

  gauntletSummaryEl.textContent = `${leader} won ${winCounts[leader]} of ${results.length} preset families in the current gauntlet.`;
  gauntletLeaderEl.textContent = `${leader} (${winCounts[leader]} wins)`;
  gauntletBaselineEl.textContent = `${baseline} (${podiumCounts[baseline]} podium points)`;
  gauntletUpsetEl.textContent = `${biggestUpset.workload}: ${biggestUpset.winner.label} by ${biggestUpset.margin} ops`;
  gauntletCueEl.textContent =
    leader === baseline
      ? `${leader} is both the repeat winner and the steadiest baseline, so it is the cleanest anchor for multi-workload demos.`
      : `${leader} wins the most presets, but ${baseline} is steadier across the full field. Use both to explain specialist vs baseline behavior.`;
  setStatus('Preset gauntlet complete.');
}

function updateBenchmarkVerdict(rows = []) {
  if (!benchmarkVerdictEl || !benchmarkFastestEl || !benchmarkGapEl || !benchmarkStableEl || !benchmarkCoachEl) return;

  if (!rows.length) {
    benchmarkVerdictEl.textContent = 'Run Compare All to see which sorter best fits this workload.';
    benchmarkFastestEl.textContent = '-';
    benchmarkGapEl.textContent = '-';
    benchmarkStableEl.textContent = '-';
    if (benchmarkRunnerUpEl) benchmarkRunnerUpEl.textContent = '-';
    if (benchmarkSelectedGapEl) benchmarkSelectedGapEl.textContent = '-';
    benchmarkCoachEl.textContent = '-';
    return;
  }

  const best = rows[0];
  const runnerUp = rows[1] || rows[0];
  const worst = rows[rows.length - 1];
  const stablePick = rows.find((row) => algorithmProfiles[row.key]?.stability === 'Yes') || best;
  const selectedKey = algorithmSelect.value;
  const selected = rows.find((row) => row.key === selectedKey) || best;
  const gap = worst.total - best.total;
  const gapPct = worst.total ? Math.round((gap / worst.total) * 100) : 0;
  const selectedGap = selected.total - best.total;
  const selectedGapPct = selected.total ? Math.round((selectedGap / selected.total) * 100) : 0;

  benchmarkVerdictEl.textContent = `${best.label} leads this workload by ${gap} operations over ${worst.label}.`;
  benchmarkFastestEl.textContent = best.label;
  benchmarkGapEl.textContent = `${gap} ops (${gapPct}%)`;
  benchmarkStableEl.textContent = stablePick.label;
  if (benchmarkRunnerUpEl) {
    benchmarkRunnerUpEl.textContent =
      runnerUp.key === best.key ? `${best.label} (clear lead)` : `${runnerUp.label} (+${runnerUp.total - best.total} ops)`;
  }
  if (benchmarkSelectedGapEl) {
    benchmarkSelectedGapEl.textContent =
      selected.key === best.key ? 'Currently best fit' : `+${selectedGap} ops (${selectedGapPct}%)`;
  }

  if (best.key === stablePick.key) {
    benchmarkCoachEl.textContent = 'The leading algorithm is also stable, so duplicate-heavy data should stay readable.';
  } else if (selected.key === best.key) {
    benchmarkCoachEl.textContent = `${selected.label} already leads this workload, so the current pick is aligned with the input shape.`;
  } else if (selectedGap <= Math.max(12, best.total * 0.12)) {
    benchmarkCoachEl.textContent = `${selected.label} is close to the winner, so the current pick is still defensible if its behavior is easier to teach.`;
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
  lastComparisonRows = rows.map((row) => ({ ...row }));
  renderComparisonRows(rows);
  updateBenchmarkVerdict(rows);

  if (comparisonSummary) {
    const best = rows[0];
    const worst = rows[rows.length - 1];
    comparisonSummary.textContent = `${best.label} is lightest on this input; ${worst.label} does the most work.`;
  }

  const best = rows[0];
  const worst = rows[rows.length - 1];
  comparisonHistory = [
    {
      best: best.label,
      arrayLabel: `${baseArray.length}-value workload`,
      arrayPreview: baseArray.slice(0, 10).join(', '),
      summary: `${best.label} beat ${rows[1]?.label || worst.label} by ${Math.max(0, (rows[1]?.total || best.total) - best.total)} operations while ${worst.label} landed last.`,
    },
    ...comparisonHistory,
  ].slice(0, 5);
  renderComparisonHistory();
  persistState();
  renderContrastPlanner(rows);

  setStatus('Compared all algorithms on the current array.');
}

function exportComparisonCsv() {
  if (!lastComparisonRows.length) {
    setStatus('Run Compare All before exporting the benchmark snapshot.');
    return;
  }

  const lines = [
    ['algorithm', 'comparisons', 'swaps', 'writes', 'total_operations'].join(','),
    ...lastComparisonRows.map((row) => [row.label, row.comparisons, row.swaps, row.writes, row.total].join(',')),
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'algorithm-visualizer-compare.csv';
  anchor.click();
  URL.revokeObjectURL(url);
  setStatus('Exported compare-all snapshot as CSV.');
}

function buildBenchmarkBrief() {
  const selectedLabel = algorithmSelect.options[algorithmSelect.selectedIndex]?.text || 'Selected algorithm';
  const lines = [
    'Algorithm Visualizer Benchmark Brief',
    '',
    `Selected algorithm: ${selectedLabel}`,
    `Array size: ${baseArray.length}`,
    `Current workload: ${baseArray.join(', ')}`,
    `Fingerprint: sortedness ${diagnosticSortednessEl?.textContent || '-'} | duplicate rate ${diagnosticDuplicatesEl?.textContent || '-'} | spread ${diagnosticSpreadEl?.textContent || '-'} | inversions ${diagnosticInversionsEl?.textContent || '-'}`,
    `Selected run stats: comparisons ${stats.comparisons}, swaps ${stats.swaps}, writes ${stats.writes}, steps ${steps.length}`,
    `Workload matchup: ${matchupSummaryEl?.textContent || '-'}`,
    `Benchmark verdict: ${benchmarkVerdictEl?.textContent || comparisonSummary?.textContent || 'Compare all algorithms to produce a benchmark verdict.'}`,
  ];

  if (lastComparisonRows.length) {
    lines.push('');
    lines.push('Compare-all ranking:');
    lastComparisonRows.forEach((row, index) => {
      lines.push(`${index + 1}. ${row.label} | total ${row.total} | comparisons ${row.comparisons} | swaps ${row.swaps} | writes ${row.writes}`);
    });
  }

  return lines.join('\n');
}

function resetToBase() {
  stopPlayback();
  currentArray = [...baseArray];
  steps = [];
  stepIndex = 0;
  lastComparisonRows = [];
  resetStats();
  renderArray();
  updateStatsDisplay();
  updateOperationLens();
  updateBenchmarkVerdict();
  syncScrubber();
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
  updateExperimentCoach();
  updateStatsDisplay();
  updateOperationLens();
  updateBenchmarkVerdict();
  if (message) {
    setStatus(message);
  }
  syncScrubber();
  persistState();
  syncUrlState();
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

stepScrubber?.addEventListener('input', () => {
  if (isRunning || !steps.length) return;
  stepIndex = Number(stepScrubber.value);
  rebuildToStep(stepIndex);
  renderArray(stepIndex >= steps.length ? { done: true } : {});
  updateStatsDisplay();
  updateOperationLens();
  setStatus(`Scrubbed to ${stepIndex}/${steps.length}.`);
});

resetBtn.addEventListener('click', resetToBase);
compareBtn?.addEventListener('click', compareAlgorithms);
gauntletBtn?.addEventListener('click', runPresetGauntlet);
exportArrayBtn?.addEventListener('click', exportArray);
exportCompareBtn?.addEventListener('click', exportComparisonCsv);
copyBriefBtn?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(buildBenchmarkBrief());
    setStatus('Copied a benchmark brief with the current workload and algorithm summary.');
  } catch (error) {
    setStatus('Clipboard copy failed in this environment.');
  }
});
shareArrayBtn?.addEventListener('click', async () => {
  syncUrlState();
  try {
    await navigator.clipboard.writeText(window.location.href);
    setStatus('Share link copied with the current algorithm, controls, and array.');
  } catch (error) {
    setStatus('Clipboard copy failed in this environment.');
  }
});
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
  updateExperimentCoach();
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
  if (Array.isArray(persistedState.comparisonHistory)) comparisonHistory = persistedState.comparisonHistory.slice(0, 5);
}
const sharedArray = hydrateFromUrlState();

sizeValue.textContent = sizeSlider.value;
speedValue.textContent = speedSlider.value;
updateNote();

if (Array.isArray(sharedArray) && sharedArray.length >= 5) {
  sizeSlider.value = String(sharedArray.length);
  sizeValue.textContent = String(sharedArray.length);
  customArrayInput.value = sharedArray.join(', ');
  setBaseArray(sharedArray, 'Loaded shared workload from the URL.');
} else if (Array.isArray(persistedState?.baseArray) && persistedState.baseArray.length >= 5) {
  setBaseArray(persistedState.baseArray, 'Restored your last array + control settings.');
} else {
  regenerateArray();
}

updateStatsDisplay();
renderComparisonHistory();
renderContrastPlanner();
