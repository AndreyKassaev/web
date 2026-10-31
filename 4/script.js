const display = document.getElementById('display');
let currentInput = '';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

function appendNumber(number) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    if (number === '.' && currentInput.includes('.')) return;
    if (currentInput === '' && number === '.') currentInput = '0';
    currentInput += number;
    updateDisplay(currentInput);
}

function appendOperator(op) {
    if (currentInput === '' && previousInput === '') return;
    if (currentInput === '' && previousInput !== '') {
        operator = op;
        return;
    }
    if (previousInput !== '') {
        calculateResult();
    }
    operator = op;
    previousInput = currentInput;
    shouldResetDisplay = true;
}

function calculateResult() {
    if (operator === null || shouldResetDisplay) return;

    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert("Ошибка: Деление на ноль!");
                clearDisplay();
                return;
            }
            result = prev / current;
            break;
        case '^':
            result = Math.pow(prev, current);
            break;
        default:
            return;
    }

    // Округление для избежания проблем с плавающей точкой (например, 0.1 + 0.2)
    result = Math.round(result * 100000000) / 100000000;

    currentInput = result.toString();
    operator = null;
    previousInput = '';
    shouldResetDisplay = true;
    updateDisplay(currentInput);
}

function calculateSqrt() {
    if (currentInput === '') return;
    const current = parseFloat(currentInput);
    if (isNaN(current)) return;
    if (current < 0) {
        alert("Ошибка: Нельзя извлечь корень из отрицательного числа!");
        clearDisplay();
        return;
    }
    let result = Math.sqrt(current);
    result = Math.round(result * 100000000) / 100000000;
    currentInput = result.toString();
    shouldResetDisplay = true;
    updateDisplay(currentInput);
}

function clearDisplay() {
    currentInput = '';
    previousInput = '';
    operator = null;
    updateDisplay('0');
}

function updateDisplay(value) {
    display.value = value;
}