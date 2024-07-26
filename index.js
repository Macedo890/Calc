let buttons = document.querySelectorAll('.btn');
let calc = document.querySelector('#calc');
let texto = document.querySelector('#texto');

let operator;
let numbers = [];

function calculate(n1, operator, n2) {
    let result = '';

    if (operator === 'some') {
        result = parseFloat(n1) + parseFloat(n2);
    } else if (operator === 'sub') {
        result = parseFloat(n1) - parseFloat(n2);
    } else if (operator === 'multi') {
        result = parseFloat(n1) * parseFloat(n2);
    } else if (operator === 'divide') {
        result = parseFloat(n1) / parseFloat(n2);
    }

    return result;
}

buttons.forEach((button) => {
    button.addEventListener('click', () => {
        let valor = button.value;
        let action = button.dataset.action;
        let previousKeyType = calc.dataset.previousKeyType;

        if (!action) {
            if (texto.value === '0' || previousKeyType === 'operator') {
                texto.value = valor;
            } else {
                texto.value = texto.value + valor;
            }

            buttons.forEach((k) => {
                k.classList.remove('is-depressed');
            });

            calc.dataset.previousKeyType = 'number';
        } else if (
            action === 'factore' ||
            action === 'divide' ||
            action === 'multi' ||
            action === 'sub' ||
            action === 'some' ||
            action === 'equal' ||
            action === 'decimal'
        ) {
            if (texto.value !== '0' && texto.value !== '') {
                button.classList.add('is-depressed');
            }

            calc.dataset.previousKeyType = 'operator';

            if (
                action !== 'equal' &&
                action !== 'decimal' &&
                texto.value !== '0' &&
                texto.value !== ''
            ) {
                operator = action;
                numbers[0] = texto.value;
                texto.value = '';
            }

            if (action === 'decimal') {
                calc.dataset.previousKeyType = 'decimal';
                if (!texto.value.includes('.')) {
                    texto.value = texto.value + valor;
                }
            }

            if (action === 'equal') {
                const secondValue = texto.value;
                numbers[1] = secondValue;
                texto.value = calculate(numbers[0], operator, numbers[1]);
                operator = undefined;
            }
        }
    });
});
