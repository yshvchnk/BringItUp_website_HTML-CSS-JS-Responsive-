// глобальний слайдер
import Slider from './slider';
// наслідування класів
export default class MainSlider extends Slider{
    constructor(btns) {
        // отримуємо доступ до властивостей класу Слайдер, що залежать від цих аргументів
        super(btns);
    }

    // передаємо з + або - для позначення, вперед чи назад рухаємось
    showSlides(n) {
        // верхнє граничне значення
        if (n > this.slides.length) {
            this.slideIndex = 1;
        }
        // нижнє граничне значення
        if (n < 1) {
            this.slideIndex = this.slides.length;
        }
        // блок отримуємо до виконання функції showSlides, тому буде без помилок, також обгортаємо в try catch на випадок, якщо такого блока не існує
        try {
            this.hanson.style.opacity = '0';
            if (n === 3) {
                this.hanson.classList.add('animated');
                setTimeout(() => {
                    this.hanson.style.opacity = '1';
                    this.hanson.classList.add('slideInUp');
                }, 3000);
            } else {
                this.hanson.classList.remove('slideInUp');
            }
        }catch(e){}
        
        // приховуємо слайди і показуємо перший при відкритті сторінки
        
        for (const slide of this.slides) {
            slide.style.display = 'none';
            slide.classList.remove('animated');
            slide.classList.remove('fadeInDown');
        }
        
        this.slides[this.slideIndex - 1].style.display = 'block';
        this.slides[this.slideIndex - 1].classList.add('animated');
        this.slides[this.slideIndex - 1].classList.add('fadeInDown');
    }
    // перемикає слайди 
    plusSlides(n) {
        // обернути функцію showSlides і контролювати рух слайдів
        this.showSlides(this.slideIndex += n);
    }

    bindTriggers() {
        this.btns.forEach(item => {
            item.addEventListener('click', () => {
                this.plusSlides(1);
            });
            // при кліку на іконку переходимо на 1 слайд
            item.parentNode.previousElementSibling.addEventListener('click', (e) => {
                e.preventDefault();
                this.slideIndex = 1;
                this.showSlides(this.slideIndex);
            });
        });

        document.querySelectorAll('.prevmodule').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.plusSlides(-1);
            });
        });

        document.querySelectorAll('.nextmodule').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.plusSlides(1);
            });
        });
    }


    // головний метод, поєднує інші функції
    render() {
        if(this.container) {
            // універсальний скрипт, але щоб не було помилок на сторінках, де немає блока hanson використовуємо try catch, щоб код не ламав сторінку
            try {
                this.hanson = document.querySelector('.hanson');
            }catch(e){}
            // первинна ініціалізація
            this.showSlides(this.slideIndex);
            this.bindTriggers();
        }
    }
}
