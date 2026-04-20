# Algorithm Visualizer Lab

Professional sorting visualizer for studying algorithm behavior step-by-step.

## Features

- Sorting algorithms: Bubble, Insertion, Merge, Shell, Heap, Quick, Radix.
- Playback controls: start, pause, step, reset, randomize.
- Step scrubber for dragging directly to any replay point after generating operations.
- Adjustable array size and animation speed.
- Import/export arrays as JSON, CSV, or plain text for reproducible benchmarks.
- One-click comparison snapshot across all implemented sorting algorithms.
- Copy Benchmark Brief turns the current workload, selected run stats, and compare-all ranking into a clipboard-ready summary.
- Compare-all snapshots can now be exported as CSV for portfolio writeups or repeatable benchmarking notes.
- Benchmark verdict now calls out the runner-up and how far the currently selected algorithm trails or leads the winner.
- Workload diagnostics for sortedness, duplicate rate, value spread, and inversion pressure.
- Array fingerprint panel for monotonic runs, adjacent jump severity, median, and uniqueness density.
- Workload matchup panel forecasts the best-fit sorter, safest baseline, and riskiest pick before compare-all benchmarks.
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

## GitHub Pages Compatibility

- Pure static assets.
- No build pipeline required.
- Deploy from repository root.

## Future Improvements

- Add radix sort and shell sort.
- Add comparison history across multiple imported workloads.
