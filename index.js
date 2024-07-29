// Selecionando todos os botões da calculadora
let calculatorButtons = document.querySelectorAll('.button');

// Selecionando o elemento de exibição da calculadora
let displayElement = document.querySelector('#display');

// String para armazenar a expressão matemática
let expression = '';

// Selecionando o toggle switch do modo escuro
let darkModeToggle = document.querySelector('#darkModeSlider');

// Selecionando o checkbox do modo escuro
let darkModeCheckbox = document.querySelector('#darkModeToggle');

// Selecionando todos os indicadores de status
let statusIndicators = document.querySelectorAll('.status-indicator');

// Função para avaliar a expressão matemática
function evaluateExpression(expression) {
    if (/^[\d+\-*/().\s]+$/.test(expression)) {
        try {
            let func = new Function('return ' + expression);
            return func();
        } catch (e) {
            console.error('Erro ao avaliar a expressão:', e);
        }
    } else {
        console.error('Expressão contém caracteres inválidos');
    }
}

// Adicionando event listeners para os botões da calculadora
calculatorButtons.forEach((button) => {
    button.addEventListener('click', () => {
        if (button.dataset.action === 'equal') {
            let result = evaluateExpression(expression);
            displayElement.value = result;
        } else {
            let value = button.textContent;
            expression += button.value;
            displayElement.value += value;
        }
    });
});

// Adicionando event listener para o toggle switch do modo escuro
darkModeToggle.addEventListener('click', () => {
    if (darkModeToggle.dataset.mode === 'day') {
        darkModeToggle.dataset.mode = 'night';
        document.body.classList.add('darkmode');
        statusIndicators.forEach((indicator) => {
            indicator.classList.add('dark');
        });
        console.log('Modo escuro ativado');
    } else {
        darkModeToggle.dataset.mode = 'day';
        document.body.classList.remove('darkmode');
        statusIndicators.forEach((indicator) => {
            indicator.classList.remove('dark');
        });
        console.log('Modo escuro desativado');
    }
});

// Verifica o modo preferido pelo sistema ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    const prefersDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)',
    ).matches;

    if (prefersDarkMode) {
        darkModeToggle.dataset.mode = 'night';
        darkModeCheckbox.checked = true;
        document.body.classList.add('darkmode');
        statusIndicators.forEach((indicator) => {
            indicator.classList.add('dark');
        });
        console.log('Preferência de modo escuro do sistema detectada');
    }
});
