// один прототипний слайдер
export default class Slider {
    // передача обєкта як аргумента і його деструктуризація і присвоєння лефолтних значень null, щоб не видавав помилку querySelector
    constructor({ container = null,
        btns = null,
        next = null,
        prev = null,
        activeClass = '',
        animate,
        autoplay } = {}) {
        this.container = document.querySelector(container);
        try{this.slides = this.container.children;} catch(e){}
        this.btns = document.querySelectorAll(btns);
        this.prev = document.querySelector(prev);
        this.next = document.querySelector(next);
        this.slideIndex = 1;
        this.activeClass = activeClass;
        this.animate = animate;
        this.autoplay = autoplay;
    }
    
}