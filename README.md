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
- Stability read tracks whether recent compare-all winners are repeating or changing across workloads.
- Workload diagnostics for sortedness, duplicate rate, value spread, and inversion pressure.
- Array fingerprint panel for monotonic runs, adjacent jump severity, median, and uniqueness density.
- Workload matchup panel forecasts the best-fit sorter, safest baseline, and riskiest pick before compare-all benchmarks.
- Experiment coach recommends the next preset contrast that makes the selected algorithm's tradeoff easiest to explain in a demo.
- Operation counters:
  - Comparisons
  - Swaps
  - Writes
- Replay teaching cut that picks five narration checkpoints from the generated operation stream.
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

## Portfolio Demo Path

1. Load the `Reversed` preset.
2. Run `Compare All` to create a benchmark verdict.
3. Scrub through Quick Sort or Merge Sort to show replayable operations.
4. Use `Copy Benchmark Brief` for a repeatable writeup artifact.
5. Follow the Experiment Coach to stage one strong-fit run and one contrast run for the same algorithm.

## GitHub Pages Compatibility

- Pure static assets.
- No build pipeline required.
- Deploy from repository root.

## Future Improvements

- Add radix sort and shell sort.
- Add comparison history across multiple imported workloads.
