// Глобальное хранилище данных JSON для клиентской фильтрации
let localJsonData = [];

// --- 1. AJAX ЗАГРУЗКА, ФИЛЬТРАЦИЯ И ПАРСИНГ XML ---
document.getElementById('btnLoad').addEventListener('click', () => {
    // Запрос JSON через AJAX
    fetch('/api/json')
        .then(res => res.json())
        .then(data => {
            localJsonData = data;
            document.getElementById('filterSelect').disabled = false;
            renderJson(localJsonData);
        })
        .catch(err => console.error('Ошибка JSON AJAX:', err));

    // Запрос XML через AJAX
    fetch('/api/xml')
        .then(res => res.text())
        .then(xmlString => {
            // Парсинг строки в XML-документ
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "application/xml");

            // Демонстрация Изменения XML данных на клиенте
            const items = xmlDoc.getElementsByTagName('item');
            for (let item of items) {
                let statusNode = item.getElementsByTagName('status')[0];
                if (statusNode && statusNode.textContent === 'Ожидается') {
                    statusNode.textContent = 'Поступление завтра! (Изменено)';
                }
            }

            renderXml(xmlDoc);
        })
        .catch(err => console.error('Ошибка XML AJAX:', err));
});

// Рендеринг JSON списка
function renderJson(data) {
    const container = document.getElementById('jsonOutput');
    container.innerHTML = '';
    data.forEach(item => {
        const li = document.createElement('li');
        li.className = 'fade-in';
        li.innerHTML = `<span>${item.name} (${item.category})</span> <strong>${item.price} ₽</strong>`;
        container.appendChild(li);
    });
}

// Фильтрация JSON
document.getElementById('filterSelect').addEventListener('change', (e) => {
    const val = e.target.value;
    let filtered = [...localJsonData];
    if (val === 'cheap') {
        filtered = localJsonData.filter(item => item.price < 50000);
    } else if (val === 'expensive') {
        filtered = localJsonData.filter(item => item.price >= 50000);
    }
    renderJson(filtered);
});

// Извлечение информации из XML и вывод на страницу
function renderXml(xmlDoc) {
    const container = document.getElementById('xmlOutput');
    container.innerHTML = '';
    const items = xmlDoc.getElementsByTagName('item');

    for (let i = 0; i < items.length; i++) {
        const title = items[i].getElementsByTagName('title')[0].textContent;
        const status = items[i].getElementsByTagName('status')[0].textContent;

        const li = document.createElement('li');
        li.className = 'fade-in';
        li.innerHTML = `<span>📦 ${title}</span> <span>${status}</span>`;
        container.appendChild(li);
    }
}

// --- 2. ОТПРАВКА ФОРМЫ (AJAX POST) ---
document.getElementById('ajaxForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const itemName = document.getElementById('itemName').value;
    const itemPrice = document.getElementById('itemPrice').value;

    fetch('/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName, itemPrice })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const statusText = document.getElementById('formStatus');
                statusText.textContent = data.message;
                document.getElementById('ajaxForm').reset();

                setTimeout(() => statusText.textContent = '', 3000);

                // Автоматическое обновление списков
                document.getElementById('btnLoad').click();
            }
        });
});

// --- 3. WEBSOCKETS (ДВУСТОРОННИЙ ОБМЕН) ---
const ws = new WebSocket(`ws://${window.location.host}`);
const wsLog = document.getElementById('wsLog');

ws.onopen = () => {
    appendLog(wsLog, 'Система: Соединение WS установлено.');
};

ws.onmessage = (event) => {
    appendLog(wsLog, `Получено: ${event.data}`);
};

document.getElementById('btnWsSend').addEventListener('click', () => {
    const input = document.getElementById('wsInput');
    if (input.value.trim() !== "") {
        ws.send(input.value);
        appendLog(wsLog, `Отправлено: ${input.value}`);
        input.value = '';
    }
});

// --- 4. SERVER-SENT EVENTS (SSE) (ОДНОСТОРОННИЙ ПОТОК) ---
const eventSource = new EventSource('/api/sse');
const sseLog = document.getElementById('sseLog');
const sseStatus = document.getElementById('sseStatus');

eventSource.onopen = () => {
    sseStatus.textContent = 'Подключено к SSE';
    sseStatus.style.color = 'green';
};

eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    appendLog(sseLog, `[${data.time}] ${data.msg}`);
};

eventSource.onerror = () => {
    sseStatus.textContent = 'Ошибка/Отключено';
    sseStatus.style.color = 'red';
};

// Вспомогательная функция ведения логов в консолях блоков
function appendLog(element, text) {
    const p = document.createElement('p');
    p.style.margin = '4px 0';
    p.textContent = text;
    element.appendChild(p);
    element.scrollTop = element.scrollHeight;
}
