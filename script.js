const container = document.getElementById('array-container');
const algoTitle = document.getElementById('algo-title');
const algoDesc = document.getElementById('algo-description');
const complexitySpan = document.getElementById('complexity');
const themeBtn = document.getElementById('theme-toggle');
const algoSelect = document.getElementById('algo-select');

let array = [];
let speed = 450;
let isSorting = false;

const explanations = {
    bubble: {
        title: "Bubble Sort",
        desc: "A rhythmic exchange where heavier elements sink to the end of the collection through local comparisons.",
        complexity: "O(n²)"
    },
    merge: {
        title: "Merge Sort",
        desc: "A divide-and-conquer philosophy. It fractures the collection into individual units before harmonizing them back together.",
        complexity: "O(n log n)"
    },
    quick: {
        title: "Quick Sort",
        desc: "A pivot acts as a mirror, reflecting elements to their rightful sides until the chaos is structured.",
        complexity: "O(n log n)"
    }
};

// Update UI Text
function updateUI() {
    const info = explanations[algoSelect.value];
    algoTitle.innerText = info.title;
    algoDesc.innerText = info.desc;
    complexitySpan.innerText = info.complexity;
}

// Create & Render Bars
function createArray(size = 14) {
    if (isSorting) return;
    container.innerHTML = '';
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 80) + 10);
    array.forEach(val => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${val * 4}px`;
        container.appendChild(bar);
    });
    updateUI();
}

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

// Theme Toggle Fix
themeBtn.addEventListener('click', () => {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    themeBtn.innerText = newTheme === 'light' ? 'Midnight Mode' : 'Daylight Mode';
});

// Update UI when dropdown changes
algoSelect.addEventListener('change', updateUI);

async function visualSwap(i, j, bars) {
    [array[i], array[j]] = [array[j], array[i]];
    bars[i].style.height = `${array[i] * 4}px`;
    bars[j].style.height = `${array[j] * 4}px`;
}

// Algorithms (Logic remains same, but wrapped in safety)
async function bubbleSort() {
    const bars = document.querySelectorAll('.bar');
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            bars[j].classList.add('active');
            bars[j+1].classList.add('active');
            if (array[j] > array[j+1]) {
                await sleep(speed);
                await visualSwap(j, j + 1, bars);
            }
            await sleep(speed);
            bars[j].classList.remove('active');
            bars[j+1].classList.remove('active');
        }
    }
}

async function quickSort(start, end) {
    if (start >= end) return;
    const index = await partition(start, end);
    await quickSort(start, index - 1);
    await quickSort(index + 1, end);
}

async function partition(start, end) {
    const bars = document.querySelectorAll('.bar');
    const pivotValue = array[end];
    let pivotIndex = start;
    for (let i = start; i < end; i++) {
        bars[i].classList.add('active');
        if (array[i] < pivotValue) {
            await visualSwap(i, pivotIndex, bars);
            pivotIndex++;
            await sleep(speed);
        }
        bars[i].classList.remove('active');
    }
    await visualSwap(pivotIndex, end, bars);
    return pivotIndex;
}

async function mergeSort(start, end) {
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);
    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    await merge(start, mid, end);
}

async function merge(start, mid, end) {
    const bars = document.querySelectorAll('.bar');
    let left = array.slice(start, mid + 1);
    let right = array.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;
    while (i < left.length && j < right.length) {
        bars[k].classList.add('active');
        await sleep(speed);
        if (left[i] <= right[j]) {
            array[k] = left[i]; i++;
        } else {
            array[k] = right[j]; j++;
        }
        bars[k].style.height = `${array[k] * 4}px`;
        bars[k].classList.remove('active');
        k++;
    }
    while (i < left.length) {
        array[k] = left[i];
        bars[k].style.height = `${array[k] * 4}px`;
        i++; k++;
    }
    while (j < right.length) {
        array[k] = right[j];
        bars[k].style.height = `${array[k] * 4}px`;
        j++; k++;
    }
}

document.getElementById('start-btn').addEventListener('click', async () => {
    if (isSorting) return;
    isSorting = true;
    const selection = algoSelect.value;
    
    if (selection === 'bubble') await bubbleSort();
    if (selection === 'quick') await quickSort(0, array.length - 1);
    if (selection === 'merge') await mergeSort(0, array.length - 1);

    document.querySelectorAll('.bar').forEach(b => b.classList.add('sorted'));
    isSorting = false;
});

document.getElementById('reset-btn').addEventListener('click', () => createArray());
document.getElementById('speed').addEventListener('input', (e) => speed = 1050 - e.target.value);

// Initialize
createArray();