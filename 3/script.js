// Находим кнопку по её ID
const button = document.getElementById('colorButton');

// Функция для генерации случайного HEX-цвета
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Добавляем событие клика на кнопку
button.addEventListener('click', () => {
    // Меняем цвет фона всего документа
    document.body.style.backgroundColor = getRandomColor();
});
