// Stopwatch state
let isRunning = false;
let elapsedTime = 0; // in milliseconds
let startTime = null;
let intervalId = null;

// Counter state
let cycleCount = 0;

// DOM elements
const timeDisplay = document.getElementById('timeDisplay');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const counterDisplay = document.getElementById('counterDisplay');
const historyList = document.getElementById('historyList');

// Event listeners
startBtn.addEventListener('click', startStopwatch);
stopBtn.addEventListener('click', stopStopwatch);
resetBtn.addEventListener('click', resetStopwatch);

/**
 * Start the stopwatch
 */
function startStopwatch() {
    if (isRunning) return;
    
    isRunning = true;
    startTime = Date.now() - elapsedTime;
    
    // Update button states
    startBtn.disabled = true;
    stopBtn.disabled = false;
    
    // Start the timer interval
    intervalId = setInterval(updateDisplay, 10);
}

/**
 * Stop the stopwatch and increment counter
 */
function stopStopwatch() {
    if (!isRunning) return;
    
    isRunning = false;
    clearInterval(intervalId);
    
    // Update button states
    startBtn.disabled = false;
    stopBtn.disabled = true;
    
    // Increment counter only if elapsed time > 0
    if (elapsedTime > 0) {
        cycleCount++;
        counterDisplay.textContent = cycleCount;
        
        // Add to history
        addToHistory();
    }
}

/**
 * Reset the stopwatch and clear elapsed time
 */
function resetStopwatch() {
    isRunning = false;
    clearInterval(intervalId);
    elapsedTime = 0;
    startTime = null;
    
    // Update display
    timeDisplay.textContent = '00:00:00';
    
    // Update button states
    startBtn.disabled = false;
    stopBtn.disabled = true;
}

/**
 * Update the time display
 */
function updateDisplay() {
    elapsedTime = Date.now() - startTime;
    timeDisplay.textContent = formatTime(elapsedTime);
}

/**
 * Format milliseconds to MM:SS:MS format
 * @param {number} ms - milliseconds
 * @returns {string} formatted time
 */
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    
    return `${padZero(minutes)}:${padZero(seconds)}:${padZero(milliseconds)}`;
}

/**
 * Pad a number with leading zero
 * @param {number} num - number to pad
 * @returns {string} padded number
 */
function padZero(num) {
    return String(num).padStart(2, '0');
}

/**
 * Add cycle to history list
 */
function addToHistory() {
    const time = formatTime(elapsedTime);
    const timestamp = new Date().toLocaleTimeString();
    const cycleNumber = cycleCount;
    
    // Remove empty state if it exists
    const emptyState = historyList.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    // Create history item
    const historyItem = document.createElement('li');
    historyItem.innerHTML = `
        <span class="cycle-number">Cycle #${cycleNumber}</span> — 
        <span class="cycle-time">${time}</span> 
        <span class="cycle-timestamp">(${timestamp})</span>
    `;
    
    // Add to top of list
    historyList.insertBefore(historyItem, historyList.firstChild);
    
    // Limit history to 20 items
    while (historyList.children.length > 20) {
        historyList.removeChild(historyList.lastChild);
    }
}
