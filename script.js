// Updated Explanations Object
const explanations = {
    bubble: {
        title: "Bubble Sort",
        desc: "A rhythmic exchange where heavier elements sink to the end of the collection.",
        complexity: "O(n²)"
    },
    merge: {
        title: "Merge Sort",
        desc: "A divide-and-conquer philosophy. It fractures the collection into individual units before harmonizing them back together in order.",
        complexity: "O(n log n)"
    },
    quick: {
        title: "Quick Sort",
        desc: "Selection of a 'pivot' acts as a mirror, reflecting elements to their rightful sides until the chaos is structured.",
        complexity: "O(n log n)"
    }
};

// --- Merge Sort Logic ---
async function mergeSort(start, end) {
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);
    
    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    await merge(start, mid, end);
}

async function merge(start, mid, end) {
    let left = array.slice(start, mid + 1);
    let right = array.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;
    const bars = document.querySelectorAll('.bar');

    while (i < left.length && j < right.length) {
        bars[k].classList.add('active');
        await sleep(speed);
        if (left[i] <= right[j]) {
            array[k] = left[i];
            i++;
        } else {
            array[k] = right[j];
            j++;
        }
        bars[k].style.height = `${array[k] * 3}px`;
        bars[k].classList.remove('active');
        k++;
    }

    while (i < left.length) {
        array[k] = left[i];
        bars[k].style.height = `${array[k] * 3}px`;
        i++; k++;
    }
    while (j < right.length) {
        array[k] = right[j];
        bars[k].style.height = `${array[k] * 3}px`;
        j++; k++;
    }
}

// --- Quick Sort Logic ---
async function quickSort(start, end) {
    if (start >= end) return;
    let index = await partition(start, end);
    await Promise.all([
        quickSort(start, index - 1),
        quickSort(index + 1, end)
    ]);
}

async function partition(start, end) {
    const bars = document.querySelectorAll('.bar');
    let pivotValue = array[end];
    let pivotIndex = start;
    bars[end].style.backgroundColor = "var(--accent-color)";

    for (let i = start; i < end; i++) {
        bars[i].classList.add('active');
        if (array[i] < pivotValue) {
            [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
            bars[i].style.height = `${array[i] * 3}px`;
            bars[pivotIndex].style.height = `${array[pivotIndex] * 3}px`;
            pivotIndex++;
        }
        await sleep(speed);
        bars[i].classList.remove('active');
    }
    [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
    bars[pivotIndex].style.height = `${array[pivotIndex] * 3}px`;
    bars[end].style.height = `${array[end] * 3}px`;
    bars[end].style.backgroundColor = "var(--bar-color)";
    return pivotIndex;
}

// Updated Trigger
document.getElementById('start-btn').addEventListener('click', async () => {
    const selected = document.getElementById('algo-select').value;
    // UI Update
    algoTitle.innerText = explanations[selected].title;
    algoDesc.innerText = explanations[selected].desc;
    document.getElementById('complexity').innerText = explanations[selected].complexity;
    
    if (selected === 'bubble') await bubbleSort();
    if (selected === 'merge') await mergeSort(0, array.length - 1);
    if (selected === 'quick') await quickSort(0, array.length - 1);
    
    // Final Polish: Mark all as sorted
    document.querySelectorAll('.bar').forEach(bar => bar.classList.add('sorted'));
});