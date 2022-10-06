export default class Form {
    constructor(form) {
        this.forms = document.querySelectorAll(form);
        this.inputs = document.querySelectorAll('input');
        this.message = {
            loading: 'Loading...',
            success: 'Thanks!',
            failure: 'Error'
        };
        this.path = 'assets/question.php';
    }

    clearInputs() {
        this.inputs.forEach(item => {
            item.value = '';
        });
    }

    checkMailInputs() {
        const mailInputs = document.querySelectorAll('[type="email"]');

        mailInputs.forEach(input => {
            input.addEventListener('keypress', function (e) {
                if (e.key.match(/[^a-z 0-9 @ \.]/ig)) {
                    e.preventDefault();
                }
            });
        });
    }

    initMask() {
        let setCursorPosition = (pos, elem) => {
            // встановлюємо фокус на елементі
            elem.focus();
            // setSelectionRange вручну вствновлюємо видідення в інпуті, наче хтось виділив текст, якщо 2 аргументи однакові - курсор поставиться в цю позицію, але старі браузери не підтримують, тож робимо поліфіл
            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
            } else if (elem.createTextRange) {
                let range = elem.createTextRange();
                // настройка створеного діапазона
                range.collapse(true); //обєднує граничні точки діапазона - першу і останню позиції
                range.moveEnd('character', pos); //встановлюємо кінчеву точку виділення
                range.moveStart('character', pos); //встановлюємо першу точку виділення
                range.select(); //втановимо курсор в потрібну позицію
            }
        };

        function createMask(event) {
            // матриця для маски
            let matrix = '+1 (___) ___-____',
                i = 0,
                // працює на основі матриці (отримуємо не цифри), з матриці отримаємо значення, що не відповідають цифровим (статично)
                def = matrix.replace(/\D/g, ''),
                // беремо value у елемента з подією - працює на основі того, що ввів користувач (динамічно)
                val = this.value.replace(/\D/g, '');
            // якщо кількість цифр в матриці після видалення всіх не цифр буде більше чи рівне кількості в Value, значення міняємо на стандартне значення з матриці (якщо користувач хоче видалити +3, то не зможе)
            if (def.length >= val.length) {
                val = def;
            }
            // на основі матриці вкладаємо значення в value, яке ввів користувач, для відображення на сторінці
            // перебираємо символи з матриці і коли користувач вводить значення будемо замінять нижні підкреслювання на введені значення, при чому лишаємо дужки (а - технічний аргумент, куди підставляється кожен символ з матриці) символи повертаємо залежно від умов
            this.value = matrix.replace(/./g, function (a) {
                return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
            });

            if (event.type === 'blur') {
                if(this.value.length == 2){
                    this.value = '';
                }
            } else {
                // this - посилання на елемент в роботі
                setCursorPosition(this.value.length, this);
            }
        }

        let inputs = document.querySelectorAll('[name="phone"]');
        // при кожній події створюємо маску і щось буде відбуватись
        inputs.forEach(input => {
            input.addEventListener('input', createMask);
            input.addEventListener('focus', createMask);
            input.addEventListener('blur', createMask);
        });
    }

    async postData(url, data) {
        let res = await fetch(url, {
            method: "POST",
            body: data
        });
        return await res.text();
    }

    init() {
        this.checkMailInputs();
        this.initMask();
        this.forms.forEach(item => {
            // передаємо подію, щоб відмінити стандартну поведінку браузера
            item.addEventListener('submit', (e) => {
                e.preventDefault();

                let statusMessage = document.createElement('div');
                statusMessage.style.cssText = `
                    margin-top: 15px;
                    font-size: 18px;
                    color grey;
                `;
                // апендимо в батьківський елемент форми
                item.parentNode.appendChild(statusMessage);
                statusMessage.textContent = this.message.loading;

                const formData = new FormData(item);
                this.postData(this.path, formData)
                    // опрацювання запиту
                    .then(res => {
                        console.log(res);
                        statusMessage.textContent = this.message.success;
                    })
                    .catch(() => {
                        statusMessage.textContent = this.message.failure;
                    })
                    .finally(() => {
                        this.clearInputs();
                        setTimeout(() => {
                            statusMessage.remove();
                        }, 6000);
                    });
            });
        });
    }

}