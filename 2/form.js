function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    // path=/ гарантирует, что кука будет доступна на вкладке result.html
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Strict";
}

const form = document.getElementById('mainForm');
const username = document.getElementById('username');
const email = document.getElementById('email');
const fileInput = document.getElementById('fileInput');
const dropArea = document.getElementById('dropArea');
const fileMsg = document.getElementById('fileMsg');

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        fileMsg.textContent = `Выбран файл: ${e.target.files[0].name}`;
        validateFile();
    }
});

// Drag & Drop
['dragenter', 'dragover'].forEach(name => {
    dropArea.addEventListener(name, (e) => { e.preventDefault(); dropArea.classList.add('dragover'); });
});
['dragleave', 'drop'].forEach(name => {
    dropArea.addEventListener(name, (e) => { e.preventDefault(); dropArea.classList.remove('dragover'); });
});
dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        fileMsg.textContent = `Выбран файл: ${files[0].name}`;
        validateFile();
    }
});

function setValidity(groupElement, isValid) {
    if (isValid) groupElement.classList.remove('invalid');
    else groupElement.classList.add('invalid');
    return isValid;
}

function validateFile() {
    const fileGroup = document.getElementById('fileGroup');
    const fileError = document.getElementById('fileError');
    const files = fileInput.files;

    if (!files || files.length === 0) {
        fileError.textContent = 'Пожалуйста, добавьте изображение.';
        return setValidity(fileGroup, false);
    }

    const file = files[0];
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        fileError.textContent = 'Размер файла превышает 5 МБ.';
        return setValidity(fileGroup, false);
    }

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
        fileError.textContent = 'Разрешены только картинки (JPG, PNG).';
        return setValidity(fileGroup, false);
    }

    return setValidity(fileGroup, true);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = setValidity(document.getElementById('nameGroup'), username.value.trim().length >= 2);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = setValidity(document.getElementById('emailGroup'), emailRegex.test(email.value.trim()));
    const isFileValid = validateFile();

    if (isNameValid && isEmailValid && isFileValid) {
        // Конвертируем картинку в Base64 строку для передачи на новую страницу
        const reader = new FileReader();
        reader.onload = function (event) {
            // Сохраняем текстовые данные и картинку в локальное хранилище
            localStorage.setItem('userData', JSON.stringify({
                name: username.value.trim(),
                email: email.value.trim(),
                image: event.target.result // Строка base64 изображения
            }));

            // Создаем куку сессии на 1 день
            const fakeSessionId = 'sess_' + Math.random().toString(36).substring(2, 11);
            setCookie('session_token', fakeSessionId, 1);

            // Перенаправляем на страницу результатов
            window.location.href = 'result.html';
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
});
