# Algorithm Visualizer

Watch eight sorting algorithms work through the same array: Bubble, Insertion, Counting, Merge, Shell, Heap, Quick, and Radix Sort.

Each algorithm records comparisons, swaps, and writes before playback starts. You can pause, step forward or back, or jump to a point in the run. Compare All runs the algorithms on the same input and lists their operation counts.

## Try it

1. Choose the Reversed preset.
2. Click Compare All and compare the counts.
3. Select Quick Sort and press Step to follow its partitioning.
4. Try Nearly Sorted with Insertion Sort and compare the amount of work.
5. Use Compare Six Presets to run Randomized, Nearly Sorted, Reversed, Few Unique, Organ Pipe, and Sawtooth inputs.

The size slider supports 10 to 80 values. The speed control changes the animation delay, not the sorting algorithm.

## Reading the results

- Comparisons check the order of two values.
- Swaps exchange a pair of values.
- Writes place a value into an array slot.
- Total operations adds the recorded comparisons, swaps, and writes.

These counts describe this implementation on a particular input. They are not elapsed-time measurements and do not include every instruction the browser executes. Complexity estimates are rough comparisons, not exact predictions of the step count.

The suggestion panels use the array's order, repeated values, and numeric range to recommend an algorithm to try. Check those suggestions with Compare All.

## Use your own arrays

Enter values separated by commas, spaces, or newlines, or import a JSON, CSV, or text file. Counting and Radix Sort support signed integers. Counting Sort is most useful when the integer range is small.

Copy Share Link saves the selected algorithm, array, and controls in the URL. Save Workload keeps an array in this browser. You can also export arrays, saved examples, comparison history, and comparison CSV files.

Copy Comparison Notes and Copy Preset Results put the current results on your clipboard.

## How it works

- `index.html` contains the controls and result sections.
- `style.css` handles the bar chart, layout, and operation colors.
- `script.js` generates operation lists and plays them back against the displayed array.

Recording the operations separately makes it possible to rebuild any earlier frame when you step backward.

This is a static HTML, CSS, and JavaScript browser demo. It runs from the repository root on GitHub Pages.

## Run locally

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

Check JavaScript syntax with:

```bash
node --check script.js
```

Before publishing, try a preset, run Compare All, step forward and back, and export then import an array. Compare several input patterns before making a claim about an algorithm's performance.

