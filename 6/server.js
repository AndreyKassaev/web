const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os'); // Подключаем модуль для работы с ОС
const { WebSocketServer } = require('ws');

// Конфигурация сервера
const PORT = 3006;

// Исходные данные для демонстрации
let jsonData = [
    { id: 3, name: "Ноутбук", price: 75000, category: "Электроника" },
    { id: 1, name: "Смартфон", price: 45000, category: "Электроника" },
    { id: 2, name: "Книга JS", price: 1200, category: "Книги" }
];

let xmlData = `<?xml version="1.0" encoding="UTF-8"?>
<store>
    <item id="101">
        <title>Кофемашина</title>
        <status>В наличии</status>
    </item>
    <item id="102">
        <title>Электрочайник</title>
        <status>Ожидается</status>
    </item>
</store>`;

// Функция для расчета загрузки CPU (сравнивает тики процессора)
function getCPUUsage(callback) {
    const stats1 = os.cpus();
    setTimeout(() => {
        const stats2 = os.cpus();
        let totalDiff = 0;
        let idleDiff = 0;

        for (let i = 0; i < stats1.length; i++) {
            const s1 = stats1[i].times;
            const s2 = stats2[i].times;
            
            const t1 = s1.user + s1.nice + s1.sys + s1.idle + s1.irq;
            const t2 = s2.user + s2.nice + s2.sys + s2.idle + s2.irq;
            
            totalDiff += (t2 - t1);
            idleDiff += (s2.idle - s1.idle);
        }

        const percentage = totalDiff === 0 ? 0 : 100 - Math.floor((100 * idleDiff) / totalDiff);
        callback(percentage);
    }, 1000); // Интервал замера 1 секунда
}

// Создание HTTP сервера
const server = http.createServer((req, res) => {
    
    // 1. ОБРАБОТКА СТАТИЧЕСКИХ ФАЙЛОВ (HTML, CSS, JS)
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const urlPath = decodeURIComponent(parsedUrl.pathname);
    
    const safeUrl = urlPath === '/' ? 'index.html' : urlPath.substring(1);
    const filePath = path.join(__dirname, safeUrl);
    const extname = path.extname(filePath);
    
    const mimeTypes = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'text/javascript; charset=utf-8'
    };

    if (mimeTypes[extname] && fs.existsSync(filePath)) {
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Ошибка чтения файла на сервере');
            } else {
                res.writeHead(200, { 'Content-Type': mimeTypes[extname] });
                res.end(content);
            }
        });
        return;
    }

    // 2. AJAX GET: Получение JSON
    if (urlPath === '/api/json' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(jsonData));
    } 
    
    // 3. AJAX GET: Получение XML
    else if (urlPath === '/api/xml' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' });
        res.end(xmlData);
    } 
    
    // 4. AJAX POST: Получение данных из формы
    else if (urlPath === '/api/form' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const parsedData = JSON.parse(body);
                console.log('Получены данные формы через AJAX:', parsedData);
                
                const newId = jsonData.length ? Math.max(...jsonData.map(d => d.id)) + 1 : 1;
                jsonData.push({
                    id: newId,
                    name: parsedData.itemName,
                    price: Number(parsedData.itemPrice),
                    category: "Общее"
                });

                res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: true, message: 'Товар успешно добавлен!' }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: false, message: 'Некорректный формат данных' }));
            }
        });
    }
    
    // 5. Server-Sent Events (SSE) канал: Метрики Linux-сервера в реальном времени
    else if (urlPath === '/api/sse') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        });

        // Каждые 3 секунды собираем метрики и шлем клиенту
        const sseInterval = setInterval(() => {
            getCPUUsage((cpuLoad) => {
                // Расчет оперативной памяти
                const totalMem = os.totalmem();
                const freeMem = os.freemem();
                const usedMem = totalMem - freeMem;
                
                // Переводим в Мегабайты для читаемости
                const usedMemMb = Math.round(usedMem / 1024 / 1024);
                const totalMemMb = Math.round(totalMem / 1024 / 1024);
                const memPercentage = Math.round((usedMem / totalMem) * 100);

                const serverTime = new Date().toLocaleTimeString();
                
                const metrics = {
                    time: serverTime,
                    msg: `📊 CPU: ${cpuLoad}% | RAM: ${usedMemMb}MB / ${totalMemMb}MB (${memPercentage}%) | Uptime: ${Math.round(os.uptime())}s`
                };

                // Проверяем, что соединение всё ещё открыто перед отправкой
                if (!res.writableEnded) {
                    res.write(`data: ${JSON.stringify(metrics)}\n\n`);
                }
            });
        }, 3000);

        req.on('close', () => {
            clearInterval(sseInterval);
            res.end();
        });
    } 
    
    // 404 для всех остальных ресурсов
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Ресурс не найден');
    }
});

// Создание WebSocket сервера поверх HTTP
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('WebSocket: Клиент подключился');

    ws.on('message', (message) => {
        const textMessage = message.toString();
        console.log(`WebSocket получено: ${textMessage}`);
        ws.send(`Сервер подтверждает получение: "${textMessage}" в ${new Date().toLocaleTimeString()}`);
    });

    ws.on('close', () => console.log('WebSocket: Клиент отключился'));
});

// Запуск приложения
server.listen(PORT, () => {
    console.log(`Сервер успешно запущен на http://localhost:${PORT}`);
});
