document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. КАРУСЕЛЬ ИЗОБРАЖЕНИЙ (Swiper)
    // ==========================================
    const swiper = new Swiper('.swiper', {
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });


    // ==========================================
    // 2. ВАЛИДАЦИЯ ФОРМЫ (JustValidate)
    // ==========================================
    // Создаем экземпляр JustValidate, который доступен глобально
    const validator = new JustValidate('#form');

    validator
        .addField('#name', [
            {
                rule: 'required',
                errorMessage: 'Поле обязательно для заполнения',
            },
            {
                rule: 'minLength',
                value: 3,
                errorMessage: 'Минимум 3 символа',
            },
        ])
        .addField('#email', [
            {
                rule: 'required',
                errorMessage: 'Email обязателен',
            },
            {
                rule: 'email',
                errorMessage: 'Введите корректный email адрес',
            },
        ])
        .onSuccess((event) => {
            alert('Форма успешно валидирована и отправлена!');
            event.target.reset();
        });


    // ==========================================
    // 3. ПОСТРОЕНИЕ ГРАФИКА (Chart.js)
    // ==========================================
    const ctx = document.getElementById('myChart').getContext('2d');
    
    // Передаем массив данных через Array.of, защищая его от вырезания
    const weeklyData = Array.of(12, 19, 3, 5, 2, 3, 15);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
            datasets: [{
                label: 'Просмотры сайта',
                data: weeklyData,
                backgroundColor: 'rgba(52, 152, 219, 0.6)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });


    // ==========================================
    // 4. DRAG N' DROP (SortableJS)
    // ==========================================
    const dragList = document.getElementById('drag-list');
    
    Sortable.create(dragList, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        onEnd: function (evt) {
            console.log(`Элемент перемещен с позиции ${evt.oldIndex} на ${evt.newIndex}`);
        }
    });

});
