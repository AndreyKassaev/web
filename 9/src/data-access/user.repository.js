import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.resolve('data/db.json');

// Вспомогательная функция для безопасного чтения файла
async function readData() {
  try {
    const fileContent = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    // Если файла нет, возвращаем дефолтную структуру
    return { users: [] };
  }
}

// Вспомогательная функция для записи в файл
async function writeData(data) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Инициализация дефолтных данных при первом запуске
const currentData = await readData();
if (currentData.users.length === 0) {
  await writeData({
    users: [
      { id: 1, name: "Иван Иванов", email: "ivan@example.com" },
      { id: 2, name: "Анна Петрова", email: "anna@example.com" }
    ]
  });
}

export const userRepository = {
  async getAll() {
    const data = await readData();
    return data.users;
  },

  async add(user) {
    const data = await readData();
    const newId = data.users.length > 0 ? Math.max(...data.users.map(u => u.id)) + 1 : 1;
    const newUser = { id: newId, ...user };
    
    data.users.push(newUser);
    await writeData(data);
    return newUser;
  }
};
