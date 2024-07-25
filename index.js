let buttons = document.querySelectorAll('.btn');
let calc = document.querySelector('#calc');
let texto = document.querySelector('#texto');

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
            console.log('number key');
        } else if (
            action === 'factore' ||
            action === 'divide' ||
            action === 'multi' ||
            action === 'sub' ||
            action === 'some' ||
            action === 'equal' ||
            action === 'decimal'
        ) {
            button.classList.add('is-depressed');
            calc.dataset.previousKeyType = 'operator';

            if (action === 'decimal') {
                texto.value = texto.value + valor;
            }

            console.log(`Operator Key ${action}`);
        }

        console.log(valor);
    });
});
