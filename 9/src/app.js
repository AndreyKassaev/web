import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routing/user.routes.js';

const app = express();
const PORT = 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware для работы с JSON и статическими файлами (клиентская страница)
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Подключение роутера под префиксом /api/users
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Сервер успешно запущен на http://localhost:${PORT}`);
});
