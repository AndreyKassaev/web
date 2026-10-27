function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Удаление сессии
function logout() {
    // Стираем куку, устанавливая её срок действия в прошлое
    document.cookie = "session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict";
    localStorage.removeItem('userData'); // Очищаем данные формы
    window.location.href = 'index.html'; // Возвращаемся к форме
}

// Инициализация страницы результатов
window.addEventListener('DOMContentLoaded', () => {
    const sessionToken = getCookie('session_token');
    const badge = document.getElementById('sessionBadge');
    
    // Проверяем статус куки сессии
    if (sessionToken) {
        badge.textContent = "Сессия активна (Кука проверена)";
        badge.style.background = "var(--success)";
        document.getElementById('viewToken').textContent = sessionToken;
    } else {
        badge.textContent = "Сессия отсутствует!";
        badge.style.background = "var(--error)";
        document.getElementById('viewToken').textContent = "Не авторизован";
    }

    // Извлекаем сохраненные данные формы
    const savedData = localStorage.getItem('userData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        document.getElementById('viewName').textContent = data.name;
        document.getElementById('viewEmail').textContent = data.email;

        // Если в данных есть картинка, выводим её в тег img
        if (data.image) {
            const imgEl = document.getElementById('viewImage');
            imgEl.src = data.image;
            imgEl.style.display = 'block';
            document.getElementById('noImage').style.display = 'none';
        }
    }
});
