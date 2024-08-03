let calculatorButtons = document.querySelectorAll('.button');

let displayInput = document.querySelector('#displayInput');

let displayFrame = document.querySelector('#displayFrame');

let expression = '';

let countMemory = [];

let resultMemory = [];

let highlightedDiv = false;

let booleanhistoryDiv = false;

let parentheseswasused = false;

let darkModeSlider = document.querySelector('#darkModeSlider');

let darkModeToggle = document.querySelector('#darkModeToggle');

let statusIndicators = document.querySelectorAll('.status-indicator');

let resultDisplay = document.querySelector('#resultDisplay');

let historyButton = document.querySelector('#historyButton');
let clearHistoryButton = document.querySelector('#clearHistoryButton');

let highlightedHistory = document.querySelector('#highlightedHistory');
let highlightedClearHistory = document.querySelector(
    '#highlightedClearHistory',
);

let calculatorhistoryDiv = document.createElement('div');

let deleteButton = document.querySelector('.deleteButton');

let closeButton = document.createElement('button');

// Function to evaluate the mathematical expression
function evaluateExpression(expression) {
    // Default to '0' if the expression is empty
    if (expression === '') {
        expression = '0';
    }

    // Replace "x" with "*" and percentages with their equivalent expression
    expression = expression.replace(/x/g, '*');
    expression = expression.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

    // Handle cases where a number is directly followed by a parenthesis
    expression = expression.replace(/(\d+(\.\d+)?)(\()/g, '$1*$3');

    // Remove trailing opening parentheses, spaces, or multiplication symbols
    while (
        expression.endsWith('(') ||
        expression.endsWith(' ') ||
        expression.endsWith('*')
    ) {
        expression = expression.slice(0, -1);
    }

    // Remove trailing operators if no number follows
    let lastChar = expression.slice(-1);
    if (
        /[\+\-*/]$/.test(lastChar) &&
        !/\d/.test(expression.slice(expression.lastIndexOf(lastChar) + 1))
    ) {
        expression = expression.slice(0, -1);
    }

    // Add missing closing parentheses if necessary
    let openParens = (expression.match(/\(/g) || []).length;
    let closeParens = (expression.match(/\)/g) || []).length;
    if (openParens > closeParens) {
        expression += ')'.repeat(openParens - closeParens);
    }

    // Validate the expression and evaluate it
    if (/^[\d+\-*/().%\s]+$/.test(expression)) {
        try {
            return new Function('return ' + expression)();
        } catch (e) {
            console.error('Error evaluating expression:', e);
        }
    } else {
        console.error('Expression contains invalid characters');
    }
}

// Function to save count and result memory to session storage
function saveMemoryToSessionStorage() {
    let CountMemoryString = JSON.stringify(countMemory);
    let ResultMemoryString = JSON.stringify(resultMemory);

    sessionStorage.setItem('countMemory', CountMemoryString);
    sessionStorage.setItem('resultMemory', ResultMemoryString);
}

// Function to display calculation history
function showHistory() {
    let title = document.createElement('h3');
    let span = document.createElement('span');

    title.textContent = 'Histórico';
    closeButton.textContent = 'X';

    span.classList.add('historyHeader');
    closeButton.classList.add('closeButton');

    calculatorhistoryDiv.innerHTML = '';

    let table = document.createElement('table');
    table.classList.add('historyTable');

    let headerRow = document.createElement('tr');
    headerRow.classList.add('headerRow');

    let countHeader = document.createElement('th');
    countHeader.textContent = 'Conta';

    let resultHeader = document.createElement('th');
    resultHeader.textContent = 'Resultado';

    headerRow.appendChild(countHeader);
    headerRow.appendChild(resultHeader);
    table.appendChild(headerRow);

    // Populate the table with history data
    for (let i = 0; i < countMemory.length; i++) {
        let rowData = document.createElement('tr');
        rowData.classList.add('tablebodyRow');

        let countCell = document.createElement('td');
        countCell.classList.add('cellStyle');

        if (countMemory[i].includes('*')) {
            countCell.textContent = countMemory[i].replace('*', 'X');
        } else {
            countCell.textContent = countMemory[i];
        }

        let resultCell = document.createElement('td');
        resultCell.textContent = resultMemory[i];

        rowData.appendChild(countCell);
        rowData.appendChild(resultCell);
        table.appendChild(rowData);

        // Set event listener to display selected history item
        countCell.addEventListener('click', () => {
            displayInput.value = countMemory[i];
            expression = countMemory[i];
            let quickexpressionResult = evaluateExpression(expression);
            resultDisplay.innerHTML = quickexpressionResult;
        });
    }

    span.appendChild(title);
    span.appendChild(closeButton);
    calculatorhistoryDiv.appendChild(span);
    calculatorhistoryDiv.appendChild(table);
}
// Function to reset parentheses buttons text
function cleaningParentheses() {
    calculatorButtons.forEach((button) => {
        if (button.classList.contains('parentheses')) {
            button.textContent = '( )';
        }
    });
}

// Function to toggle the sign of the last number in the display
function toggleSign() {
    let currentValue = displayInput.value;
    let lastNumberMatch = currentValue.match(/(-?\d+\.?\d*)$/);

    if (lastNumberMatch) {
        let lastNumber = lastNumberMatch[0];
        let toggledNumber = lastNumber.startsWith('-')
            ? lastNumber.substring(1)
            : '-' + lastNumber;
        displayInput.value =
            currentValue.substring(0, currentValue.length - lastNumber.length) +
            toggledNumber;
        expression = displayInput.value;

        let quick = evaluateExpression(expression);
        resultDisplay.innerHTML = quick;
    }
}

// Function to push expression to memory, replacing '*' with 'x'
function countmemoryPush(expression) {
    if (expression.includes('*')) {
        let testedExpression = expression.split('*').join('x');
        countMemory.push(testedExpression);
    } else {
        countMemory.push(expression);
    }
}

// Adding event listeners to all calculator buttons
calculatorButtons.forEach((button) => {
    button.addEventListener('click', () => {
        // Handle the 'equal' button click
        if (button.dataset.action === 'equal') {
            // Check if expression ends with an operator
            if (/[+\-*/]$/.test(expression)) {
                console.log(
                    'Expression ends with an operator. Cannot evaluate.',
                );
                return;
            } else {
                let result = evaluateExpression(expression);
                countmemoryPush(expression); // Save expression to memory
                resultMemory.push(result); // Save result to memory
                expression = result; // Update expression to the result
                cleaningParentheses(); // Clean parentheses if needed
                displayInput.value = expression;
                resultDisplay.innerHTML = '';
                saveMemoryToSessionStorage(); // Save memory to session storage
                if (parentheseswasused) {
                    parentheseswasused = false;
                }
                showHistory(); // Display updated history
            }
        } else {
            // Handle different button types
            if (button.classList.contains('operator')) {
                let r_value = button.dataset.value;
                expression += button.value;
                displayInput.value += r_value;
            } else if (button.classList.contains('clean')) {
                expression = '';
                displayInput.value = '';
                resultDisplay.innerHTML = '';
            } else {
                if (expression[0] == '0') {
                    expression = '';
                    displayInput.value = '';
                }

                // Handle parentheses button
                if (button.classList.contains('parentheses')) {
                    if (!parentheseswasused) {
                        button.value = '(';
                        button.textContent = '(';
                        parentheseswasused = true;
                    } else {
                        button.value = ')';
                        button.textContent = ')';
                        parentheseswasused = false;
                    }
                }

                // Handle decimal point and percentage buttons
                if (button.classList.contains('decimalPoint')) {
                    button.textContent = '.';
                }

                if (button.classList.contains('percentage')) {
                    button.textContent = '%';
                }

                // Handle sign toggle button
                if (button.classList.contains('toggleSign')) {
                    toggleSign();
                } else {
                    expression += button.value;
                    displayInput.value += button.value;
                    let quick = evaluateExpression(expression);
                    resultDisplay.innerHTML = quick;
                }
            }
        }
    });
});

// Initialize dark mode based on system preference
document.addEventListener('DOMContentLoaded', function () {
    let displayFrame = document.querySelector('#displayFrame');

    const prefersDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)',
    ).matches;

    if (prefersDarkMode) {
        darkModeSlider.dataset.mode = 'night';
        darkModeToggle.checked = true;
        document.body.classList.add('bodyDarkmode');
        statusIndicators.forEach((indicator) => {
            indicator.classList.add('indicatorDark');
        });
        if (displayFrame) {
            displayFrame.classList.add('displayFrameDark');
        } else {
            console.error('displayFrame not found in the DOM');
        }
        console.log('System dark mode preference detected');
    }

    // Initialize countMemory and resultMemory as empty arrays if null
    countMemory = JSON.parse(sessionStorage.getItem('countMemory')) || [];
    resultMemory = JSON.parse(sessionStorage.getItem('resultMemory')) || [];
});

// Toggle dark mode when slider is clicked
darkModeSlider.addEventListener('click', () => {
    let historyTable = document.querySelector('.historyTable');
    let displayFrame = document.querySelector('#displayFrame');

    if (darkModeSlider.dataset.mode === 'day') {
        // Enable dark mode
        document.body.classList.add('bodyDarkmode');
        if (historyTable) {
            historyTable.classList.add('tableDarkmode');
        }
        statusIndicators.forEach((indicator) => {
            indicator.classList.add('indicatorDark');
        });

        if (highlightedDiv) {
            highlightedHistory.classList.add('highlightedhistoryDark');
            highlightedHistory.classList.remove('highlightedhistoryLight');
        }

        if (displayFrame) {
            displayFrame.classList.add('displayFrameDark');
            displayFrame.classList.remove('FrameDisplays');
        } else {
            console.error('displayFrame not found in the DOM');
        }

        darkModeSlider.dataset.mode = 'night';
        console.log('Dark mode activated');
    } else {
        // Disable dark mode
        darkModeSlider.dataset.mode = 'day';
        document.body.classList.remove('bodyDarkmode');

        if (historyTable) {
            historyTable.classList.remove('tableDarkmode');
        }

        statusIndicators.forEach((indicator) => {
            indicator.classList.remove('indicatorDark');
        });

        if (highlightedDiv) {
            highlightedHistory.classList.remove('highlightedhistoryDark');
            highlightedHistory.classList.add('highlightedhistoryLight');
        }

        if (displayFrame) {
            displayFrame.classList.add('FrameDisplays');
            displayFrame.classList.remove('displayFrameDark');
        } else {
            console.error('displayFrame not found in the DOM');
        }

        console.log('Dark mode deactivated');
    }
});

historyButton.addEventListener('click', () => {
    // Toggle the visibility of the history section
    if (booleanhistoryDiv == false) {
        // Show history
        calculatorhistoryDiv.id = 'History';
        calculatorhistoryDiv.classList.add('First', 'draggable');
        document.body.appendChild(calculatorhistoryDiv);
        booleanhistoryDiv = true;
        showHistory();
    } else {
        // Hide history
        calculatorhistoryDiv.remove();
        booleanhistoryDiv = false;
    }

    // Toggle the highlight effect based on dark mode
    if (highlightedDiv == false) {
        if (darkModeSlider.dataset.mode === 'night') {
            highlightedHistory.classList.add('highlightedhistoryDark');
            highlightedHistory.classList.remove('highlightedhistoryLight');
        } else {
            highlightedHistory.classList.remove('highlightedhistoryDark');
            highlightedHistory.classList.add('highlightedhistoryLight');
        }
        highlightedDiv = true;
    } else {
        highlightedHistory.classList.remove('highlightedhistoryDark');
        highlightedHistory.classList.remove('highlightedhistoryLight');
        highlightedDiv = false;
    }

    // Enable dragging functionality for the history div
    const draggable = document.querySelector('.draggable');
    let isDragging = false;
    let offsetX, offsetY;

    if (draggable) {
        draggable.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - draggable.offsetLeft;
            offsetY = e.clientY - draggable.offsetTop;
            draggable.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                draggable.style.left = mouseX - offsetX + 'px';
                draggable.style.top = mouseY - offsetY + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            draggable.style.cursor = 'grab';
        });
    }
});

clearHistoryButton.addEventListener('click', () => {
    // Show visual feedback for clearing history
    highlightedClearHistory.classList.add('buttonclearFilled');
    setTimeout(() => {
        highlightedClearHistory.classList.remove('buttonclearFilled');
    }, 3000);

    // Clear history data and update the UI
    countMemory = [];
    resultMemory = [];
    saveMemoryToSessionStorage();
    showHistory();
});

// Handle the click event for the delete button
deleteButton.addEventListener('click', () => {
    // Check if the last character is a parenthesis
    let lastChar = expression.slice(-1);
    let isParenthesis = lastChar === '(' || lastChar === ')';

    // Remove the last character from the display and expression
    let count = displayInput.value;
    let displayElements = count.slice(0, -1);
    displayInput.value = displayElements;

    let express = expression.slice(0, -1);
    expression = express;

    // If the last character was a parenthesis, adjust the boolean
    if (isParenthesis) {
        let openParens = (expression.match(/\(/g) || []).length;
        let closeParens = (expression.match(/\)/g) || []).length;

        // Update the boolean based on the remaining parentheses
        parentheseswasused = openParens > closeParens;
    }

    // Check if the last character is an operator
    let testedExpression = /[+\-*/]$/.test(expression);

    // If the last character was an operator, exit
    if (testedExpression) {
        return;
    } else {
        // Update the result display
        let quick = evaluateExpression(expression);
        if (quick !== undefined) {
            resultDisplay.innerHTML = quick;
        }
    }
});

// Handle the click event for the close button
closeButton.addEventListener('click', () => {
    // Remove the history div
    calculatorhistoryDiv.remove();
    booleanhistoryDiv = false;

    // Toggle highlighted history based on dark mode
    if (highlightedDiv == false) {
        if (darkModeSlider.dataset.mode === 'night') {
            highlightedHistory.classList.add('highlightedhistoryDark');
            highlightedHistory.classList.remove('highlightedhistoryLight');
        } else {
            highlightedHistory.classList.remove('highlightedhistoryDark');
            highlightedHistory.classList.add('highlightedhistoryLight');
        }
        highlightedDiv = true;
    } else {
        highlightedHistory.classList.remove('highlightedhistoryDark');
        highlightedHistory.classList.remove('highlightedhistoryLight');
        highlightedDiv = false;
    }
});
