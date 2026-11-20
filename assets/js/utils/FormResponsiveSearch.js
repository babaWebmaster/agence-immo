export class FormResponsive {

    constructor() {
        this.loyer = document.querySelector(
            '.hero__search-form__field--loyer'
        );

        this.wrapperFirst = document.querySelector(
            '.hero__search-form__wrapper-first'
        );

        this.wrapperSecond = document.querySelector(
            '.hero__search-form__wrapper-second'
        );

        this.mediaQuery = window.matchMedia(
            '(max-width: 1199.98px)'
        );

        this.moveLoyer();

        this.mediaQuery.addEventListener(
            'change',
            () => this.moveLoyer()
        );
    }

    moveLoyer() {

        if (this.mediaQuery.matches) {
            this.wrapperSecond.prepend(this.loyer);
            return;
        }

        this.wrapperFirst.append(this.loyer);
    }
}