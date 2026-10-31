// 1. Реализация массива объектов Фильм
const movies = [
    { title: "Начало", genre: "Фантастика", director: "Кристофер Нолан", year: 2010 },
    { title: "Криминальное чтиво", genre: "Криминал", director: "Квентин Тарантино", year: 1994 },
    { title: "Интерстеллар", genre: "Фантастика", director: "Кристофер Нолан", year: 2014 },
    { title: "Матрица", genre: "Фантастика", director: "Лана Вачовски, Лилли Вачовски", year: 1999 },
    { title: "Бойцовский клуб", genre: "Триллер", director: "Дэвид Финчер", year: 1999 },
    { title: "Джентльмены", genre: "Комедия", director: "Гай Ричи", year: 2019 }
];

// 2. Функция сортировки названий в алфавитном порядке и их вывода
function getSortedTitles(moviesArray) {
    // Создаем массив названий, сортируем его с учетом локали (русского языка)
    return moviesArray
        .map(movie => movie.title)
        .sort((a, b) => a.localeCompare(b));
}

// 3. Функция фильтрации по жанру
function filterByGenre(moviesArray, targetGenre) {
    return moviesArray.filter(movie => movie.genre.toLowerCase() === targetGenre.toLowerCase());
}

// 4. Функция фильтрации по году (выпущенные ПОСЛЕ указанного года)
function filterByYear(moviesArray, targetYear) {
    return moviesArray.filter(movie => movie.year > targetYear);
}

// 5. Функция фильтрации по режиссеру
function filterByDirector(moviesArray, targetDirector) {
    return moviesArray.filter(movie => movie.director.toLowerCase() === targetDirector.toLowerCase());
}

// 6. Реализация вьюхи (Рендеринг таблицы)
function renderTable(moviesArray) {
    const tableBody = document.getElementById('tableBody');
    const tableHeader = document.getElementById('tableHeader');

    // Восстанавливаем стандартную шапку таблицы
    tableHeader.innerHTML = `
                <th>Название</th>
                <th>Жанр</th>
                <th>Режиссер</th>
                <th>Год выпуска</th>
            `;

    // Очищаем тело таблицы
    tableBody.innerHTML = '';

    if (moviesArray.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Фильмы не найдены</td></tr>`;
        return;
    }

    // Заполняем строками
    moviesArray.forEach(movie => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td><strong>${movie.title}</strong></td>
                    <td>${movie.genre}</td>
                    <td>${movie.director}</td>
                    <td>${movie.year}</td>
                `;
        tableBody.appendChild(row);
    });
}

// --- Вспомогательные функции для демонстрации работы кнопок ---

function showSortedNames() {
    const sortedTitles = getSortedTitles(movies);
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');

    // Перестраиваем таблицу только под вывод названий
    tableHeader.innerHTML = `<th>Название фильма (Отсортировано по алфавиту)</th>`;
    tableBody.innerHTML = '';

    sortedTitles.forEach(title => {
        const row = document.createElement('tr');
        row.innerHTML = `<td><strong>${title}</strong></td>`;
        tableBody.appendChild(row);
    });

    // Вывод в консоль согласно условию задачи ("выводящих названия...")
    console.log("Отсортированные названия:", sortedTitles);
}

function filterByGenreDemo(genre) {
    const filtered = filterByGenre(movies, genre);
    renderTable(filtered);
}

function filterByYearDemo(year) {
    const filtered = filterByYear(movies, year);
    renderTable(filtered);
}

function filterByDirectorDemo(director) {
    const filtered = filterByDirector(movies, director);
    renderTable(filtered);
}

// Первоначальная отрисовка таблицы при загрузке страницы
renderTable(movies);