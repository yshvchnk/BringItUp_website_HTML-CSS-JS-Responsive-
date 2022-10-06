import Slider from './slider';

export default class MiniSlider extends Slider {
    constructor(container, next, prev, activeClass, animate, autoplay) {
        super(container, next, prev, activeClass, animate, autoplay);
    }

    decorizeSlides() {
        for (const slide of this.slides) {
            slide.classList.remove(this.activeClass);
            if (this.animate) {
                slide.querySelector('.card__title').style.opacity = '0.4';
                slide.querySelector('.card__controls-arrow').style.opacity = '0';
            }
        }

        // якщо активний слайд не кнопка, додаємо йому клас
        if (!this.slides[0].closest('button')) {
            this.slides[0].classList.add(this.activeClass);
        }
        
        if (this.animate) {
            this.slides[0].querySelector('.card__title').style.opacity = '1';
            this.slides[0].querySelector('.card__controls-arrow').style.opacity = '1';
        }
    }

    nextSlide() {
        // переміщаємо кнопки в кінець, так як вони в контейнері і сприймаються як слайди
        if (this.slides[1].tagName == "BUTTON" && this.slides[2].tagName == "BUTTON") {
            this.container.appendChild(this.slides[0]); //slide
            this.container.appendChild(this.slides[1]); //btn
            this.container.appendChild(this.slides[2]);
            this.decorizeSlides(); //btn
            // якщо на 2й позиції лишилась одна кнопка(коли ходить вперед-назад)
        } else if (this.slides[1].tagName == "BUTTON") {
            this.container.appendChild(this.slides[0]); //slide
            this.container.appendChild(this.slides[1]);
            this.decorizeSlides(); //btn
        } else{
            // перший елемент в кінець списку
            this.container.appendChild(this.slides[0]);
            this.decorizeSlides();
        }
    }

    bindTriggers() {
        this.next.addEventListener('click', () => this.nextSlide());

        this.prev.addEventListener('click', () => {
            // запускаємо з кінця, перебираємо кожен елемент масиву всередині this.slides і якщо останній елемент - кнопка - пропускаємо його
            for (let i = this.slides.length - 1; i > 0; i--){
                if (this.slides[i].tagName !== "BUTTON") {
                    // останній елемент ставимо перед першим
                    let active = this.slides[i];
                    this.container.insertBefore(active, this.slides[0]);
                    this.decorizeSlides();
                    // перериваємо, коли останній слайд перейшов на першу позицію
                    break; 
                }


            }

            
            let active = this.slides[this.slides.length - 1];
            this.container.insertBefore(active, this.slides[0]);
            this.decorizeSlides();
        });
    }

    init() {
        try {
            this.container.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            overflow: hidden;
            align-items: flex-start;
            `;

            this.bindTriggers();
            this.decorizeSlides();

            if (this.autoplay) {
                setInterval(() => this.nextSlide(), 5000);
            }
        } catch(e){}
        
    }
}