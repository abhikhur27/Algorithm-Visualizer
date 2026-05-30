# Algorithm Visualizer Lab

Professional sorting visualizer for studying algorithm behavior step-by-step.

## Features

- Sorting algorithms: Bubble, Insertion, Merge, Shell, Heap, Quick, Radix.
- Tight control surface: apply array, randomize, compare all, start/pause/step/back/reset.
- Auto-pick best-fit control uses workload shape to recommend the most defensible first sorter before benchmarking.
- Shortcut support now includes `P` for best-fit auto-pick before a compare-all pass.
- Keyboard shortcut `G` now runs the full preset gauntlet benchmark without reaching for the mouse.
- Step scrubber for dragging directly to any replay point after generating operations.
- Adjustable array size and animation speed.
- Core diagnostics: sortedness, duplicate rate, value spread, inversions, algorithm profile, and benchmark verdict.
- One-click comparison snapshot across all implemented sorting algorithms.
- Operation counters:
  - Comparisons
  - Swaps
  - Writes
- Responsive bar visualization with color-coded state legend.

## Technical Design

- `index.html`: semantic controls and metrics layout.
- `style.css`: responsive visual system and high-contrast states.
- `script.js`: operation-generation approach where each algorithm emits replayable steps.

```mermaid
flowchart TD
  A[Generate Random Array] --> B[Select Algorithm]
  B --> C[Create Operation Steps]
  C --> D[Playback Engine]
  D --> E[Array Renderer]
  D --> F[Metric Counters]
```

## Why This Design

Instead of sorting directly in the DOM, each algorithm produces a list of deterministic operations (`compare`, `swap`, `overwrite`). That makes the UI easier to test, pause/resume, and step through.

## Local Run

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Reproducible Workloads

- The app preserves its active workload in the URL, so shared links can reopen the same sorter, sliders, and array state.
- The UI now exposes the whole workload utility shelf directly: share link, save workload, import/export, compare CSV, compare tape, and gauntlet runs.
- Use the built-in share/export controls when you want a benchmark discussion to stay tied to one exact input shape instead of a fresh random run.

## Portfolio Demo Path

1. Load the `Reversed` preset.
2. Run `Compare All` to create a benchmark verdict.
3. Scrub through Quick Sort or Merge Sort to show replayable operations.
4. Contrast with Bubble Sort to make performance tradeoffs obvious.

## GitHub Pages Compatibility

- Pure static assets.
- No build pipeline required.
- Deploy from repository root.

## Portfolio Positioning

- Honest label: browser-based sorting visualizer, not native systems software.
- Strongest portfolio use: replayable algorithm explanation and workload comparison.
- Current quality bar: keep the control surface teachable and avoid turning the page into a diagnostics wall.

## Future Improvements

- Add side-by-side visual diffing between two selected sorters on the same workload.
- Add comparison history across multiple imported workloads.

## Sanity Benchmark Script

For consistent portfolio claims, use this benchmark script before sharing results:

1. Run `Nearly Sorted` at 80 bars and capture `Compare All`.
2. Run `Few Unique` at 80 bars and capture `Compare All`.
3. Run `Reversed` at 120 bars and capture `Compare All`.
4. Report the best/worst algorithm by workload type rather than one global winner.
